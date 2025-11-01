import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Button from './ui/Button'
import ToolsPanel from './ToolsPanel'
import TasksPanel from './TasksPanel'
import UserPreferencesPanel from './UserPreferencesPanel'
import './ConfigurationModal.css'

function ConfigurationModal({ configType, onClose, theme, currentChatHistory, onOpenDionePowersScreen }) {
  const [activeTab, setActiveTab] = useState(0)
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
    switch (configType) {
      case 'user':
        return 'User Settings'
      case 'tool':
        return 'Tool Settings'
      case 'task':
        return 'Task Settings'
      default:
        return 'Settings'
    }
  }

  const getTabs = () => {
    switch (configType) {
      case 'dione':
        return [
          { name: 'Basic', id: 'basic' },
          { name: 'Personality', id: 'personality' },
          { name: 'Advanced', id: 'advanced' },
        ]
      case 'tool':
        return [
          { name: 'Tool List', id: 'list' },
          { name: 'Add Tool', id: 'add' },
          { name: 'Tool Details', id: 'details' },
        ]
      case 'task':
        return [
          { name: 'Task Definition', id: 'define' },
          { name: 'Task Management', id: 'manage' },
          { name: 'Task Execution', id: 'execute' },
        ]
      case 'user':
        return [
          { name: 'User Preferences', id: 'preferences' },
          { name: 'Edit Guidelines', id: 'guideline' },
        ]
      default:
        return []
    }
  }

  const renderTabContent = () => {
    const tabs = getTabs()
    const currentTab = tabs[activeTab]

    switch (configType) {
      case 'user':
        return (
          <div className="tab-content">
            {currentTab && currentTab.id === 'preferences' && <UserPreferencesPanel />}
            {currentTab && currentTab.id === 'guideline' && (
              <div className="guideline-tab-content">
                <div className="config-section">
                  <h4>Edit Guidelines</h4>
                  <p>Create and edit guidelines that define Dione's personality.</p>
                  <p style={{ marginTop: '1rem' }}>Click the button below to open the guidelines editor.</p>
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <Button
                    variant="primary"
                    onClick={() => {
                      onClose()
                      if (onOpenDionePowersScreen) {
                        onOpenDionePowersScreen()
                      }
                    }}
                  >
                    Edit Guidelines
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      case 'dione':
        return (
          <div className="tab-content">
            {currentTab.id === 'basic' && (
              <div className="config-section">
                <h4>Basic Settings</h4>
                <p>Configure Dione's basic settings such as name, language, and timezone here.</p>
              </div>
            )}
            {currentTab.id === 'personality' && (
              <div className="config-section">
                <h4>Personality</h4>
                <p>Customize Dione's personality, tone, and response style.</p>
              </div>
            )}
            {currentTab.id === 'advanced' && (
              <div className="config-section">
                <h4>Advanced Settings</h4>
                <p>Configure advanced settings, API keys, and integration options.</p>
              </div>
            )}
          </div>
        )
      case 'tool':
        return <ToolsPanel />
      case 'task':
        return <TasksPanel />
      default:
        return (
          <div className="tab-content">
            <p>Settings</p>
          </div>
        )
    }
  }

  const tabs = getTabs()

  return createPortal(
    <motion.div
      className={`config-modal-overlay ${theme}-theme`}
      onClick={onClose}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      ref={modalRef}
    >
      <motion.div
        className="config-modal-container"
        onClick={(e) => e.stopPropagation()}
        initial="hidden"
        animate="visible"
        variants={contentVariants}
      >
        <div className="config-modal-header">
          <h2 className="config-modal-title">{getModalTitle()}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        {(configType === 'dione' || configType === 'user') && (
          <div className="config-modal-tabs">
            {tabs.map((tab, index) => (
              <motion.div
                key={tab.id}
                initial={false}
                animate={{
                  backgroundColor:
                    activeTab === index ? 'rgba(100, 108, 255, 0.15)' : 'rgba(100, 108, 255, 0)',
                }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="tab"
                  onClick={() => setActiveTab(index)}
                  className={activeTab === index ? 'active' : ''}
                  animated={false}
                >
                  {tab.name}
                </Button>
                {activeTab === index && (
                  <motion.div
                    className="config-tab-underline"
                    layoutId="config-tab-underline"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}

        <div className="config-modal-body">{renderTabContent()}</div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

export default ConfigurationModal
