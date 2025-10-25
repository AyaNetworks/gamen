import { useState } from 'react'
import { FiSearch, FiEdit2, FiTrash2, FiCheck, FiX, FiCheckCircle } from 'react-icons/fi'
import Button from './ui/Button'
import './TasksPanel.css'

function TasksPanel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [selectedTaskEdit, setSelectedTaskEdit] = useState(null)
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: '新機能リリースのスケジュール調整',
      description:
        '次回のスプリントで予定している新機能のリリーススケジュールを調整し、各チームメンバーのタスク配分を最適化してください。',
      priority: 'high',
      status: 'in_progress',
      createdAt: '2025/1/28',
      scope: 'project',
      projectId: 1,
    },
    {
      id: 2,
      title: 'リスク評価レポートの作成',
      description:
        '現在進行中のプロジェクトについて、技術的リスク、スケジュールリスク、リソースリスクを評価し、対策案を含むレポートを作成してください。',
      priority: 'medium',
      status: 'not_started',
      createdAt: '2025/1/29',
      scope: 'project',
      projectId: 1,
    },
    {
      id: 3,
      title: 'ステークホルダー向け進捗報告書',
      description:
        '経営層向けに今四半期のプロジェクト進捗状況をまとめ、主要なマイルストーンの達成状況と今後の見通しを報告する資料を作成してください。',
      priority: 'high',
      status: 'not_started',
      createdAt: '2025/1/30',
      scope: 'global',
    },
  ])
  const [activeTab, setActiveTab] = useState('list')

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const sortedTasks = filteredTasks.sort((a, b) => {
    // Project-specific tasks first
    if (a.scope === 'project' && b.scope === 'global') return -1
    if (a.scope === 'global' && b.scope === 'project') return 1
    return 0
  })

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId))
  }

  const handleToggleStatus = (taskId) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          let newStatus = 'not_started'
          if (t.status === 'not_started') newStatus = 'in_progress'
          else if (t.status === 'in_progress') newStatus = 'completed'
          else if (t.status === 'completed') newStatus = 'not_started'
          return { ...t, status: newStatus }
        }
        return t
      })
    )
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ff6b6b'
      case 'medium':
        return '#ffa94d'
      case 'low':
        return '#69db7c'
      default:
        return '#868e96'
    }
  }

  const getPriorityLabel = (priority) => {
    const labels = { high: '優先度: 高', medium: '優先度: 中', low: '優先度: 低' }
    return labels[priority] || priority
  }

  const getStatusLabel = (status) => {
    const labels = { in_progress: '進行中', not_started: '未着手', completed: '完了' }
    return labels[status] || status
  }

  return (
    <div className="tasks-panel">
      {activeTab === 'list' && (
        <>
          {/* Search and Filters */}
          <div className="tasks-header">
            <div className="tasks-search">
              <FiSearch size={20} />
              <input
                type="text"
                placeholder="タスクを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="tasks-search-input"
              />
            </div>

            <div className="tasks-filters">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="tasks-filter-select"
              >
                <option value="all">すべてのステータス</option>
                <option value="in_progress">進行中</option>
                <option value="not_started">未着手</option>
                <option value="completed">完了</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="tasks-filter-select"
              >
                <option value="all">すべての優先度</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
          </div>

          {/* Tasks List */}
          <div className="tasks-list">
            {sortedTasks.length === 0 ? (
              <div className="tasks-empty">
                <p>タスクが見つかりません</p>
              </div>
            ) : (
              sortedTasks.map((task) => (
                <div
                  key={task.id}
                  className="task-item"
                  style={{ borderLeftColor: getPriorityColor(task.priority) }}
                >
                  <div className="task-item-header">
                    <h3 className="task-title">{task.title}</h3>
                    <div className="task-badges">
                      <span
                        className="task-priority-badge"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                      >
                        {getPriorityLabel(task.priority)}
                      </span>
                      <span className="task-status-badge">
                        {getStatusLabel(task.status)}
                      </span>
                    </div>
                  </div>

                  <p className="task-description">{task.description}</p>

                  <div className="task-footer">
                    <div className="task-meta">
                      <span className="task-date">作成: {task.createdAt}</span>
                      {task.scope === 'project' && (
                        <span className="task-scope">プロジェクト</span>
                      )}
                    </div>

                    <div className="task-actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(task.id)}
                        title={
                          task.status === 'not_started'
                            ? '進行中にする'
                            : task.status === 'in_progress'
                            ? '完了にする'
                            : '未着手にする'
                        }
                        animated={false}
                      >
                        {task.status === 'not_started' && <FiX size={20} />}
                        {task.status === 'in_progress' && <FiCheck size={20} />}
                        {task.status === 'completed' && <FiCheckCircle size={20} />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="編集"
                        onClick={() => setSelectedTaskEdit(task)}
                        animated={false}
                      >
                        <FiEdit2 size={20} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        title="削除"
                        animated={false}
                      >
                        <FiTrash2 size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'add' && (
        <div className="tasks-add-form">
          <h3>新しいタスクを追加</h3>
          <form>
            <div className="form-group">
              <label>タスクのタイトル</label>
              <input type="text" placeholder="タスクのタイトルを入力してください" />
            </div>
            <div className="form-group">
              <label>タスクの詳細説明</label>
              <textarea placeholder="タスクの詳細説明を入力してください..." rows="6" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>優先度</label>
                <select>
                  <option>高</option>
                  <option>中</option>
                  <option>低</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <Button variant="primary">タスクを追加</Button>
            </div>
          </form>
        </div>
      )}

      {selectedTaskEdit && (
        <div className="task-edit-modal-overlay" onClick={() => setSelectedTaskEdit(null)}>
          <div className="task-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="task-edit-header">
              <h3>タスクを編集</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTaskEdit(null)} animated={false}>
                ×
              </Button>
            </div>
            <div className="task-edit-content">
              <div className="form-group">
                <label>タイトル</label>
                <input
                  type="text"
                  defaultValue={selectedTaskEdit.title}
                  onChange={(e) => setSelectedTaskEdit({ ...selectedTaskEdit, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>詳細説明</label>
                <textarea
                  defaultValue={selectedTaskEdit.description}
                  onChange={(e) => setSelectedTaskEdit({ ...selectedTaskEdit, description: e.target.value })}
                  rows="6"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>優先度</label>
                  <select
                    defaultValue={selectedTaskEdit.priority}
                    onChange={(e) => setSelectedTaskEdit({ ...selectedTaskEdit, priority: e.target.value })}
                  >
                    <option value="high">高</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>ステータス</label>
                  <select
                    defaultValue={selectedTaskEdit.status}
                    onChange={(e) => setSelectedTaskEdit({ ...selectedTaskEdit, status: e.target.value })}
                  >
                    <option value="not_started">未着手</option>
                    <option value="in_progress">進行中</option>
                    <option value="completed">完了</option>
                  </select>
                </div>
              </div>

              <div className="task-edit-actions">
                <Button
                  variant="primary"
                  onClick={() => {
                    setTasks(tasks.map((t) => (t.id === selectedTaskEdit.id ? selectedTaskEdit : t)))
                    setSelectedTaskEdit(null)
                  }}
                >
                  保存
                </Button>
                <Button variant="ghost" onClick={() => setSelectedTaskEdit(null)} animated={false}>
                  キャンセル
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TasksPanel
