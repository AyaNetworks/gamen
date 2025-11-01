import { useState } from 'react'
import { FiSearch, FiPower, FiSettings, FiTrash2, FiPlus } from 'react-icons/fi'
import Button from './ui/Button'
import './ToolsPanel.css'

function ToolsPanel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedToolConfig, setSelectedToolConfig] = useState(null)
  const [tools, setTools] = useState([
    // Search Tools
    {
      id: 1,
      name: 'Google Search',
      description: 'Web search using Google Search API',
      category: 'Search',
      enabled: true,
      type: 'builtin',
    },
    {
      id: 2,
      name: 'Bing Search',
      description: 'Web search using Bing Search API',
      category: 'Search',
      enabled: true,
      type: 'builtin',
    },
    {
      id: 3,
      name: 'DuckDuckGo Search',
      description: 'Privacy-focused web search',
      category: 'Search',
      enabled: false,
      type: 'builtin',
    },
    // Cloud Storage
    {
      id: 4,
      name: 'Amazon S3',
      description: 'Access and file operations for AWS S3 buckets',
      category: 'Cloud Storage',
      enabled: false,
      type: 'addon',
    },
    {
      id: 5,
      name: 'Google Cloud Storage',
      description: 'GCS bucket access and file management',
      category: 'Cloud Storage',
      enabled: false,
      type: 'addon',
    },
    {
      id: 6,
      name: 'Dropbox',
      description: 'Dropbox account connection and file operations',
      category: 'Cloud Storage',
      enabled: false,
      type: 'addon',
    },
    // Databases
    {
      id: 7,
      name: 'BigQuery',
      description: 'Google BigQuery connection and data analysis',
      category: 'Databases',
      enabled: false,
      type: 'addon',
    },
    {
      id: 8,
      name: 'PostgreSQL',
      description: 'PostgreSQL database connection',
      category: 'Databases',
      enabled: false,
      type: 'addon',
    },
    {
      id: 9,
      name: 'MongoDB',
      description: 'MongoDB connection and document operations',
      category: 'Databases',
      enabled: false,
      type: 'addon',
    },
    // Communication
    {
      id: 10,
      name: 'Slack',
      description: 'Send messages to Slack workspaces',
      category: 'Communication',
      enabled: false,
      type: 'addon',
    },
    {
      id: 11,
      name: 'Gmail',
      description: 'Gmail email send/receive and label management',
      category: 'Communication',
      enabled: false,
      type: 'addon',
    },
    {
      id: 12,
      name: 'Teams',
      description: 'Send messages to Microsoft Teams',
      category: 'Communication',
      enabled: false,
      type: 'addon',
    },
    // Task Management
    {
      id: 13,
      name: 'Jira',
      description: 'Jira project task management and tracking',
      category: 'Task Management',
      enabled: false,
      type: 'addon',
    },
    {
      id: 14,
      name: 'Asana',
      description: 'Asana project management',
      category: 'Task Management',
      enabled: false,
      type: 'addon',
    },
    {
      id: 15,
      name: 'GitHub Issues',
      description: 'GitHub Issues and pull request management',
      category: 'Task Management',
      enabled: false,
      type: 'addon',
    },
    // APIs & Web Services
    {
      id: 16,
      name: 'OpenWeather API',
      description: 'Weather forecasts and meteorological data retrieval',
      category: 'APIs & Web Services',
      enabled: false,
      type: 'addon',
    },
    {
      id: 17,
      name: 'REST API',
      description: 'Access custom REST API endpoints',
      category: 'APIs & Web Services',
      enabled: false,
      type: 'addon',
    },
    {
      id: 18,
      name: 'GraphQL',
      description: 'Query GraphQL API endpoints',
      category: 'APIs & Web Services',
      enabled: false,
      type: 'addon',
    },
    // Code Execution
    {
      id: 19,
      name: 'Python Executor',
      description: 'Execute Python code and retrieve results',
      category: 'Code Execution',
      enabled: false,
      type: 'addon',
    },
    {
      id: 20,
      name: 'Node.js Runtime',
      description: 'Execute JavaScript code',
      category: 'Code Execution',
      enabled: false,
      type: 'addon',
    },
    // Analytics & Visualization
    {
      id: 21,
      name: 'Data Visualization',
      description: 'Data visualization and graph generation',
      category: 'Analytics & Visualization',
      enabled: false,
      type: 'addon',
    },
    {
      id: 22,
      name: 'Analytics',
      description: 'Google Analytics data retrieval',
      category: 'Analytics & Visualization',
      enabled: false,
      type: 'addon',
    },
    // MCP Servers
    {
      id: 23,
      name: 'MCP: File System',
      description: 'Safe file system access and operations',
      category: 'MCP Servers',
      enabled: false,
      type: 'mcp',
      protocol: 'stdio',
    },
    {
      id: 24,
      name: 'MCP: GitHub',
      description: 'GitHub repository management and code operations',
      category: 'MCP Servers',
      enabled: false,
      type: 'mcp',
      protocol: 'stdio',
    },
    {
      id: 25,
      name: 'MCP: PostgreSQL',
      description: 'Direct PostgreSQL database query execution',
      category: 'MCP Servers',
      enabled: false,
      type: 'mcp',
      protocol: 'stdio',
    },
    {
      id: 26,
      name: 'MCP: Slack',
      description: 'Comprehensive Slack workspace access',
      category: 'MCP Servers',
      enabled: false,
      type: 'mcp',
      protocol: 'stdio',
    },
    {
      id: 27,
      name: 'MCP: Browser',
      description: 'Web browser automation and web scraping',
      category: 'MCP Servers',
      enabled: false,
      type: 'mcp',
      protocol: 'stdio',
    },
    {
      id: 28,
      name: 'MCP: Google Drive',
      description: 'Google Drive file and document access',
      category: 'MCP Servers',
      enabled: false,
      type: 'mcp',
      protocol: 'stdio',
    },
    // A2A Agents
    {
      id: 29,
      name: 'Research Agent',
      description: 'Agent specialized in information gathering and research',
      category: 'A2A Agents',
      enabled: false,
      type: 'a2a',
      agentType: 'research',
    },
    {
      id: 30,
      name: 'Data Analysis Agent',
      description: 'Agent for data analysis and statistical processing',
      category: 'A2A Agents',
      enabled: false,
      type: 'a2a',
      agentType: 'analysis',
    },
    {
      id: 31,
      name: 'Code Assistant Agent',
      description: 'Agent for code generation and debugging support',
      category: 'A2A Agents',
      enabled: false,
      type: 'a2a',
      agentType: 'coding',
    },
    {
      id: 32,
      name: 'Content Generation Agent',
      description: 'Agent for generating text, documents, and content',
      category: 'A2A Agents',
      enabled: false,
      type: 'a2a',
      agentType: 'content',
    },
    {
      id: 33,
      name: 'Project Manager Agent',
      description: 'Agent for project management and task coordination',
      category: 'A2A Agents',
      enabled: false,
      type: 'a2a',
      agentType: 'management',
    },
    {
      id: 34,
      name: 'Quality Assurance Agent',
      description: 'Agent for testing and quality assurance',
      category: 'A2A Agents',
      enabled: false,
      type: 'a2a',
      agentType: 'qa',
    },
  ])
  const [activeTab, setActiveTab] = useState('list')

  const categories = ['All', ...new Set(tools.map((t) => t.category))]
  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const groupedTools = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = []
    }
    acc[tool.category].push(tool)
    return acc
  }, {})

  const handleToggleTool = (toolId) => {
    setTools(tools.map((t) => (t.id === toolId ? { ...t, enabled: !t.enabled } : t)))
  }

  const handleDeleteTool = (toolId) => {
    setTools(tools.filter((t) => t.id !== toolId))
  }

  return (
    <div className="tools-panel">
      {activeTab === 'list' && (
        <>
          {/* Search Bar */}
          <div className="tools-search">
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="tools-search-input"
            />
          </div>

          {/* Tools List */}
          <div className="tools-list">
            {Object.entries(groupedTools).length === 0 ? (
              <div className="tools-empty">
                <p>No tools found</p>
              </div>
            ) : (
              Object.entries(groupedTools).map(([category, categoryTools]) => (
                <div key={category} className="tools-category">
                  <h3 className="tools-category-title">{category}</h3>
                  <div className="tools-category-items">
                    {categoryTools.map((tool) => (
                      <div key={tool.id} className="tool-item">
                        <div className="tool-item-content">
                          <h4 className="tool-name">{tool.name}</h4>
                          <p className="tool-description">{tool.description}</p>
                          <div className="tool-badges">
                            {tool.type === 'addon' && <span className="tool-badge">Add-on</span>}
                            {tool.type === 'mcp' && <span className="tool-badge mcp-badge">MCP</span>}
                            {tool.type === 'a2a' && <span className="tool-badge a2a-badge">A2A</span>}
                          </div>
                        </div>
                        <div className="tool-actions">
                          <Button
                            className={`tool-toggle-btn ${tool.enabled ? 'enabled' : 'disabled'}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleTool(tool.id)}
                            title={tool.enabled ? 'Disable' : 'Enable'}
                            animated={false}
                          >
                            <FiPower size={24} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Settings"
                            onClick={() => setSelectedToolConfig(tool)}
                            animated={false}
                          >
                            <FiSettings size={24} />
                          </Button>
                          {tool.type === 'addon' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTool(tool.id)}
                              title="Delete"
                              animated={false}
                            >
                              <FiTrash2 size={24} />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'add' && (
        <div className="tools-add-form">
          <h3>Add New Tool</h3>
          <form>
            <div className="form-group">
              <label>Tool Name</label>
              <input type="text" placeholder="Example: My API Tool" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Enter tool description..." rows="4" />
            </div>
            <div className="form-group">
              <label>Tool Type</label>
              <select>
                <optgroup label="Standard">
                  <option value="api">API</option>
                  <option value="webhook">Webhook</option>
                  <option value="rest">REST API</option>
                  <option value="graphql">GraphQL</option>
                </optgroup>
                <optgroup label="Data Related">
                  <option value="database">Database</option>
                  <option value="dataprocessing">Data Processing</option>
                  <option value="analytics">Analytics</option>
                </optgroup>
                <optgroup label="Integration">
                  <option value="saas">SaaS Integration</option>
                  <option value="cloud">Cloud Services</option>
                </optgroup>
                <optgroup label="Protocols">
                  <option value="mcp-server">MCP Server</option>
                  <option value="a2a-agent">A2A Agent</option>
                </optgroup>
                <optgroup label="Runtime">
                  <option value="runtime">Runtime</option>
                  <option value="code">Code Execution</option>
                  <option value="script">Script</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="custom">Custom</option>
                  <option value="plugin">Plugin</option>
                  <option value="other">Other</option>
                </optgroup>
              </select>
            </div>
            <div className="form-actions">
              <Button variant="primary">Add Tool</Button>
            </div>
          </form>
        </div>
      )}

      {selectedToolConfig && (
        <div className="tool-config-modal-overlay" onClick={() => setSelectedToolConfig(null)}>
          <div className="tool-config-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tool-config-header">
              <h3>{selectedToolConfig.name} - Settings</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedToolConfig(null)} animated={false}>
                ×
              </Button>
            </div>
            <div className="tool-config-content">
              <div className="config-section">
                <h4>Basic Settings</h4>
                <div className="form-group">
                  <label>Enable/Disable</label>
                  <div className="config-toggle">
                    <input
                      type="checkbox"
                      defaultChecked={selectedToolConfig.enabled}
                      onChange={(e) => {
                        setTools(
                          tools.map((t) =>
                            t.id === selectedToolConfig.id ? { ...t, enabled: e.target.checked } : t
                          )
                        )
                        setSelectedToolConfig({ ...selectedToolConfig, enabled: e.target.checked })
                      }}
                    />
                    <span>{selectedToolConfig.enabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </div>

              <div className="config-section">
                <h4>Authentication</h4>
                <div className="form-group">
                  <label>API Key / Token</label>
                  <input type="password" placeholder="Enter API key..." />
                </div>
                <div className="form-group">
                  <label>Authentication Method</label>
                  <select>
                    <option>API Key</option>
                    <option>Bearer Token</option>
                    <option>OAuth 2.0</option>
                    <option>Basic Auth</option>
                    <option>Custom Headers</option>
                  </select>
                </div>
              </div>

              <div className="config-section">
                <h4>Connection Settings</h4>
                <div className="form-group">
                  <label>Base URL / Endpoint</label>
                  <input type="text" placeholder="https://api.example.com" />
                </div>
                <div className="form-group">
                  <label>Timeout (seconds)</label>
                  <input type="number" placeholder="30" defaultValue="30" />
                </div>
                <div className="form-group">
                  <label>Retry Count</label>
                  <input type="number" placeholder="3" defaultValue="3" />
                </div>
              </div>

              <div className="config-section">
                <h4>Rate Limiting</h4>
                <div className="form-group">
                  <label>Requests per Hour</label>
                  <input type="number" placeholder="1000" defaultValue="1000" />
                </div>
                <div className="form-group">
                  <label>Burst Limit (seconds)</label>
                  <input type="number" placeholder="100" defaultValue="100" />
                </div>
              </div>

              <div className="config-section">
                <h4>Logging & Debug</h4>
                <div className="form-group">
                  <label>
                    <input type="checkbox" defaultChecked={false} />
                    {' '}Enable verbose logging
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input type="checkbox" defaultChecked={false} />
                    {' '}Save request/response logs
                  </label>
                </div>
              </div>

              {selectedToolConfig.type === 'mcp' && (
                <div className="config-section">
                  <h4>MCP Server Settings</h4>
                  <div className="form-group">
                    <label>Protocol</label>
                    <select defaultValue={selectedToolConfig.protocol || 'stdio'}>
                      <option value="stdio">Standard Input/Output</option>
                      <option value="http">HTTP</option>
                      <option value="websocket">WebSocket</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>実行コマンド</label>
                    <input type="text" placeholder="例: python -m mcp.server.file_system" />
                  </div>
                  <div className="form-group">
                    <label>環境変数</label>
                    <textarea placeholder="KEY=VALUE&#10;KEY2=VALUE2" rows="3" />
                  </div>
                  <div className="form-group">
                    <label>初期化タイムアウト（秒）</label>
                    <input type="number" placeholder="10" defaultValue="10" />
                  </div>
                  <div className="form-group">
                    <label>
                      <input type="checkbox" defaultChecked={true} />
                      {' '}Enable Auto-reconnect
                    </label>
                  </div>
                </div>
              )}

              {selectedToolConfig.type === 'a2a' && (
                <div className="config-section">
                  <h4>A2A エージェント設定</h4>
                  <div className="form-group">
                    <label>エージェント種別</label>
                    <select defaultValue={selectedToolConfig.agentType || 'custom'}>
                      <option value="research">リサーチ</option>
                      <option value="analysis">データ分析</option>
                      <option value="coding">コード支援</option>
                      <option value="content">コンテンツ生成</option>
                      <option value="management">プロジェクト管理</option>
                      <option value="qa">品質保証</option>
                      <option value="custom">カスタム</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Agent Description</label>
                    <textarea placeholder="Describe this agent's role and capabilities..." rows="3" />
                  </div>
                  <div className="form-group">
                    <label>通信プロトコル</label>
                    <select>
                      <option value="rest">REST API</option>
                      <option value="grpc">gRPC</option>
                      <option value="websocket">WebSocket</option>
                      <option value="mqtt">MQTT</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>エージェント ID / エンドポイント</label>
                    <input type="text" placeholder="https://agent-service/agents/agent-id" />
                  </div>
                  <div className="form-group">
                    <label>最大並行タスク</label>
                    <input type="number" placeholder="5" defaultValue="5" />
                  </div>
                  <div className="form-group">
                    <label>
                      <input type="checkbox" defaultChecked={false} />
                      {' '}Allow direct communication between agents
                    </label>
                  </div>
                </div>
              )}

              <div className="config-actions">
                <Button
                  variant="primary"
                  onClick={() => {
                    setTools(tools.map((t) => (t.id === selectedToolConfig.id ? selectedToolConfig : t)))
                    setSelectedToolConfig(null)
                  }}
                >
                  Save
                </Button>
                <Button variant="ghost" onClick={() => setSelectedToolConfig(null)} animated={false}>
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

export default ToolsPanel
