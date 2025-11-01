import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiCheck, FiCopy, FiLock, FiShare2, FiX } from 'react-icons/fi'
import Button from './ui/Button'
import './PublishNotification.css'

function PublishNotification({ isOpen, isPublished, tabId, onClose }) {
  const [copied, setCopied] = useState(false)

  // Auto-dismiss after 6 seconds
  useEffect(() => {
    if (!isOpen) return

    const timer = setTimeout(() => {
      onClose()
    }, 6000)

    return () => clearTimeout(timer)
  }, [isOpen, onClose])

  const generateShareUrl = () => {
    // Generate a mock share URL
    return `https://dione.app/share/${tabId}/${Math.random().toString(36).substr(2, 9)}`
  }

  const shareUrl = generateShareUrl()

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  const notificationVariants = {
    initial: {
      opacity: 0,
      y: -20,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  }

  const contentVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.1, duration: 0.3 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="notification-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Notification */}
          <motion.div
            className={`publish-notification ${isPublished ? 'published' : 'private'}`}
            variants={notificationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {isPublished ? (
              <>
                {/* Published State */}
                <div className="notification-header">
                  <div className="notification-icon-wrapper">
                    <motion.div
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <FiShare2 size={24} />
                    </motion.div>
                  </div>
                  <div className="notification-title">Document is Shared</div>
                  <Button variant="ghost" size="sm" onClick={onClose} title="Close">
                    <FiX size={18} />
                  </Button>
                </div>

                <motion.div
                  className="notification-content"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                >
                  <p className="notification-message">
                    Use this link to share the document. You can toggle it to private anytime.
                  </p>

                  <div className="share-url-container">
                    <input type="text" className="share-url-input" value={shareUrl} readOnly />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="action"
                        size="md"
                        onClick={handleCopyUrl}
                        title={copied ? 'Copied!' : 'Copy URL'}
                        animated={false}
                      >
                        <motion.div
                          key={copied ? 'check' : 'copy'}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                        </motion.div>
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </>
            ) : (
              <>
                {/* Private State */}
                <div className="notification-header">
                  <div className="notification-icon-wrapper">
                    <motion.div
                      initial={{ rotate: 180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <FiLock size={24} />
                    </motion.div>
                  </div>
                  <div className="notification-title">Set to Private</div>
                  <Button variant="ghost" size="sm" onClick={onClose} title="Close">
                    <FiX size={18} />
                  </Button>
                </div>

                <motion.div
                  className="notification-content"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                >
                  <p className="notification-message">
                    The sharing URL for this document has expired. It remains private.
                  </p>
                  <p className="notification-submessage">
                    Click the publish toggle to share again.
                  </p>
                </motion.div>
              </>
            )}

            {/* Progress Bar */}
            <motion.div
              className="notification-progress"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 6, ease: 'linear' }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PublishNotification
