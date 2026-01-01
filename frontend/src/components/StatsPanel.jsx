import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiEye, FiFileText, FiHeart, FiLock, FiShare2 } from 'react-icons/fi'
import Button from './ui/Button'
import './StatsPanel.css'

function StatsPanel({ content = '', isPublished = false, onPublishToggle = null, tabId = null }) {
  const [stats, setStats] = useState({
    characters: 0,
    words: 0,
    shared: 0,
    likes: 0,
    impressions: 0,
  })
  const [isPublishedState, setIsPublishedState] = useState(isPublished)
  const [isLiked, setIsLiked] = useState(false)
  const [likeScale, setLikeScale] = useState(1)

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

    setStats((prev) => ({
      ...prev,
      characters,
      words,
    }))

    // Animate character count
    const charControls = animate(charCount, characters, {
      duration: 0.3,
      ease: 'easeOut',
    })

    // Animate word count
    const wordControls = animate(wordCount, words, {
      duration: 0.3,
      ease: 'easeOut',
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

  // Handle like toggle
  const handleLikeToggle = () => {
    const newLikedState = !isLiked
    setIsLiked(newLikedState)

    // Animate the heart
    setLikeScale(0.8)
    setTimeout(() => {
      setLikeScale(1)
    }, 100)

    // Update like count
    if (newLikedState) {
      animate(likesCount, stats.likes + 1, {
        duration: 0.3,
        ease: 'easeOut',
      })
      setStats((prev) => ({
        ...prev,
        likes: prev.likes + 1,
      }))
    } else {
      animate(likesCount, Math.max(0, stats.likes - 1), {
        duration: 0.3,
        ease: 'easeOut',
      })
      setStats((prev) => ({
        ...prev,
        likes: Math.max(0, prev.likes - 1),
      }))
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
          impressions: isPublishedState ? Math.floor(Math.random() * 2000) : 0,
        }

        setStats((prev) => ({
          ...prev,
          likes: mockData.likes,
          impressions: mockData.impressions,
        }))

        // Animate social metrics
        animate(likesCount, mockData.likes, {
          duration: 0.5,
          ease: 'easeOut',
        })

        animate(impressionsCount, mockData.impressions, {
          duration: 0.5,
          ease: 'easeOut',
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
          <span className="stat-label">Characters</span>
          <motion.span className="stat-value">{animatedChars}</motion.span>
        </div>

        {/* Word Count */}
        <div className="stat-item">
          <FiFileText size={16} className="stat-icon" />
          <span className="stat-label">Words</span>
          <motion.span className="stat-value">{animatedWords}</motion.span>
        </div>

        {/* Divider */}
        <div className="stat-divider" />

        {/* Publish State Toggle */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="toggle"
            onClick={handlePublishToggle}
            title={isPublishedState ? 'Make Private' : 'Start Sharing'}
            animated={false}
            className={isPublishedState ? 'published' : 'private'}
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
            <span className="publish-label">{isPublishedState ? 'Shared' : 'Private'}</span>
          </Button>
        </motion.div>

        {/* Likes Count - Interactive */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="toggle"
            onClick={handleLikeToggle}
            title={isLiked ? 'Unlike' : 'Like'}
            animated={false}
            className={isLiked ? 'liked' : ''}
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: likeScale }}
              transition={{ duration: 0.1 }}
            >
              <FiHeart size={16} className={`stat-icon ${isLiked ? 'liked-heart' : ''}`} />
            </motion.div>
            <span className="stat-label">Likes</span>
            <motion.span className="stat-value">{animatedLikes}</motion.span>
          </Button>
        </motion.div>

        {/* Impressions Count */}
        <div className="stat-item">
          <FiEye size={16} className="stat-icon" />
          <span className="stat-label">Views</span>
          <motion.span className="stat-value">{animatedImpressions}</motion.span>
        </div>
      </div>
    </div>
  )
}

export default StatsPanel
