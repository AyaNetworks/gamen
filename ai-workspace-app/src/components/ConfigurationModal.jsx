import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import './ConfigurationModal.css'

function ConfigurationModal({ configType, onClose, theme }) {
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
      case 'dione':
        return 'Dione設定'
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
          { name: '詳細設定', id: 'advanced' }
        ]
      case 'tool':
        return [
          { name: 'ツール一覧', id: 'list' },
          { name: 'ツール追加', id: 'add' },
          { name: 'ツール詳細', id: 'details' }
        ]
      case 'task':
        return [
          { name: 'タスク定義', id: 'define' },
          { name: 'タスク管理', id: 'manage' },
          { name: 'タスク実行', id: 'execute' }
        ]
      default:
        return []
    }
  }

  const renderTabContent = () => {
    const tabs = getTabs()
    const currentTab = tabs[activeTab]

    switch (configType) {
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
        return (
          <div className="tab-content">
            {currentTab.id === 'list' && (
              <div className="config-section">
                <h4>ツール一覧</h4>
                <p>利用可能なツールの一覧を表示し、有効/無効を切り替えられます。</p>
              </div>
            )}
            {currentTab.id === 'add' && (
              <div className="config-section">
                <h4>ツール追加</h4>
                <p>新しいカスタムツールを追加してDioneの機能を拡張できます。</p>
              </div>
            )}
            {currentTab.id === 'details' && (
              <div className="config-section">
                <h4>ツール詳細</h4>
                <p>各ツールの詳細設定とパラメータを構成できます。</p>
              </div>
            )}
          </div>
        )
      case 'task':
        return (
          <div className="tab-content">
            {currentTab.id === 'define' && (
              <div className="config-section">
                <h4>タスク定義</h4>
                <p>Dioneが実行するタスクを定義し、その内容と要件を指定します。</p>
              </div>
            )}
            {currentTab.id === 'manage' && (
              <div className="config-section">
                <h4>タスク管理</h4>
                <p>既存のタスク、スケジュール、優先度を管理できます。</p>
              </div>
            )}
            {currentTab.id === 'execute' && (
              <div className="config-section">
                <h4>タスク実行</h4>
                <p>タスクの実行設定、条件、トリガーをカスタマイズできます。</p>
              </div>
            )}
          </div>
        )
      default:
        return <div className="tab-content"><p>設定内容</p></div>
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
          <button className="config-modal-close-button" onClick={onClose}>×</button>
        </div>

        <div className="config-modal-tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`config-tab ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="config-modal-body">
          {renderTabContent()}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

export default ConfigurationModal
