import { useState } from 'react'
import { FiSearch, FiEdit2, FiTrash2, FiCheck, FiX, FiCheckCircle } from 'react-icons/fi'
import Button from './ui/Button'
import { useTaskStore } from '../store'
import './TasksPanel.css'

function TasksPanel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [selectedTaskEdit, setSelectedTaskEdit] = useState(null)
  const tasks = useTaskStore((state) => state.tasks)
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
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
    deleteTask(taskId)
  }

  const handleToggleStatus = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      let newStatus = 'not_started'
      if (task.status === 'not_started') newStatus = 'in_progress'
      else if (task.status === 'in_progress') newStatus = 'completed'
      else if (task.status === 'completed') newStatus = 'not_started'
      updateTask(taskId, { status: newStatus })
    }
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
    const labels = { high: 'Priority: High', medium: 'Priority: Medium', low: 'Priority: Low' }
    return labels[priority] || priority
  }

  const getStatusLabel = (status) => {
    const labels = { in_progress: 'In Progress', not_started: 'Not Started', completed: 'Completed' }
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
                placeholder="Search tasks..."
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
                <option value="all">All Status</option>
                <option value="in_progress">In Progress</option>
                <option value="not_started">Not Started</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="tasks-filter-select"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Tasks List */}
          <div className="tasks-list">
            {sortedTasks.length === 0 ? (
              <div className="tasks-empty">
                <p>No tasks found</p>
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
                      <span className="task-date">Created: {task.createdAt}</span>
                      {task.scope === 'project' && (
                        <span className="task-scope">Project</span>
                      )}
                    </div>

                    <div className="task-actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(task.id)}
                        title={
                          task.status === 'not_started'
                            ? 'Mark In Progress'
                            : task.status === 'in_progress'
                            ? 'Mark Completed'
                            : 'Mark Not Started'
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
                        title="Delete"
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
          <h3>Add New Task</h3>
          <form>
            <div className="form-group">
              <label>Task Title</label>
              <input type="text" placeholder="Enter task title" />
            </div>
            <div className="form-group">
              <label>Task Details</label>
              <textarea placeholder="Enter task details..." rows="6" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <Button variant="primary">Add Task</Button>
            </div>
          </form>
        </div>
      )}

      {selectedTaskEdit && (
        <div className="task-edit-modal-overlay" onClick={() => setSelectedTaskEdit(null)}>
          <div className="task-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="task-edit-header">
              <h3>Edit Task</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTaskEdit(null)} animated={false}>
                ×
              </Button>
            </div>
            <div className="task-edit-content">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  defaultValue={selectedTaskEdit.title}
                  onChange={(e) => setSelectedTaskEdit({ ...selectedTaskEdit, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Details</label>
                <textarea
                  defaultValue={selectedTaskEdit.description}
                  onChange={(e) => setSelectedTaskEdit({ ...selectedTaskEdit, description: e.target.value })}
                  rows="6"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    defaultValue={selectedTaskEdit.priority}
                    onChange={(e) => setSelectedTaskEdit({ ...selectedTaskEdit, priority: e.target.value })}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    defaultValue={selectedTaskEdit.status}
                    onChange={(e) => setSelectedTaskEdit({ ...selectedTaskEdit, status: e.target.value })}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="task-edit-actions">
                <Button
                  variant="primary"
                  onClick={() => {
                    updateTask(selectedTaskEdit.id, selectedTaskEdit)
                    setSelectedTaskEdit(null)
                  }}
                >
                  Save
                </Button>
                <Button variant="ghost" onClick={() => setSelectedTaskEdit(null)} animated={false}>
                  Cancel
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
