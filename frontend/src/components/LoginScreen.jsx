import { useState } from 'react'
import { useAuthStore } from '../store'
import { motion } from 'framer-motion'
import './LoginScreen.css'

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [localError, setLocalError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const login = useAuthStore((state) => state.login)
  const signup = useAuthStore((state) => state.signup)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    setIsLoading(true)

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          setLocalError('Please enter your name')
          setIsLoading(false)
          return
        }
        await signup(email, password, displayName)
      } else {
        await login(email, password)
      }
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-screen">
      {/* Background gradient */}
      <div className="login-background dark-theme">
        <div className="gradient-blob" />
        <div className="gradient-blob gradient-blob-2" />
      </div>

      {/* Content */}
      <div className="login-container">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo/Header */}
          <div className="login-header">
            <img src="/sample_assets/dione/Dione-logo.png" alt="Dione Logo" className="logo" />
            <h1>Dione Workspace</h1>
            <p>AI-powered collaborative workspace</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="displayName">Name</label>
                <input
                  id="displayName"
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {localError && <div className="error-message">{localError}</div>}

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Loading...' : isSignUp ? 'Create Account' : 'Login'}
            </button>
          </form>

          {/* Toggle between login and signup */}
          <div className="toggle-mode">
            <p>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setLocalError('')
                  setEmail('')
                  setPassword('')
                  setDisplayName('')
                }}
                className="toggle-button"
              >
                {isSignUp ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
