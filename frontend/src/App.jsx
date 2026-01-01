import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import ChatPanel from './components/ChatPanel'
import DocumentPanel from './components/DocumentPanel'
import Scratchpad from './components/Scratchpad'
import LoginScreen from './components/LoginScreen'
import './App.css'

// Import Zustand stores
import { useChatStore, useProjectStore, useThemeStore, useWorkspaceStore, useAuthStore } from './store'

function App() {
  // Zustand stores - replaces useState for global state
  const theme = useThemeStore((state) => state.theme)
  const user = useAuthStore((state) => state.user)
  const [isHydrated, setIsHydrated] = useState(false)

  // Check if Zustand store is hydrated from localStorage
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Keep local state for scratchpad and documents (can migrate later if needed)
  const [scratchpadTabs, setScratchpadTabs] = useState([
    {
      id: 1,
      title: 'Q2 Marketing Analysis Report',
      content: `# Q2 Marketing Analysis Report

## Executive Summary

### Key KPIs
- **Total Impressions**: 2,500,000
- **Clicks**: 80,000
- **Click-Through Rate**: 3.2%
- **Conversions**: 1,440
- **Conversion Rate**: 1.8%
- **Total Ad Spend**: $19,600
- **ROI**: 185%

---

## Channel Performance

### 📧 Email Campaign ⭐ **Top Performer**
- Impressions: 450,000
- Click-Through Rate: 4.8%
- Conversion Rate: 2.5%
- ROI: **420%**
- **Recommended Action**: Increase budget by 30%

### 📱 Social Media
- Impressions: 1,200,000
- Clicks: 89,000 (highest)
- Click-Through Rate: 2.1%
- Conversion Rate: 1.2%
- ROI: 150%

### 📺 Display Ads
- Impressions: 850,000
- CPC: $180 (lowest)
- ROI: 120%

---

## Q3 Recommendations

1. **Budget Optimization**: Allocate 45% to Email, 40% to Social, 15% to Display
2. **Personalization**: Execute campaigns based on optimal send times by segment
3. **A/B Testing**: Continue testing subject lines and image patterns
4. **Automation**: Design drip campaigns for high-engagement segments

**Expected Outcome**: 20-25% improvement in overall ROI`,
      history: [''],
      historyIndex: 0,
    },
    {
      id: 2,
      title: 'Customer Segment Analysis Note',
      content: `# Customer Segment Analysis Note

## VIP Tier Characteristics (LTV $342,000)

### Purchasing Behavior
- Monthly Purchase Frequency: 8.2 times
- Average Order Value: $28,500
- Repeat Rate: 92%
- Churn Rate: 0.8%/month

### Communication Preferences
- Email Open Rate: 76%
- SMS Open Rate: 89%
- Push Notification Open Rate: 71%

### Recommendations
- Launch VIP-exclusive membership program
- Implement dedicated concierge service
- Host premium product previews bi-weekly
- Provide customized gift offerings

---

## Standard Tier Optimization Strategy

### Objective
Implement strategies to upgrade standard tier customers to VIP tier

### KPIs
- Upgrade Rate: Current 4% → Target 8%
- Average Order Value: $8,200 → $12,500
- Annual LTV: $98,400 → $150,000

### Action Items
1. Implement personalized recommendation engine
2. Establish loyalty program tier system
3. Grant exclusive product access rights

---

## Dormant Customer Reactivation

### Target Audience
No purchases in past 90 days: 12,400 customers

### Initiatives
- Win-back campaigns (2x per week)
- Return incentive codes (15-25% discount)
- Personalized product recommendations`,
      history: [''],
      historyIndex: 0,
    },
  ])
  const [currentScratchpadTabId, setCurrentScratchpadTabId] = useState(1)
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Email Marketing Best Practices.md',
      type: 'document',
      content: `# Email Marketing Best Practices

## Campaign Design

### Subject Line
- **Optimal Length**: 30-50 characters
- **High Open Rate Patterns**: Numbers, questions, personalization
- **Testing**: Always conduct 50/50 A/B tests

### Optimal Send Times
- Tuesday through Thursday perform best
- Peak windows: 10 AM and 2 PM
- Apply timezone adjustments per segment

### Content Structure
1. **Preheader**: 40-50 characters with key message
2. **Header**: Logo + navigation
3. **Main Content**: Image-to-text ratio 40:60
4. **Call-to-Action**: Limit to 1-3 CTAs with clear instructions
5. **Footer**: Unsubscribe link (required)

## Segmentation Strategy

### Core Segments
- **New Customers**: Welcome sequence (5-day nurture)
- **Active**: 1-2 sends per week
- **Dormant**: Win-back campaigns
- **VIP**: Exclusive content + early access

## Metrics

### Key Performance Indicators
- **Open Rate**: Industry avg 20-25%, Target 28%+
- **Click Rate**: Industry avg 2-3%, Target 4%+
- **Conversion Rate**: Industry avg 1-2%, Target 2.5%+
- **Unsubscribe Rate**: Acceptable maximum 0.5%

### Calculation Formulas
- **Open Rate** = (Opens / Sends) × 100
- **CTR** = (Clicks / Opens) × 100
- **Conversion Rate** = (Conversions / Sends) × 100`,
      filePath: '/knowledge_base/email-marketing.md',
      tags: { category: 'marketing', channel: 'email', expertise: 'high' },
    },
    {
      id: 2,
      name: 'Customer Segmentation Guide.md',
      type: 'document',
      content: `# Customer Segmentation Strategy Guide

## Segment Definition

### Classification Based on Lifetime Value (LTV)

#### Segment 1: VIP (LTV $300,000+)
- **Characteristics**: High-frequency purchases, high average order value
- **Market Share**: 2-5%
- **Revenue Contribution**: 40-60% of total sales
- **Strategy**: Personalization + dedicated support
- **Tactics**: Exclusive events, early product access

#### Segment 2: Growth Tier (LTV $100,000-$300,000)
- **Characteristics**: Increasing spending, promotion potential
- **Market Share**: 10-15%
- **Revenue Contribution**: 25-35% of total sales
- **Strategy**: Enhanced engagement
- **Tactics**: Personalized emails, loyalty rewards

#### Segment 3: Standard Tier (LTV $50,000-$100,000)
- **Characteristics**: Stable purchasing, baseline engagement
- **Market Share**: 35-50%
- **Revenue Contribution**: 15-25% of total sales
- **Strategy**: Efficient retention
- **Tactics**: Automated workflows, newsletters

#### Segment 4: Dormant (LTV $10,000-$50,000)
- **Characteristics**: Purchase discontinuation, churn risk
- **Market Share**: 30-40%
- **Revenue Contribution**: 5-10% of total sales
- **Strategy**: Win-back campaigns
- **Tactics**: Retargeting, discount offers

## Implementation Roadmap

**Phase 1** (1 month): Segment build-out
**Phase 2** (2-3 months): Personalization implementation
**Phase 3** (4-6 months): Automated workflow development`,
      filePath: '/knowledge_base/segmentation.md',
      tags: { category: 'strategy', focus: 'segmentation', level: 'advanced' },
    },
    {
      id: 3,
      name: '2024 Q2 Marketing Calendar.md',
      type: 'document',
      content: `# 2024 Q2 Marketing Calendar

## Campaign Schedule

### April - Spring Campaign Launch Month
**Theme**: New product introduction + existing customer engagement

- **4/1-7**: Spring Preview Campaign (VIP segment)
- **4/8-14**: Early access launch (Growth tier)
- **4/15-30**: Full-customer spring sale

**Revenue Target**: $4.5M

### May - Golden Week Special Campaign
**Theme**: Family-focused / relaxation offerings

- **4/25-5/2**: Limited GW products pre-sale
- **5/3-6**: Free shipping promotion
- **5/7-31**: Continued promotions + summer collection preview

**Revenue Target**: $5.2M

### June - Summer Collection Launch
**Theme**: Summer season / new collection launch

- **6/1-15**: Summer Preview Week
- **6/16-30**: Full-scale sale + exclusive items

**Revenue Target**: $5.5M

---

**Q2 Revenue Target**: $15.2M
**Expected Achievement Rate**: 105%`,
      filePath: '/knowledge_base/marketing-calendar.md',
      tags: { category: 'planning', timeframe: 'q2-2024' },
    },
  ])
  const [libraries, setLibraries] = useState([
    {
      id: 1,
      name: 'Q2_campaign_data.csv',
      type: 'library',
      content:
        'Channel,Impressions,Clicks,CTR,Conversions,CVR,Spend,Revenue,ROI\nEmail,450000,21600,4.8%,540,2.5%,2400,10080,420%\nSocial Media,1200000,25200,2.1%,302,1.2%,8500,12758,150%\nDisplay Ads,850000,33200,3.9%,598,1.8%,8700,10370,120%',
      filePath: '/uploads/Q2_campaign_data.csv',
      tags: {
        source: 'chat',
        uploadedAt: new Date(Date.now() - 700000).toISOString(),
        fileType: 'text/csv',
        campaign: 'Q2-2024',
      },
    },
    {
      id: 2,
      name: 'customer_segmentation_analysis.xlsx',
      type: 'library',
      content: '',
      file: null,
      filePath: '/uploads/customer_segmentation_analysis.xlsx',
      tags: {
        source: 'chat',
        uploadedAt: new Date(Date.now() - 650000).toISOString(),
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        focus: 'VIP-Standard-Dormant',
      },
    },
    {
      id: 3,
      name: 'Email_Template_Q2.html',
      type: 'library',
      content:
        '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: Arial, sans-serif; }\n    .container { max-width: 600px; margin: 0 auto; }\n    .header { background-color: #6C6CFF; padding: 20px; color: white; }\n    .content { padding: 20px; background-color: #f9f9f9; }\n    .cta-button { background-color: #6C6CFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; }\n  </style>\n</head>\n<body>\n  <div class="container">\n    <div class="header">\n      <h1>Q2 Special Offer</h1>\n    </div>\n    <div class="content">\n      <p>Dear Valued Customer,</p>\n      <p>We have an exclusive offer for you this quarter...</p>\n      <a href="#" class="cta-button">Shop Now</a>\n    </div>\n  </div>\n</body>\n</html>',
      filePath: '/uploads/Email_Template_Q2.html',
      tags: {
        source: 'chat',
        uploadedAt: new Date(Date.now() - 600000).toISOString(),
        fileType: 'text/html',
        purpose: 'email-template',
      },
    },
    {
      id: 4,
      name: 'Q2_Marketing_Strategy.pptx',
      type: 'library',
      content: '',
      file: null,
      filePath: '/uploads/Q2_Marketing_Strategy.pptx',
      tags: {
        source: 'chat',
        uploadedAt: new Date(Date.now() - 550000).toISOString(),
        fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        slides: '24',
      },
    },
    {
      id: 5,
      name: 'brand_guidelines_2024.pdf',
      type: 'library',
      content: '',
      file: null,
      filePath: '/uploads/brand_guidelines_2024.pdf',
      tags: {
        source: 'chat',
        uploadedAt: new Date(Date.now() - 500000).toISOString(),
        fileType: 'application/pdf',
        version: '2.1',
      },
    },
    {
      id: 6,
      name: 'social_media_content_calendar.xlsx',
      type: 'library',
      content: '',
      file: null,
      filePath: '/uploads/social_media_content_calendar.xlsx',
      tags: {
        source: 'chat',
        uploadedAt: new Date(Date.now() - 450000).toISOString(),
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        platform: 'Instagram-Twitter-Facebook',
      },
    },
  ])

  // If not hydrated yet or user is not logged in, show login screen
  if (!isHydrated || !user) {
    return <LoginScreen />
  }

  // === OLD HANDLERS REMOVED - Now in Zustand stores ===
  // handleSendMessage, handleNewChat, handleSelectChat, handleDeleteChat
  // handleCreateProject, handleDeleteProject, handleRenameProject
  // handleAddChatToProject, handleRemoveChatFromProject
  // toggleTheme, attachedWorkspaces handlers

  const handleSendMessage_OLD = (userMessage, attachments = [], replyContext = null) => {
    const updatedSessions = chatSessions.map((chat) => {
      if (chat.id === currentChatId) {
        const newMessage = {
          role: 'user',
          content: userMessage,
          timestamp: new Date().toISOString(),
        }

        // Add reply context if replying to a message
        if (replyContext && replyContext.replyingToContent) {
          newMessage.replyingTo = replyContext.replyingToContent
        }

        // Add attached workspaces if any
        if (
          replyContext &&
          replyContext.attachedWorkspaces &&
          replyContext.attachedWorkspaces.length > 0
        ) {
          newMessage.attachedWorkspaces = replyContext.attachedWorkspaces
        }

        // Add attachments if any
        if (attachments.length > 0) {
          newMessage.attachments = attachments.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: file.preview,
          }))

          // Add attachments to libraries (uploaded documents)
          const newLibraries = attachments.map((file) => ({
            id: Date.now() + Math.random(),
            name: file.name,
            type: 'library',
            content: '',
            file: file.file,
            filePath: `Uploaded from chat at ${new Date().toLocaleString('ja-JP')}`,
            tags: {
              source: 'chat',
              uploadedAt: new Date().toISOString(),
              fileType: file.type,
            },
          }))

          setLibraries((prevLibs) => [...prevLibs, ...newLibraries])
        }

        const newMessages = [...chat.messages, newMessage]

        // Update title if this is the first message
        const title =
          chat.messages.length === 0
            ? (userMessage || 'ファイル添付').substring(0, 30) +
              ((userMessage || 'ファイル添付').length > 30 ? '...' : '')
            : chat.title

        return { ...chat, messages: newMessages, title }
      }
      return chat
    })

    setChatSessions(updatedSessions)

    // Simple AI response logic
    setTimeout(() => {
      let aiResponse = ''
      const lowerMessage = userMessage.toLowerCase()

      if (lowerMessage.includes('scratchpad')) {
        aiResponse = 'Updated scratchpad.'
        handleScratchpadUpdate(
          scratchpadTabs.find((tab) => tab.id === currentScratchpadTabId)?.content +
            '\n// AI generated content\n' +
            userMessage
        )
      } else if (lowerMessage.includes('hello')) {
        aiResponse = 'Hello! How can I help you?'
      } else {
        aiResponse = 'Thank you for your question. As a simple AI, I can only provide basic responses.'
      }

      setChatSessions((prevSessions) =>
        prevSessions.map((chat) => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  role: 'ai',
                  type: 'dione',
                  status: 'success',
                  content: aiResponse,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          }
          return chat
        })
      )
    }, 500)
  }

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
    }
    setChatSessions([newChat, ...chatSessions])
    setCurrentChatId(newChat.id)
  }

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId)
  }

  const handleDeleteChat = (chatId) => {
    const filteredSessions = chatSessions.filter((chat) => chat.id !== chatId)

    if (filteredSessions.length === 0) {
      // Create a new empty chat if all are deleted
      const newChat = {
        id: Date.now(),
        title: 'New Chat',
        messages: [],
        createdAt: new Date().toISOString(),
      }
      setChatSessions([newChat])
      setCurrentChatId(newChat.id)
    } else {
      setChatSessions(filteredSessions)
      if (currentChatId === chatId) {
        setCurrentChatId(filteredSessions[0].id)
      }
    }
  }

  // Chat Project handlers
  const handleCreateProject = (projectName) => {
    const newProject = {
      id: Date.now(),
      name: projectName || 'New Project',
      chatIds: [],
      createdAt: new Date().toISOString(),
    }
    setChatProjects([...chatProjects, newProject])
  }

  const handleDeleteProject = (projectId) => {
    setChatProjects(chatProjects.filter((p) => p.id !== projectId))
  }

  const handleRenameProject = (projectId, newName) => {
    setChatProjects(chatProjects.map((p) => (p.id === projectId ? { ...p, name: newName } : p)))
  }

  const handleAddChatToProject = (chatId, projectId) => {
    setChatProjects(
      chatProjects.map((p) => {
        if (p.id === projectId && !p.chatIds.includes(chatId)) {
          return { ...p, chatIds: [...p.chatIds, chatId] }
        }
        return p
      })
    )
    // Update chat to include projectId
    setChatSessions(
      chatSessions.map((chat) => (chat.id === chatId ? { ...chat, projectId } : chat))
    )
  }

  const handleRemoveChatFromProject = (chatId) => {
    // Remove projectId from chat
    setChatSessions(
      chatSessions.map((chat) => (chat.id === chatId ? { ...chat, projectId: null } : chat))
    )
    // Update project to remove chatId
    setChatProjects(
      chatProjects.map((p) => ({
        ...p,
        chatIds: p.chatIds.filter((id) => id !== chatId),
      }))
    )
  }

  // Scratchpad handlers
  const handleScratchpadUpdate = (newContent) => {
    setScratchpadTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === currentScratchpadTabId) {
          const newHistory = tab.history.slice(0, tab.historyIndex + 1)
          newHistory.push(newContent)
          return {
            ...tab,
            content: newContent,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          }
        }
        return tab
      })
    )
  }

  const handleScratchpadUndo = () => {
    setScratchpadTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === currentScratchpadTabId && tab.historyIndex > 0) {
          const newIndex = tab.historyIndex - 1
          return {
            ...tab,
            content: tab.history[newIndex],
            historyIndex: newIndex,
          }
        }
        return tab
      })
    )
  }

  const handleScratchpadRedo = () => {
    setScratchpadTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === currentScratchpadTabId && tab.historyIndex < tab.history.length - 1) {
          const newIndex = tab.historyIndex + 1
          return {
            ...tab,
            content: tab.history[newIndex],
            historyIndex: newIndex,
          }
        }
        return tab
      })
    )
  }

  const handleNewScratchpadTab = () => {
    const newTab = {
      id: Date.now(),
      title: `Untitled ${scratchpadTabs.length + 1}`,
      content: '',
      history: [''],
      historyIndex: 0,
    }
    setScratchpadTabs([...scratchpadTabs, newTab])
    setCurrentScratchpadTabId(newTab.id)
  }

  const handleSelectScratchpadTab = (tabId) => {
    setCurrentScratchpadTabId(tabId)
  }

  const handleCloseScratchpadTab = (tabId) => {
    const filteredTabs = scratchpadTabs.filter((tab) => tab.id !== tabId)

    if (filteredTabs.length === 0) {
      const newTab = {
        id: Date.now(),
        title: 'Untitled 1',
        content: '',
        history: [''],
        historyIndex: 0,
      }
      setScratchpadTabs([newTab])
      setCurrentScratchpadTabId(newTab.id)
    } else {
      setScratchpadTabs(filteredTabs)
      if (currentScratchpadTabId === tabId) {
        setCurrentScratchpadTabId(filteredTabs[0].id)
      }
    }
  }

  const handleRenameScratchpadTab = (tabId, newTitle) => {
    setScratchpadTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === tabId ? { ...tab, title: newTitle } : tab))
    )
  }

  const handleUploadLibrary = (file) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const newLibrary = {
        id: Date.now(),
        name: file.name,
        type: 'library',
        content: e.target.result,
        file: file,
      }
      setLibraries([...libraries, newLibrary])
    }

    // Read as text for most files, but handle binary files differently
    const fileType = file.name.split('.').pop().toLowerCase()
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileType)) {
      // For binary files, store the file object directly
      const newLibrary = {
        id: Date.now(),
        name: file.name,
        type: 'library',
        content: '',
        file: file,
      }
      setLibraries([...libraries, newLibrary])
    } else {
      reader.readAsText(file)
    }
  }

  const handleDeleteLibrary = (libraryId) => {
    setLibraries(libraries.filter((lib) => lib.id !== libraryId))
  }

  const handleDeleteDocument = (documentId) => {
    setDocuments(documents.filter((doc) => doc.id !== documentId))
  }

  const handleAddToScratchpad = (documentData) => {
    const newTab = {
      id: Date.now(),
      title: documentData.title,
      content: documentData.content,
      fileType: documentData.fileType,
      fileName: documentData.fileName,
      filePath: documentData.filePath,
      history: [documentData.content],
      historyIndex: 0,
    }
    setScratchpadTabs([...scratchpadTabs, newTab])
    setCurrentScratchpadTabId(newTab.id)
  }

  const handleAttachToChat = (workspaceData) => {
    // Use Zustand store to attach workspace
    useWorkspaceStore.getState().attachWorkspace(workspaceData)
  }

  const currentScratchpadTab = scratchpadTabs.find((tab) => tab.id === currentScratchpadTabId)

  return (
    <div className={`h-screen relative overflow-hidden ${theme === 'dark' ? 'dark dark-theme' : 'light-theme'}`}>
      {/* Background gradients */}
      <div
        className={`absolute inset-0 pointer-events-none z-0 animate-[theme-fade-in_0.6s_ease-out] ${
          theme === 'dark'
            ? 'bg-gradient-to-l from-[#B87069] to-[#114357]'
            : 'bg-gradient-to-r from-[#d9a8a5] to-[#ddd6f3]'
        }`}
      />

      {/* Content with z-index above background */}
      <div className="relative z-10 h-full overflow-hidden">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={35} minSize={15} maxSize={50}>
            {/* ChatPanel gets data from Zustand stores + documents/libraries from App state */}
            <ChatPanel
              documents={documents}
              libraries={libraries}
              scratchpadTabs={scratchpadTabs}
            />
          </Panel>
          <PanelResizeHandle className="resize-handle" />
          <Panel defaultSize={40} minSize={25}>
            <Scratchpad
              tabs={scratchpadTabs}
              currentTabId={currentScratchpadTabId}
              currentTab={currentScratchpadTab}
              onUpdate={handleScratchpadUpdate}
              onUndo={handleScratchpadUndo}
              onRedo={handleScratchpadRedo}
              onNewTab={handleNewScratchpadTab}
              onSelectTab={handleSelectScratchpadTab}
              onCloseTab={handleCloseScratchpadTab}
              onRenameTab={handleRenameScratchpadTab}
              onAddDocument={handleAddToScratchpad}
              onAttachToChat={handleAttachToChat}
              documents={documents}
              libraries={libraries}
            />
          </Panel>
          <PanelResizeHandle className="resize-handle" />
          <Panel defaultSize={25} minSize={15} maxSize={40}>
            <DocumentPanel
              documents={documents}
              libraries={libraries}
              onUploadLibrary={handleUploadLibrary}
              onDeleteLibrary={handleDeleteLibrary}
              onDeleteDocument={handleDeleteDocument}
              onAddToScratchpad={handleAddToScratchpad}
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}

export default App
