import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Button from './ui/Button'
import './MessageDetailModal.css'

function MessageDetailModal({ message, onClose, theme }) {
  if (!message) return null

  const modalRef = useRef(null)

  const containerVariants = {
    hidden: {
      clipPath: 'circle(0% at 50% 50%)',
      opacity: 0,
    },
    visible: {
      clipPath: 'circle(100% at 50% 50%)',
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 20,
        duration: 0.15,
      },
    },
    exit: {
      clipPath: 'circle(0% at 50% 50%)',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 30,
        duration: 0.15,
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.15,
        duration: 0.15,
      },
    },
  }

  const getModalTitle = () => {
    const messageType = message.type || 'dione'
    const status = message.status || 'success'

    if (messageType === 'tool') {
      return status === 'success' ? 'Tool Execution Details' : 'Tool Error Details'
    } else if (messageType === 'thinking') {
      return 'Thinking Process'
    } else {
      return status === 'success' ? 'Execution Trace' : 'Error Traceback'
    }
  }

  const renderContent = () => {
    const messageType = message.type || 'dione'
    const status = message.status || 'success'

    if (messageType === 'tool') {
      const isError = status === 'error'
      return (
        <div className="modal-content-sections">
          {message.trace && (
            <div className="modal-section">
              <h3 className="modal-section-title">{isError ? 'Tool Error Details' : 'Tool Execution Trace'}</h3>
              <pre className={`modal-code-block ${isError ? 'modal-error' : ''}`}>{message.trace}</pre>
            </div>
          )}
          {message.toolArgs && (
            <div className="modal-section">
              <h3 className="modal-section-title">Tool Arguments</h3>
              <pre className="modal-code-block">{message.toolArgs}</pre>
            </div>
          )}
          {status === 'success' && message.toolResults && (
            <div className="modal-section">
              <h3 className="modal-section-title">Results</h3>
              <pre className="modal-code-block">{message.toolResults}</pre>
            </div>
          )}
          {status === 'error' && message.traceback && (
            <div className="modal-section">
              <h3 className="modal-section-title">Error Traceback</h3>
              <pre className="modal-code-block modal-error">{message.traceback}</pre>
            </div>
          )}
        </div>
      )
    } else if (messageType === 'thinking') {
      return (
        <div className="modal-content-sections">
          {message.trace && (
            <div className="modal-section">
              <h3 className="modal-section-title">Thinking Trace</h3>
              <pre className="modal-code-block">{message.trace}</pre>
            </div>
          )}
        </div>
      )
    } else {
      // dione type
      if (message.trace) {
        const isError = status === 'error'
        const title = isError ? 'Error Details' : 'Execution Trace'
        return (
          <div className="modal-content-sections">
            <div className="modal-section">
              <h3 className="modal-section-title">{title}</h3>
              <pre className={`modal-code-block ${isError ? 'modal-error' : ''}`}>{message.trace}</pre>
            </div>
          </div>
        )
      } else if (status === 'error' && message.traceback) {
        return (
          <div className="modal-content-sections">
            <div className="modal-section">
              <h3 className="modal-section-title">Error Traceback</h3>
              <pre className="modal-code-block modal-error">{message.traceback}</pre>
            </div>
          </div>
        )
      }
    }

    return <div className="modal-no-details">No detailed information available</div>
  }

  return createPortal(
    <motion.div
      className={`modal-overlay ${theme}-theme`}
      onClick={onClose}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      ref={modalRef}
    >
      <motion.div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        initial="hidden"
        animate="visible"
        variants={contentVariants}
      >
        <div className="modal-header">
          <h2 className="modal-title">{getModalTitle()}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="modal-body">{renderContent()}</div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

export default MessageDetailModal
