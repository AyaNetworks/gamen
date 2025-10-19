import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { FiFileText, FiShare2, FiHeart, FiEye, FiLock } from 'react-icons/fi'
import './StatsPanel.css'

function StatsPanel({ content = '', isPublished = false, onPublishToggle = null, tabId = null }) {
  const [stats, setStats] = useState({
    characters: 0,
    words: 0,
    shared: 0,
    likes: 0,
    impressions: 0
  })
  const [isPublishedState, setIsPublishedState] = useState(isPublished)

  // Motion values for animated numbers
  const charCount = useMotionValue(0)
  const wordCount = useMotionValue(0)
  const likesCount = useMotionValue(0)
  const impressionsCount = useMotionValue(0)

  // Transform motion values to rounded integers
  const animatedChars = useTransform(() => Math.round(charCount.get()))
  const animatedWords = useTransform(() => Math.round(wordCount.get()))
  const animatedLikes = useTransform(() => Math.round(likesCount.get()))
  const animatedImpressions = useTransform(() => Math.round(impressionsCount.get()))

  // Calculate stats from content
  useEffect(() => {
    const characters = content.length
    const words = content.trim().length === 0 ? 0 : content.trim().split(/\s+/).length

    setStats(prev => ({
      ...prev,
      characters,
      words
    }))

    // Animate character count
    const charControls = animate(charCount, characters, {
      duration: 0.3,
      ease: 'easeOut'
    })

    // Animate word count
    const wordControls = animate(wordCount, words, {
      duration: 0.3,
      ease: 'easeOut'
    })

    return () => {
      charControls.stop()
      wordControls.stop()
    }
  }, [content, charCount, wordCount])

  // Sync published state from props
  useEffect(() => {
    setIsPublishedState(isPublished)
  }, [isPublished])

  // Handle publish toggle
  const handlePublishToggle = () => {
    const newState = !isPublishedState
    setIsPublishedState(newState)

    if (onPublishToggle) {
      onPublishToggle(tabId, newState)
    }
  }

  // Fetch social metrics from API (mocked)
  useEffect(() => {
    // Simulate API call to fetch social metrics
    const fetchSocialMetrics = async () => {
      try {
        // In a real app, this would be an actual API call
        // const response = await fetch(`/api/document-stats/${tabId}`)
        // const data = await response.json()

        // Mock data - only fetch if published
        const mockData = {
          likes: isPublishedState ? Math.floor(Math.random() * 500) : 0,
          impressions: isPublishedState ? Math.floor(Math.random() * 2000) : 0
        }

        setStats(prev => ({
          ...prev,
          likes: mockData.likes,
          impressions: mockData.impressions
        }))

        // Animate social metrics
        animate(likesCount, mockData.likes, {
          duration: 0.5,
          ease: 'easeOut'
        })

        animate(impressionsCount, mockData.impressions, {
          duration: 0.5,
          ease: 'easeOut'
        })
      } catch (error) {
        console.error('Failed to fetch social metrics:', error)
      }
    }

    fetchSocialMetrics()
  }, [likesCount, impressionsCount, isPublishedState])

  return (
    <div className="stats-panel">
      <div className="stats-container">
        {/* Character Count */}
        <div className="stat-item">
          <FiFileText size={16} className="stat-icon" />
          <span className="stat-label">文字</span>
          <motion.span className="stat-value">
            {animatedChars}
          </motion.span>
        </div>

        {/* Word Count */}
        <div className="stat-item">
          <FiFileText size={16} className="stat-icon" />
          <span className="stat-label">単語</span>
          <motion.span className="stat-value">
            {animatedWords}
          </motion.span>
        </div>

        {/* Divider */}
        <div className="stat-divider" />

        {/* Publish State Toggle */}
        <motion.button
          className={`publish-toggle ${isPublishedState ? 'published' : 'private'}`}
          onClick={handlePublishToggle}
          title={isPublishedState ? '非公開にする' : '共有を開始する'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="publish-icon"
            key={isPublishedState ? 'share' : 'lock'}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {isPublishedState ? <FiShare2 size={16} /> : <FiLock size={16} />}
          </motion.div>
          <span className="publish-label">
            {isPublishedState ? '共有中' : '非公開'}
          </span>
        </motion.button>

        {/* Likes Count */}
        <div className="stat-item">
          <FiHeart size={16} className="stat-icon" />
          <span className="stat-label">いいね</span>
          <motion.span className="stat-value">
            {animatedLikes}
          </motion.span>
        </div>

        {/* Impressions Count */}
        <div className="stat-item">
          <FiEye size={16} className="stat-icon" />
          <span className="stat-label">表示</span>
          <motion.span className="stat-value">
            {animatedImpressions}
          </motion.span>
        </div>
      </div>
    </div>
  )
}

export default StatsPanel
