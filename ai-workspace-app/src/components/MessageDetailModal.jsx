import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import './MessageDetailModal.css'

function MessageDetailModal({ message, onClose, theme }) {
  if (!message) return null

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
      return (
        <div className="modal-content-sections">
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
      if (status === 'success' && message.trace) {
        return (
          <div className="modal-content-sections">
            <div className="modal-section">
              <h3 className="modal-section-title">Execution Trace</h3>
              <pre className="modal-code-block">{message.trace}</pre>
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="modal-header">
          <h2 className="modal-title">{getModalTitle()}</h2>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {renderContent()}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

export default MessageDetailModal
