import { useState } from 'react'
import { useThemeStore, useAuthStore } from '../store'
import AccountModal from './AccountModal'
import './Header.css'

export default function Header() {
  const [showAccountModal, setShowAccountModal] = useState(false)
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const user = useAuthStore((state) => state.user)

  return (
    <>
      <header className={`header ${theme === 'dark' ? 'dark-header' : 'light-header'}`}>
        <div className="header-left">
          <div className="logo-section">
            <span className="logo-icon">🧠</span>
            <h1 className="app-title">Dione Workspace</h1>
          </div>
        </div>

        <div className="header-right">
          {/* Theme toggle */}
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Account button */}
          {user && (
            <button
              className="account-btn"
              onClick={() => setShowAccountModal(true)}
              title={user.displayName || user.email}
            >
              <span className="account-icon">👤</span>
              <span className="account-name">{user.displayName || user.email.split('@')[0]}</span>
            </button>
          )}
        </div>
      </header>

      {/* Account Modal */}
      {showAccountModal && (
        <AccountModal
          isOpen={showAccountModal}
          onClose={() => setShowAccountModal(false)}
        />
      )}
    </>
  )
}
