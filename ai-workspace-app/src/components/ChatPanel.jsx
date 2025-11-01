import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  FiCheck,
  FiCheckSquare,
  FiChevronDown,
  FiCopy,
  FiCornerDownLeft,
  FiFolder,
  FiMessageSquare,
  FiMoon,
  FiPaperclip,
  FiSend,
  FiSettings,
  FiStar,
  FiSun,
  FiTool,
  FiUser,
  FiUserPlus,
  FiX,
  FiZap,
} from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import 'highlight.js/styles/github-dark.css'
import ConfigurationModal from './ConfigurationModal'
import DionePowersScreen from './DionePowersScreen'
import MessageDetailModal from './MessageDetailModal'
import AccountModal from './AccountModal'
import InviteCollaboratorModal from './InviteCollaboratorModal'
import MemberDetailsModal from './MemberDetailsModal'
import Button from './ui/Button'
import './ChatPanel.css'

// Import Zustand stores
import { useChatStore, useProjectStore, useThemeStore, useWorkspaceStore, useTaskStore, useAuthStore } from '../store'

// Animation variants defined outside component to prevent re-creation
const planeIconVariants = {
  normal: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
  },
  launch: {
    // Path: Start → Flies up-right off-screen → Returns from bottom-left → Lands
    x: [0, 60, 160, 100, -120, -40, 0],
    y: [0, -80, -160, 80, 140, 40, 0],
    rotate: [0, -25, -50, -20, 30, 10, 0],
    scale: [1, 1.05, 0.8, 0.7, 0.9, 1, 1],
    opacity: [1, 1, 0.3, 0.4, 0.8, 1, 1],
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      times: [0, 0.15, 0.4, 0.5, 0.75, 0.9, 1],
    },
  },
}

// Memoized Send Button to prevent animation restarts on parent re-renders
const AnimatedSendButton = memo(({ shouldAnimate, animationKey, onAnimationComplete }) => {
  return (
    <Button type="submit" variant="soft" size="md" animated={false}>
      <motion.div
        key={`plane-animation-${animationKey}`}
        variants={planeIconVariants}
        initial="normal"
        animate={shouldAnimate ? 'launch' : 'normal'}
        onAnimationComplete={onAnimationComplete}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <FiSend size={20} />
      </motion.div>
    </Button>
  )
})

AnimatedSendButton.displayName = 'AnimatedSendButton'

function ChatPanel({
  documents = [],         // From App.jsx
  libraries = [],         // From App.jsx
  scratchpadTabs = []     // From App.jsx
}) {
  // Zustand stores - replace all props!
  const chatSessions = useChatStore((state) => state.chatSessions)
  const currentChatId = useChatStore((state) => state.currentChatId)
  const getCurrentChat = useChatStore((state) => state.getCurrentChat)
  const getMessages = useChatStore((state) => state.getCurrentMessages)

  // Memoize currentMessages to avoid Zustand snapshot caching issues
  const currentMessages = useMemo(() => {
    return getMessages ? getMessages() : []
  }, [getMessages, chatSessions, currentChatId])

  const sendMessage = useChatStore((state) => state.sendMessage)
  const createNewChat = useChatStore((state) => state.createNewChat)
  const setCurrentChatId = useChatStore((state) => state.setCurrentChatId)
  const deleteChat = useChatStore((state) => state.deleteChat)
  const addChatToProject = useChatStore((state) => state.addChatToProject)
  const removeChatFromProject = useChatStore((state) => state.removeChatFromProject)

  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  const user = useAuthStore((state) => state.user)

  const chatProjects = useProjectStore((state) => state.chatProjects)
  const createProject = useProjectStore((state) => state.createProject)
  const deleteProject = useProjectStore((state) => state.deleteProject)
  const renameProject = useProjectStore((state) => state.renameProject)

  const removeChatMember = useChatStore((state) => state.removeChatMember)

  const attachedWorkspaces = useWorkspaceStore((state) => state.attachedWorkspaces)
  const removeAttachment = useWorkspaceStore((state) => state.removeAttachment)
  const clearAllAttachments = useWorkspaceStore((state) => state.clearAllAttachments)

  const tasks = useTaskStore((state) => state.tasks)
  const getSortedTasks = useTaskStore((state) => state.getSortedTasks)

  // Local UI state (these stay as useState since they're component-specific)
  const [inputValue, setInputValue] = useState('')
  const [showTaskMention, setShowTaskMention] = useState(false)
  const [taskMentionQuery, setTaskMentionQuery] = useState('')
  const [taskMentionCursorPos, setTaskMentionCursorPos] = useState(0)
  const [taskMentionHighlightIndex, setTaskMentionHighlightIndex] = useState(0)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [attachedFiles, setAttachedFiles] = useState([])
  const [openConfigModal, setOpenConfigModal] = useState(null) // 'user', 'tool', 'task', or null
  const [showDionePowersScreen, setShowDionePowersScreen] = useState(false) // For guideline editor
  const [showAccountModal, setShowAccountModal] = useState(false) // For account modal
  const [showInviteModal, setShowInviteModal] = useState(false) // For invite collaborator modal
  const [selectedMember, setSelectedMember] = useState(null) // For member details modal
  const [prevChatCount, setPrevChatCount] = useState(0) // Track previous chat count
  const [animatingChatId, setAnimatingChatId] = useState(null) // Currently animating
  const [pendingAnimationId, setPendingAnimationId] = useState(null) // Queued for animation
  const [shouldAnimateNewChatBtn, setShouldAnimateNewChatBtn] = useState(false)
  const [shouldAnimateSendBtn, setShouldAnimateSendBtn] = useState(false)
  const isAnimatingSendRef = useRef(false) // Track animation state synchronously
  const animationKeyRef = useRef(0) // Unique key for each animation to prevent re-render issues
  const [copiedMessageIndex, setCopiedMessageIndex] = useState(null)
  const [replyingToIndex, setReplyingToIndex] = useState(null)
  const [replyingToContent, setReplyingToContent] = useState(null)
  const [showProjectInput, setShowProjectInput] = useState(false)
  const [projectInputValue, setProjectInputValue] = useState('')
  const [draggedChatId, setDraggedChatId] = useState(null)
  const [hoveredProjectId, setHoveredProjectId] = useState(null)
  const [expandedProjects, setExpandedProjects] = useState({}) // Track expanded state for each project
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const taskMentionDropdownRef = useRef(null)
  const taskMentionItemsRef = useRef([])
  const { scrollYProgress } = useScroll({ container: messagesContainerRef })

  // Detect new chat during render (before effect runs) OR use animating chat
  // This ensures the component mounts with correct initial state
  const newChatId =
    chatSessions.length > prevChatCount && !animatingChatId ? currentChatId : animatingChatId

  const plusButtonVariants = {
    normal: {
      scale: 1,
      boxShadow: '0 0 10px rgba(100, 108, 255, 0.3)',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    animate: {
      scale: [1, 1.15, 1.05, 1],
      boxShadow: [
        '0 0 10px rgba(100, 108, 255, 0.3)',
        '0 0 30px rgba(100, 108, 255, 1)',
        '0 0 25px rgba(100, 108, 255, 0.8)',
        '0 0 15px rgba(100, 108, 255, 0.5)',
      ],
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  }

  const springTransition = {
    type: 'spring',
    damping: 15,
    stiffness: 100,
    mass: 0.8,
  }

  const newChatVariants = {
    initial: {
      opacity: 0,
      y: 40,
      scale: 0.5,
      boxShadow: '0 0 0px rgba(100, 108, 255, 0)',
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      boxShadow: [
        '0 0 0px rgba(100, 108, 255, 0)',
        '0 0 30px rgba(100, 108, 255, 0.9)',
        '0 0 15px rgba(100, 108, 255, 0.4)',
        '0 0 0px rgba(100, 108, 255, 0)',
      ],
      transition: {
        opacity: {
          type: 'tween',
          duration: 0.25,
          ease: 'easeOut',
        },
        y: {
          type: 'tween',
          duration: 0.35,
          ease: [0.34, 1.56, 0.64, 1], // Bouncy easing
        },
        scale: {
          type: 'tween',
          duration: 0.35,
          ease: [0.34, 1.56, 0.64, 1], // Bouncy easing
        },
        boxShadow: {
          duration: 0.5,
          delay: 0.1,
          times: [0, 0.3, 0.7, 1],
          ease: 'easeOut',
        },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      y: -20,
      transition: {
        opacity: {
          type: 'tween',
          duration: 0.4,
          ease: 'easeOut',
        },
        scale: {
          type: 'tween',
          duration: 0.4,
          ease: 'easeOut',
        },
        y: {
          type: 'tween',
          duration: 0.4,
          ease: 'easeOut',
        },
      },
    },
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages])

  // Handle new chats - queue them if animation is running
  useEffect(() => {
    if (chatSessions.length > prevChatCount) {
      const newChatId = currentChatId

      if (!animatingChatId) {
        // No animation running, start immediately
        setAnimatingChatId(newChatId)
        setPendingAnimationId(null)
      } else {
        // Animation running, queue this for later
        setPendingAnimationId(newChatId)
      }

      setPrevChatCount(chatSessions.length)
    } else if (chatSessions.length < prevChatCount) {
      // Chat deleted
      setPrevChatCount(chatSessions.length)
      setAnimatingChatId(null)
      setPendingAnimationId(null)
    }
  }, [chatSessions.length])

  // When current animation finishes, start pending animation
  useEffect(() => {
    if (!animatingChatId) return

    const timer = setTimeout(() => {
      if (pendingAnimationId) {
        // Start animating the pending chat
        setAnimatingChatId(pendingAnimationId)
        setPendingAnimationId(null)
      } else {
        // No pending, just clear
        setAnimatingChatId(null)
      }
    }, 30)

    return () => clearTimeout(timer)
  }, [animatingChatId, pendingAnimationId])

  // Auto-expand textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [inputValue])

  // Auto-scroll task mention dropdown to keep highlighted item visible
  useEffect(() => {
    if (!showTaskMention || !taskMentionDropdownRef.current) {
      // Clean up refs when dropdown is closed
      if (!showTaskMention) {
        taskMentionItemsRef.current = []
      }
      return
    }

    // Get the currently filtered tasks to validate highlight index
    const filteredTasks = getSortedTasks()
      .filter((task) =>
        task.title.toLowerCase().includes(taskMentionQuery.toLowerCase())
      )
      .slice(0, 10)

    // If highlight index is out of bounds, don't scroll
    if (taskMentionHighlightIndex >= filteredTasks.length) {
      return
    }

    const highlightedItem = taskMentionItemsRef.current[taskMentionHighlightIndex]
    if (!highlightedItem) return

    const dropdownRect = taskMentionDropdownRef.current.getBoundingClientRect()
    const itemRect = highlightedItem.getBoundingClientRect()

    // Check if item is above the dropdown
    if (itemRect.top < dropdownRect.top) {
      highlightedItem.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    // Check if item is below the dropdown
    else if (itemRect.bottom > dropdownRect.bottom) {
      highlightedItem.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [taskMentionHighlightIndex, showTaskMention, taskMentionQuery])

  // Clean up task mention refs when query changes to prevent stale refs
  useEffect(() => {
    taskMentionItemsRef.current = []
  }, [taskMentionQuery])

  // Stable callback for animation completion
  const handleAnimationComplete = useCallback(() => {
    setShouldAnimateSendBtn(false)
    isAnimatingSendRef.current = false
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim() || attachedFiles.length > 0 || attachedWorkspaces.length > 0) {
      // Trigger paper plane animation only if not already animating
      // Use ref for synchronous check to prevent race conditions
      if (!isAnimatingSendRef.current) {
        isAnimatingSendRef.current = true
        animationKeyRef.current += 1 // Increment key to ensure unique animation instance
        setShouldAnimateSendBtn(true)
      }
      sendMessage(inputValue, attachedFiles, {
        replyingToIndex: replyingToIndex,
        replyingToContent: replyingToContent,
        attachedWorkspaces: attachedWorkspaces,
      })
      setInputValue('')
      setAttachedFiles([])
      handleClearReply()
      clearAllAttachments() // Clear all attachments after sending
    }
  }

  const handleTaskMention = (value, cursorPos) => {
    // Find the last @ before cursor position
    const lastAtPos = value.lastIndexOf('@', cursorPos - 1)

    if (lastAtPos !== -1) {
      // Check if there's a space before @  or if it's at the start
      const beforeAt = lastAtPos === 0 ? '' : value[lastAtPos - 1]
      if (lastAtPos === 0 || beforeAt === ' ' || beforeAt === '\n') {
        // Extract query after @
        const query = value.substring(lastAtPos + 1, cursorPos)

        // If query doesn't contain space, show mention dropdown
        if (!query.includes(' ')) {
          setShowTaskMention(true)
          setTaskMentionQuery(query)
          setTaskMentionCursorPos(lastAtPos)
          setTaskMentionHighlightIndex(0) // Reset highlight when showing dropdown
          return
        }
      }
    }

    setShowTaskMention(false)
    setTaskMentionQuery('')
  }

  const handleTaskSelection = (task) => {
    // Create a detailed task reference with all information
    const getPriorityLabel = (priority) => {
      const labels = { high: '高', medium: '中', low: '低' }
      return labels[priority] || priority
    }

    const getStatusLabel = (status) => {
      const labels = { in_progress: '進行中', not_started: '未着手', completed: '完了' }
      return labels[status] || status
    }

    const taskInfo = `【タスク】${task.title}
優先度: ${getPriorityLabel(task.priority)} | ステータス: ${getStatusLabel(task.status)}
説明: ${task.description}`

    // Replace @ and query with detailed task reference
    const beforeMention = inputValue.substring(0, taskMentionCursorPos)
    const afterMention = inputValue.substring(taskMentionCursorPos + 1 + taskMentionQuery.length)
    const newValue = beforeMention + taskInfo + afterMention

    setInputValue(newValue)
    setShowTaskMention(false)
    setTaskMentionQuery('')
    setTaskMentionHighlightIndex(0) // Reset highlight

    // Move cursor after the inserted task reference
    setTimeout(() => {
      if (textareaRef.current) {
        const newPos = beforeMention.length + taskInfo.length
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos
        textareaRef.current.focus()
      }
    }, 0)
  }

  const handleKeyDown = (e) => {
    // If mention dropdown is open and arrow keys pressed
    if (showTaskMention && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault()
      const filteredTasks = getSortedTasks()
        .filter((task) =>
          task.title.toLowerCase().includes(taskMentionQuery.toLowerCase())
        )
        .slice(0, 10)

      if (e.key === 'ArrowDown') {
        setTaskMentionHighlightIndex((prev) =>
          prev < filteredTasks.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        setTaskMentionHighlightIndex((prev) => (prev > 0 ? prev - 1 : 0))
      }
      return
    }

    // If mention dropdown is open and Enter is pressed, select highlighted task
    if (showTaskMention && e.key === 'Enter') {
      e.preventDefault()
      const filteredTasks = getSortedTasks()
        .filter((task) =>
          task.title.toLowerCase().includes(taskMentionQuery.toLowerCase())
        )
        .slice(0, 10)

      if (filteredTasks.length > 0 && taskMentionHighlightIndex < filteredTasks.length) {
        handleTaskSelection(filteredTasks[taskMentionHighlightIndex])
      }
      return
    }

    // Close mention dropdown on Escape
    if (e.key === 'Escape' && showTaskMention) {
      e.preventDefault()
      setShowTaskMention(false)
      setTaskMentionHighlightIndex(0)
    }

    // Ctrl+Enter or Cmd+Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
    // Shift+Enter for line break - let default behavior happen
    // Regular Enter for line break - prevent form submission
    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      if (showTaskMention) {
        e.preventDefault()
        return
      }
      e.preventDefault()
      // Insert line break manually
      const textarea = e.target
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = inputValue.substring(0, start) + '\n' + inputValue.substring(end)
      setInputValue(newValue)
      // Move cursor after the inserted line break
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1
      }, 0)
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      const fileData = files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      }))
      setAttachedFiles([...attachedFiles, ...fileData])
    }
  }

  const handleRemoveFile = (index) => {
    const newFiles = [...attachedFiles]
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview)
    }
    newFiles.splice(index, 1)
    setAttachedFiles(newFiles)
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  const handleAugmentInput = () => {
    if (!inputValue.trim()) return

    // Fine-tune the input by adding clarity and context
    const fineTunedPrompt = `${inputValue.trim()}

Please provide a detailed, clear, and actionable response.`

    setInputValue(fineTunedPrompt)
    textareaRef.current?.focus()

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
        }
      }, 0)
    }
  }

  const handleCopyMessage = async (content, index) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageIndex(index)
      setTimeout(() => {
        setCopiedMessageIndex(null)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy message:', err)
    }
  }

  const handleReplyMessage = (content, index) => {
    setReplyingToIndex(index)
    setReplyingToContent(content)
    // Scroll to input and focus
    textareaRef.current?.focus()
  }

  const handleClearReply = () => {
    setReplyingToIndex(null)
    setReplyingToContent(null)
  }

  const handleCreateProjectSubmit = () => {
    if (projectInputValue.trim()) {
      createProject(projectInputValue.trim())
      setProjectInputValue('')
      setShowProjectInput(false)
    }
  }

  const handleDragStart = (e, chatId) => {
    setDraggedChatId(chatId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', chatId)
  }

  const handleDragEnd = () => {
    setDraggedChatId(null)
    setHoveredProjectId(null)
  }

  const handleProjectDragOver = (e, projectId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setHoveredProjectId(projectId)
  }

  const handleProjectDragLeave = () => {
    setHoveredProjectId(null)
  }

  const handleProjectDrop = (e, projectId) => {
    e.preventDefault()
    const chatId = parseInt(e.dataTransfer.getData('text/plain'))
    if (chatId && draggedChatId) {
      addChatToProject(chatId, projectId)
      setDraggedChatId(null)
      setHoveredProjectId(null)
    }
  }

  const handleRemoveFromProjectDrop = (e) => {
    e.preventDefault()
    const chatId = parseInt(e.dataTransfer.getData('text/plain'))
    if (chatId && draggedChatId) {
      // Remove from project
      removeChatFromProject(chatId)
      setDraggedChatId(null)
      setHoveredProjectId(null)
    }
  }

  const handleUngroupedDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setHoveredProjectId('ungrouped')
  }

  const handleUngroupedDragLeave = () => {
    setHoveredProjectId(null)
  }

  const handleInviteCollaborators = (invitedUsers) => {
    // In a real app, this would send invitations via API
    console.log('Invited users:', invitedUsers)

    // Add members and system messages for each invited user joining the chat
    invitedUsers.forEach((user, index) => {
      setTimeout(() => {
        // Add member to chat
        useChatStore.getState().addChatMember(currentChatId, {
          id: user.id,
          displayName: user.displayName,
          email: user.email,
          role: user.role,
        })
        // Add system message
        useChatStore.getState().addSystemMessage(user.displayName, 'join')
      }, index * 300) // Stagger the notifications
    })
  }

  const handleRemoveMember = (chatId, memberId) => {
    // Find the member being removed to get their name
    const currentChat = useChatStore.getState().getCurrentChat()
    const member = currentChat?.members?.find((m) => m.id === memberId)

    if (member) {
      // Add system message for member leaving
      useChatStore.getState().addSystemMessage(member.displayName, 'leave')
    }

    // Remove the member
    removeChatMember(chatId, memberId)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / k ** i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType.startsWith('video/')) return '🎥'
    if (fileType.startsWith('audio/')) return '🎵'
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('word') || fileType.includes('document')) return '📝'
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊'
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📊'
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return '📦'
    return '📎'
  }

  const getMemberInitials = (name) => {
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '今'
    if (diffMins < 60) return `${diffMins}分前`
    if (diffHours < 24) return `${diffHours}時間前`
    if (diffDays < 7) return `${diffDays}日前`

    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
  }

  const formatDateCompact = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '今'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`

    return date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
  }

  const getDioneIcon = (message) => {
    const messageType = message.type || 'dione' // Default to 'dione' if not specified
    const messageStatus = message.status || 'success' // Default to 'success' if not specified

    let iconPath = ''

    if (messageType === 'tool') {
      if (messageStatus === 'error') {
        // Tool error - use tool_error.png (same for both themes)
        iconPath = '/sample_assets/dione/tool_error.png'
      } else {
        // Tool success
        iconPath =
          theme === 'dark'
            ? '/sample_assets/dione/tool_dark.png'
            : '/sample_assets/dione/tool_light.png'
      }
    } else if (messageType === 'thinking') {
      // Thinking (usually success state)
      iconPath =
        theme === 'dark'
          ? '/sample_assets/dione/dione_thinking_dark.png'
          : '/sample_assets/dione/dione_thinking_light.png'
    } else {
      // Dione type (normal AI response)
      if (messageStatus === 'error') {
        iconPath =
          theme === 'dark'
            ? '/sample_assets/dione/dione_error_dark.png'
            : '/sample_assets/dione/dione_error_light.png'
      } else {
        iconPath =
          theme === 'dark'
            ? '/sample_assets/dione/dione_dark.png'
            : '/sample_assets/dione/dione_light.png'
      }
    }

    return iconPath
  }

  const getMessageLabel = (message) => {
    if (message.role === 'user') return null // No label for user messages

    const messageType = message.type || 'dione'

    switch (messageType) {
      case 'tool':
        return 'TOOL'
      case 'thinking':
        return 'THINKING'
      case 'dione':
      default:
        return 'DIONE'
    }
  }

  const getMessageTypeIcon = (message) => {
    if (message.role === 'user') return null // No icon for user messages

    const messageType = message.type || 'dione'

    switch (messageType) {
      case 'tool':
        return <FiTool size={16} />
      case 'thinking':
        return <FiZap size={16} />
      case 'dione':
      default:
        return <FiMessageSquare size={16} />
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''

    const date = new Date(timestamp)
    const now = new Date()

    // Check if the message is from today
    const isToday = date.toDateString() === now.toDateString()

    // Format time as HH:MM
    const timeString = date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    if (isToday) {
      return timeString
    } else {
      // Show date and time for older messages
      const dateString = date.toLocaleDateString('ja-JP', {
        month: 'numeric',
        day: 'numeric',
      })
      return `${dateString} ${timeString}`
    }
  }

  // Track mouse position to detect text selection vs click
  const mouseDownPos = useRef({ x: 0, y: 0 })

  const handleMessageMouseDown = (event) => {
    mouseDownPos.current = { x: event.clientX, y: event.clientY }
  }

  const handleMessageClick = (message, event) => {
    // Calculate mouse movement between mousedown and click
    const mouseMoved = Math.abs(event.clientX - mouseDownPos.current.x) > 5 ||
                       Math.abs(event.clientY - mouseDownPos.current.y) > 5

    // Don't open modal if user dragged (text selection)
    if (mouseMoved) {
      return
    }

    // Don't open modal if user has selected text
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      return
    }

    // Only show modal for AI messages that have detailed info
    if (
      message.role === 'ai' &&
      (message.trace || message.traceback || message.toolArgs || message.toolResults)
    ) {
      setSelectedMessage(message)
    }
  }

  const handleCloseModal = () => {
    setSelectedMessage(null)
  }

  const renderAttachments = (attachments) => {
    if (!attachments || attachments.length === 0) return null

    return (
      <div className="message-attachments">
        {attachments.map((file, index) => (
          <div key={index} className="message-attachment">
            {file.preview ? (
              <img src={file.preview} alt={file.name} className="message-attachment-image" />
            ) : (
              <div className="message-attachment-file">
                <div className="message-attachment-icon">{getFileIcon(file.type)}</div>
                <div className="message-attachment-info">
                  <div className="message-attachment-name">{file.name}</div>
                  <div className="message-attachment-size">{formatFileSize(file.size)}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="chat-panel">
      {/* Chat History Sidebar */}
      <div className="chat-history-sidebar">
        <div className="chat-history-header">
          <h3>チャット履歴</h3>
          <div className="chat-history-header-buttons">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="surface"
                size="md"
                onClick={() => setShowProjectInput(!showProjectInput)}
                title={
                  showProjectInput ? 'プロジェクト作成をキャンセル' : '新しいプロジェクトを作成'
                }
                className="project-toggle-button"
              >
                <FiFolder size={20} />
              </Button>
            </motion.div>
            <motion.div
              variants={plusButtonVariants}
              initial="normal"
              animate={shouldAnimateNewChatBtn ? 'animate' : 'normal'}
              onAnimationComplete={() => setShouldAnimateNewChatBtn(false)}
            >
              <Button
                variant="surface"
                size="md"
                onClick={() => {
                  setShouldAnimateNewChatBtn(true)
                  createNewChat()
                }}
                title="新しいチャット"
                animated={false}
                className="new-chat-button"
              >
                +
              </Button>
            </motion.div>
          </div>
        </div>
        <motion.div className="chat-history-list" layout>
          {/* Create Project Input - At the top of list */}
          {showProjectInput && (
            <div className="project-input-container-top">
              <input
                type="text"
                value={projectInputValue}
                onChange={(e) => setProjectInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateProjectSubmit()
                  if (e.key === 'Escape') {
                    setShowProjectInput(false)
                    setProjectInputValue('')
                  }
                }}
                placeholder="プロジェクト名を入力..."
                className="project-name-input"
                autoFocus
              />
              <Button
                variant="surface"
                size="md"
                onClick={handleCreateProjectSubmit}
                title="プロジェクトを作成"
              >
                ✓
              </Button>
            </div>
          )}


          <AnimatePresence>
            {/* Projects Section */}
            {chatProjects && chatProjects.length > 0 && (
              <div key="projects-section" className="chat-projects-section">
                {chatProjects.map((project) => {
                  const isExpanded = expandedProjects[project.id] !== false
                  const projectChats = chatSessions.filter((chat) => chat.projectId === project.id)

                  return (
                    <div key={project.id} className="chat-project-group">
                      <div
                        className="project-header-wrapper"
                        onClick={() => setExpandedProjects((prev) => ({
                          ...prev,
                          [project.id]: !(prev[project.id] !== false),
                        }))}
                        onDragOver={(e) => handleProjectDragOver(e, project.id)}
                        onDragLeave={handleProjectDragLeave}
                        onDrop={(e) => handleProjectDrop(e, project.id)}
                      >
                        <motion.div
                          className={`project-header ${hoveredProjectId === project.id ? 'drag-over' : ''}`}
                          style={{ cursor: 'pointer' }}
                        >
                          <motion.button
                            className="project-toggle"
                            onClick={(e) => {
                              e.stopPropagation() // Prevent parent handler
                              setExpandedProjects((prev) => ({
                                ...prev,
                                [project.id]: !(prev[project.id] !== false),
                              }))
                            }}
                            type="button"
                            animate={{ rotate: isExpanded ? 0 : -90 }}
                            transition={{ duration: 0.2 }}
                            title={isExpanded ? 'プロジェクトを閉じる' : 'プロジェクトを開く'}
                          >
                            <FiChevronDown size={16} />
                          </motion.button>
                          <FiFolder size={16} />
                          <span className="project-name">{project.name}</span>
                        </motion.div>
                      </div>

                      {/* Chats in this project */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: 'hidden' }}
                          >
                            {projectChats.map((chat, idx) => {
                              const isNewChat = chat.id === newChatId
                              return (
                                <motion.div
                                  key={chat.id || `project-${project.id}-${idx}`}
                                  className={`chat-history-item project-chat ${chat.id === currentChatId ? 'active' : ''} ${draggedChatId === chat.id ? 'dragging' : ''}`}
                                  onClick={() => setCurrentChatId(chat.id)}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, chat.id)}
                                  onDragEnd={handleDragEnd}
                                  transition={isNewChat ? undefined : springTransition}
                                  initial={isNewChat ? newChatVariants.initial : false}
                                  animate={
                                    isNewChat ? newChatVariants.animate : { opacity: 1, y: 0, scale: 1 }
                                  }
                                  exit={newChatVariants.exit}
                                >
                                  <div className="chat-history-compact">
                                    <div className="chat-compact-time">
                                      {formatDateCompact(chat.createdAt)}
                                    </div>
                                    <div className="chat-compact-icon">
                                      <FiMessageSquare size={20} />
                                    </div>
                                    <div className="chat-compact-count">{chat.messages.length}</div>
                                  </div>

                                  <div className="chat-history-content">
                                    <div className="chat-history-title">{chat.title}</div>
                                    <div className="chat-history-meta">
                                      <span className="chat-message-count">{chat.messages.length}件</span>
                                      <span className="chat-timestamp">{formatDate(chat.createdAt)}</span>
                                    </div>
                                  </div>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteChat(chat.id)
                                    }}
                                    title="削除"
                                    className="chat-delete-button"
                                  >
                                    ×
                                  </Button>
                                </motion.div>
                              )
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Ungrouped Chats Section - Always visible as drop target */}
            <div
              key="ungrouped-header"
              className={`ungrouped-chats-header ${hoveredProjectId === 'ungrouped' ? 'drag-over' : ''}`}
              onDragOver={handleUngroupedDragOver}
              onDragLeave={handleUngroupedDragLeave}
              onDrop={handleRemoveFromProjectDrop}
            >
              <span className="ungrouped-label">PJ外のチャット</span>
            </div>
            {chatSessions
              .filter((chat) => !chat.projectId)
              .map((chat, idx) => {
                const isNewChat = chat.id === newChatId
                return (
                  <motion.div
                    key={chat.id || `ungrouped-${idx}`}
                    className={`chat-history-item ${chat.id === currentChatId ? 'active' : ''} ${draggedChatId === chat.id ? 'dragging' : ''}`}
                    onClick={() => setCurrentChatId(chat.id)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, chat.id)}
                    onDragEnd={handleDragEnd}
                    transition={isNewChat ? undefined : springTransition}
                    initial={isNewChat ? newChatVariants.initial : false}
                    animate={isNewChat ? newChatVariants.animate : { opacity: 1, y: 0, scale: 1 }}
                    exit={newChatVariants.exit}
                  >
                    {/* Compact view (shown when sidebar is collapsed) */}
                    <div className="chat-history-compact">
                      <div className="chat-compact-time">{formatDateCompact(chat.createdAt)}</div>
                      <div className="chat-compact-icon">
                        <FiMessageSquare size={20} />
                      </div>
                      <div className="chat-compact-count">{chat.messages.length}</div>
                    </div>

                    {/* Expanded view (shown when sidebar is hovered) */}
                    <div className="chat-history-content">
                      <div className="chat-history-title">{chat.title}</div>
                      <div className="chat-history-meta">
                        <span className="chat-message-count">{chat.messages.length}件</span>
                        <span className="chat-timestamp">{formatDate(chat.createdAt)}</span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteChat(chat.id)
                      }}
                      title="削除"
                      className="chat-delete-button"
                    >
                      ×
                    </Button>
                  </motion.div>
                )
              })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {/* Invite Collaborator Floating Button */}
        <motion.button
          className="invite-collaborator-floating-button"
          onClick={() => setShowInviteModal(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Invite Collaborators"
        >
          <FiUserPlus size={24} />
        </motion.button>

        <div className="chat-header">
          <h2>チャット</h2>
          <div className="chat-header-buttons">
            <Button
              variant="surface"
              size="md"
              onClick={() => setOpenConfigModal('user')}
              title="ユーザー設定"
            >
              <FiSettings size={20} />
            </Button>
            <Button
              variant="surface"
              size="md"
              onClick={() => setOpenConfigModal('tool')}
              title="ツール設定"
            >
              <FiStar size={20} />
            </Button>
            <Button
              variant="surface"
              size="md"
              onClick={() => setOpenConfigModal('task')}
              title="タスク設定"
            >
              <FiCheckSquare size={20} />
            </Button>
            <Button
              variant="surface"
              size="md"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
              animated={false}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.4 }}
                >
                  {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                </motion.div>
              </AnimatePresence>
            </Button>
            {user && (
              <Button
                variant="surface"
                size="md"
                onClick={() => setShowAccountModal(true)}
                title={user.displayName || user.email}
              >
                <FiUser size={20} />
                <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem' }}>
                  {user.displayName || user.email.split('@')[0]}
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Chat Members Display */}
        {getCurrentChat()?.members && getCurrentChat()?.members.length > 0 && (
          <div className="chat-members-section">
            <div className="chat-members-header">Members ({getCurrentChat().members.length})</div>
            <div className="chat-members-list">
              {getCurrentChat().members.map((member) => (
                <motion.div
                  key={member.id}
                  className="chat-member-avatar"
                  title={`${member.displayName} - ${member.email}`}
                  whileHover={{ scale: 1.15 }}
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="member-avatar-circle">{getMemberInitials(member.displayName)}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="chat-messages" ref={messagesContainerRef}>
          {/* Scroll Progress Indicator */}
          <motion.div
            className="scroll-progress-indicator"
            style={{
              scaleX: scrollYProgress,
            }}
          />

          {currentMessages.map((message, index) => {
            const hasDetails =
              message.role === 'ai' &&
              (message.trace || message.traceback || message.toolArgs || message.toolResults)

            // Render system messages (join/leave notifications)
            if (message.role === 'system') {
              return (
                <div key={index} className="system-message">
                  <p className="system-message-text">{message.content}</p>
                </div>
              )
            }

            return (
              <div
                key={index}
                className={`message ${message.role} ${message.role === 'ai' ? `message-${message.type || 'dione'}` : ''} ${message.role === 'ai' ? `message-${message.status || 'success'}` : ''} ${hasDetails ? 'message-clickable' : ''}`}
                onMouseDown={handleMessageMouseDown}
                onClick={(e) => handleMessageClick(message, e)}
              >
                {message.role === 'ai' && (
                  <img
                    src={getDioneIcon(message)}
                    alt="Dione"
                    className="message-avatar"
                    onError={(e) => {
                      // Fallback to default dark icon if image fails to load
                      e.target.src = '/sample_assets/dione/dione_dark.png'
                    }}
                  />
                )}
                <div className="message-content-wrapper">
                  {/* Reply Context */}
                  {message.replyingTo && (
                    <div className="message-reply-context">
                      <FiCornerDownLeft size={12} className="reply-context-icon" />
                      <span className="reply-context-label">返信:</span>
                      <span className="reply-context-preview">
                        {message.replyingTo.substring(0, 60)}
                        {message.replyingTo.length > 60 ? '...' : ''}
                      </span>
                    </div>
                  )}
                  {/* Attachment Contexts */}
                  {message.attachedWorkspaces && message.attachedWorkspaces.length > 0 && (
                    <div className="message-attachments-contexts">
                      {message.attachedWorkspaces.map((workspace, idx) => (
                        <div key={idx} className="message-attachment-context">
                          <FiPaperclip size={12} className="attachment-context-icon" />
                          <span className="attachment-context-label">添付:</span>
                          <span className="attachment-context-name">{workspace.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="message-bubble">
                    {getMessageLabel(message) && (
                      <div className="message-role">
                        <span className="message-type-icon">{getMessageTypeIcon(message)}</span>
                        <span>{getMessageLabel(message)}</span>
                      </div>
                    )}
                    {message.content && (
                      <div className="message-content">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkBreaks]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    {renderAttachments(message.attachments)}
                  </div>
                  <div className="message-footer">
                    <div className="message-timestamp">{formatTimestamp(message.timestamp)}</div>
                    {message.content && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReplyMessage(message.content, index)
                          }}
                          title="返信"
                        >
                          <FiCornerDownLeft size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyMessage(message.content, index)
                          }}
                          title={
                            copiedMessageIndex === index ? 'コピーしました！' : 'メッセージをコピー'
                          }
                        >
                          {copiedMessageIndex === index ? (
                            <FiCheck size={14} />
                          ) : (
                            <FiCopy size={14} />
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input-form" onSubmit={handleSubmit}>
          {/* File Attachments Preview */}
          {attachedFiles.length > 0 && (
            <div className="attached-files-preview">
              {attachedFiles.map((file, index) => (
                <div key={index} className="attached-file-item">
                  {file.preview ? (
                    <img src={file.preview} alt={file.name} className="attached-file-image" />
                  ) : (
                    <div className="attached-file-icon">{getFileIcon(file.type)}</div>
                  )}
                  <div className="attached-file-info">
                    <div className="attached-file-name">{file.name}</div>
                    <div className="attached-file-size">{formatFileSize(file.size)}</div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveFile(index)}
                    title="削除"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Reply Indicator */}
          {replyingToIndex !== null && (
            <div className="reply-indicator">
              <div className="reply-indicator-content">
                <FiCornerDownLeft size={16} className="reply-indicator-icon" />
                <div className="reply-indicator-text">
                  <span className="reply-label">返信:</span>
                  <span className="reply-preview">
                    {replyingToContent?.substring(0, 50)}
                    {replyingToContent?.length > 50 ? '...' : ''}
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearReply}
                title="返信をキャンセル"
              >
                <FiX size={16} />
              </Button>
            </div>
          )}

          {/* Attachment Indicators */}
          {attachedWorkspaces.length > 0 && (
            <div className="attachments-indicators-container">
              {attachedWorkspaces.map((workspace, index) => (
                <div key={index} className="attachment-indicator">
                  <div className="attachment-indicator-content">
                    <FiPaperclip size={16} className="attachment-indicator-icon" />
                    <div className="attachment-indicator-text">
                      <span className="attachment-label">添付:</span>
                      <span className="attachment-name">{workspace.title}</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                    title="この添付をキャンセル"
                  >
                    <FiX size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="chat-input-container">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
              style={{ display: 'none' }}
            />
            <Button
              type="button"
              variant="soft"
              size="md"
              onClick={handleAttachClick}
              title="ファイルを添付"
              animated={false}
            >
              <FiPaperclip size={20} />
            </Button>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                handleTaskMention(e.target.value, e.target.selectionStart)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Dioneと何をしますか？ (Ctrl+Enter で送信)"
              className="chat-input"
              rows="1"
            />
            <div className="chat-input-actions">
              <Button
                type="button"
                variant="soft"
                size="md"
                onClick={handleAugmentInput}
                title="メッセージを最適化"
                disabled={!inputValue.trim()}
              >
                <FiZap size={20} />
              </Button>
              <AnimatedSendButton
                shouldAnimate={shouldAnimateSendBtn}
                animationKey={animationKeyRef.current}
                onAnimationComplete={handleAnimationComplete}
              />
            </div>

            {/* Task Mention Dropdown */}
            {showTaskMention && (
              <div className="task-mention-dropdown" ref={taskMentionDropdownRef}>
                {getSortedTasks()
                  .filter((task) =>
                    task.title.toLowerCase().includes(taskMentionQuery.toLowerCase())
                  )
                  .slice(0, 10)
                  .map((task, index) => (
                    <div
                      key={task.id}
                      ref={(el) => {
                        if (el) taskMentionItemsRef.current[index] = el
                      }}
                      className={`task-mention-item ${index === taskMentionHighlightIndex ? 'highlighted' : ''}`}
                      onClick={() => handleTaskSelection(task)}
                    >
                      <div className="task-mention-title">{task.title}</div>
                      <div className="task-mention-meta">
                        <span className="task-mention-scope" style={{ borderLeftColor: task.scope === 'project' ? '#6c6cff' : '#999' }}>
                          {task.scope === 'project' ? 'プロジェクト' : 'グローバル'}
                        </span>
                        <span
                          className="task-mention-priority"
                          style={{
                            backgroundColor:
                              task.priority === 'high'
                                ? 'rgba(255, 107, 107, 0.2)'
                                : task.priority === 'medium'
                                ? 'rgba(255, 170, 77, 0.2)'
                                : 'rgba(105, 219, 124, 0.2)',
                            color:
                              task.priority === 'high'
                                ? '#ff6b6b'
                                : task.priority === 'medium'
                                ? '#ffa94d'
                                : '#69db7c',
                          }}
                        >
                          {task.priority === 'high'
                            ? '高'
                            : task.priority === 'medium'
                            ? '中'
                            : '低'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <MessageDetailModal message={selectedMessage} onClose={handleCloseModal} theme={theme} />
      )}

      {openConfigModal && (
        <ConfigurationModal
          configType={openConfigModal}
          onClose={() => setOpenConfigModal(null)}
          theme={theme}
          currentChatHistory={currentMessages}
          onOpenDionePowersScreen={() => setShowDionePowersScreen(true)}
        />
      )}

      {/* Dione Powers Screen for guideline editing */}
      {showDionePowersScreen && (
        <DionePowersScreen
          onClose={() => setShowDionePowersScreen(false)}
          theme={theme}
          currentChatHistory={currentMessages}
          currentArtifact={null}
          source="chat"
          documents={documents}
          libraries={libraries}
          scratchpadTabs={scratchpadTabs}
        />
      )}

      {/* Account Modal */}
      {showAccountModal && (
        <AccountModal
          isOpen={showAccountModal}
          onClose={() => setShowAccountModal(false)}
        />
      )}

      {/* Invite Collaborator Modal */}
      <InviteCollaboratorModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInviteCollaborators}
      />

      {/* Member Details Modal */}
      <MemberDetailsModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        onRemove={handleRemoveMember}
        currentChatId={currentChatId}
      />
    </div>
  )
}

export default ChatPanel
