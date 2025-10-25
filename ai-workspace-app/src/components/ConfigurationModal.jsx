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
        return 'ユーザー設定'
      case 'tool':
        return 'ツール設定'
      case 'task':
        return 'タスク設定'
      default:
        return '設定'
    }
  }

  const getTabs = () => {
    switch (configType) {
      case 'dione':
        return [
          { name: '基本設定', id: 'basic' },
          { name: 'パーソナリティ', id: 'personality' },
          { name: '詳細設定', id: 'advanced' },
        ]
      case 'tool':
        return [
          { name: 'ツール一覧', id: 'list' },
          { name: 'ツール追加', id: 'add' },
          { name: 'ツール詳細', id: 'details' },
        ]
      case 'task':
        return [
          { name: 'タスク定義', id: 'define' },
          { name: 'タスク管理', id: 'manage' },
          { name: 'タスク実行', id: 'execute' },
        ]
      case 'user':
        return [
          { name: 'ユーザー設定', id: 'preferences' },
          { name: 'ガイドラインの編集', id: 'guideline' },
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
                  <h4>ガイドラインの編集</h4>
                  <p>Dioneのパーソナリティを定義するガイドラインを作成・編集します。</p>
                  <p style={{ marginTop: '1rem' }}>下のボタンをクリックしてガイドラインエディタを開きます。</p>
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
                    ガイドラインを編集する
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
                <h4>基本設定</h4>
                <p>Dioneの名前、言語、タイムゾーンなどの基本的な設定をここで行えます。</p>
              </div>
            )}
            {currentTab.id === 'personality' && (
              <div className="config-section">
                <h4>パーソナリティ</h4>
                <p>Dioneの性格、トーン、応答スタイルをカスタマイズできます。</p>
              </div>
            )}
            {currentTab.id === 'advanced' && (
              <div className="config-section">
                <h4>詳細設定</h4>
                <p>高度な設定やAPIキー、統合オプションを設定できます。</p>
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
            <p>設定内容</p>
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
