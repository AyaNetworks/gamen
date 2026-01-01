import { useEffect, useRef } from 'react'
import { useAuthStore } from '../store'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUser, FiLogOut } from 'react-icons/fi'
import './AccountModal.css'

export default function AccountModal({ isOpen, onClose }) {
  const modalRef = useRef(null)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

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

  // Handle logout
  const handleLogout = async () => {
    await logout()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="account-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={modalRef}
            className="account-modal"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="account-modal-header">
              <h2>Account Information</h2>
              <button className="close-button" onClick={onClose}>
                <FiX size={20} />
              </button>
            </div>

            {/* User Info */}
            <div className="account-modal-content">
              {/* Profile Section */}
              <div className="profile-section">
                <div className="avatar">
                  <FiUser size={32} />
                </div>
                <div className="profile-info">
                  <h3>{user?.displayName || 'User'}</h3>
                  <p className="email">{user?.email}</p>
                </div>
              </div>

              {/* Account Details */}
              <div className="account-details">
                <div className="detail-item">
                  <label>User ID</label>
                  <div className="detail-value">{user?.id}</div>
                </div>

                <div className="detail-item">
                  <label>Email</label>
                  <div className="detail-value">{user?.email}</div>
                </div>

                <div className="detail-item">
                  <label>Display Name</label>
                  <div className="detail-value">{user?.displayName || 'Not set'}</div>
                </div>

                <div className="detail-item">
                  <label>Theme Preference</label>
                  <div className="detail-value">{user?.theme || 'Default'}</div>
                </div>

                <div className="detail-item">
                  <label>Password Last Updated</label>
                  <div className="detail-value">{formatDate(user?.passwordLastUpdated)}</div>
                </div>

                <div className="detail-item">
                  <label>Last Logged In</label>
                  <div className="detail-value">{formatDate(user?.lastLoginAt)}</div>
                </div>

                <div className="detail-item">
                  <label>Account Created</label>
                  <div className="detail-value">{formatDate(user?.createdAt)}</div>
                </div>

                <div className="detail-item">
                  <label>Role</label>
                  <div className="detail-value role-badge">{user?.role || 'User'}</div>
                </div>
              </div>

              {/* Logout Button */}
              <button className="logout-button" onClick={handleLogout}>
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
