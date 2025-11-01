import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiMail, FiUser, FiTrash2 } from 'react-icons/fi'
import './MemberDetailsModal.css'

export default function MemberDetailsModal({ member, isOpen, onClose, onRemove, currentChatId }) {
  const modalRef = useRef(null)

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const getMemberInitials = (name) => {
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove(currentChatId, member.id)
      onClose()
    }
  }

  if (!member) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="member-details-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={modalRef}
            className="member-details-modal"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="member-details-header">
              <h2>Member Information</h2>
              <button className="member-close-button" onClick={onClose}>
                <FiX size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="member-details-content">
              {/* Avatar */}
              <div className="member-details-avatar">
                {getMemberInitials(member.displayName)}
              </div>

              {/* Member Info */}
              <div className="member-info-section">
                <h3 className="member-name">{member.displayName}</h3>

                {/* Email */}
                <div className="member-info-item">
                  <div className="member-info-icon">
                    <FiMail size={16} />
                  </div>
                  <div className="member-info-text">
                    <label>Email</label>
                    <p className="member-email">{member.email}</p>
                  </div>
                </div>

                {/* Role */}
                {member.role && (
                  <div className="member-info-item">
                    <div className="member-info-icon">
                      <FiUser size={16} />
                    </div>
                    <div className="member-info-text">
                      <label>Role</label>
                      <p className="member-role">{member.role}</p>
                    </div>
                  </div>
                )}

                {/* Remove Button */}
                <button className="member-remove-button" onClick={handleRemove}>
                  <FiTrash2 size={16} />
                  <span>Remove Member</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
