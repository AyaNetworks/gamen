import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../store'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUser, FiCheck, FiUserPlus } from 'react-icons/fi'
import './InviteCollaboratorModal.css'

// Mock users data - in real app, this would come from API
const MOCK_USERS = [
  {
    id: 1,
    displayName: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    role: 'Designer',
  },
  {
    id: 2,
    displayName: 'Bob Smith',
    email: 'bob.smith@example.com',
    role: 'Developer',
  },
  {
    id: 3,
    displayName: 'Carol Williams',
    email: 'carol.williams@example.com',
    role: 'Product Manager',
  },
  {
    id: 4,
    displayName: 'David Brown',
    email: 'david.brown@example.com',
    role: 'Engineer',
  },
  {
    id: 5,
    displayName: 'Emma Davis',
    email: 'emma.davis@example.com',
    role: 'Data Scientist',
  },
  {
    id: 6,
    displayName: 'Frank Miller',
    email: 'frank.miller@example.com',
    role: 'Designer',
  },
  {
    id: 7,
    displayName: 'Grace Lee',
    email: 'grace.lee@example.com',
    role: 'Marketing',
  },
  {
    id: 8,
    displayName: 'Henry Wilson',
    email: 'henry.wilson@example.com',
    role: 'DevOps',
  },
]

export default function InviteCollaboratorModal({ isOpen, onClose, onInvite }) {
  const modalRef = useRef(null)
  const currentUser = useAuthStore((state) => state.user)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

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

  // Reset selected users when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedUsers([])
      setSearchQuery('')
    }
  }, [isOpen])

  // Filter users based on search query and exclude current user
  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch =
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    const isNotCurrentUser = user.email !== currentUser?.email
    return matchesSearch && isNotCurrentUser
  })

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  // Handle invite
  const handleInvite = () => {
    if (selectedUsers.length > 0) {
      const invitedUsers = MOCK_USERS.filter((user) => selectedUsers.includes(user.id))
      onInvite && onInvite(invitedUsers)
      onClose()
    }
  }

  // Get user initials for avatar
  const getInitials = (name) => {
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="invite-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={modalRef}
            className="invite-modal"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="invite-modal-header">
              <h2>Invite Collaborators</h2>
              <button className="invite-close-button" onClick={onClose}>
                <FiX size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="invite-search-container">
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="invite-search-input"
                autoFocus
              />
            </div>

            {/* User List */}
            <div className="invite-modal-content">
              {filteredUsers.length === 0 ? (
                <div className="no-users-message">
                  <FiUser size={40} />
                  <p>No users found</p>
                </div>
              ) : (
                <div className="users-list">
                  {filteredUsers.map((user) => {
                    const isSelected = selectedUsers.includes(user.id)
                    return (
                      <motion.div
                        key={user.id}
                        className={`user-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleUserSelection(user.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="user-avatar">{getInitials(user.displayName)}</div>
                        <div className="user-info">
                          <div className="user-name">{user.displayName}</div>
                          <div className="user-email">{user.email}</div>
                          <div className="user-role">{user.role}</div>
                        </div>
                        <div className="user-checkbox">
                          {isSelected && <FiCheck size={18} />}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="invite-modal-footer">
              <div className="selected-count">
                {selectedUsers.length > 0
                  ? `${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''} selected`
                  : 'Select users to invite'}
              </div>
              <button
                className="invite-button"
                onClick={handleInvite}
                disabled={selectedUsers.length === 0}
              >
                <FiUserPlus size={18} />
                <span>Invite {selectedUsers.length > 0 && `(${selectedUsers.length})`}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
