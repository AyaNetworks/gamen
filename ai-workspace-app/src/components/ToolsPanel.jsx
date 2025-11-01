import { useState } from 'react'
import { FiSearch, FiPower, FiSettings, FiTrash2, FiPlus } from 'react-icons/fi'
import Button from './ui/Button'
import './ToolsPanel.css'

function ToolsPanel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedToolConfig, setSelectedToolConfig] = useState(null)
  const [tools, setTools] = useState([
    // 検索ツール
    {
      id: 1,
      name: 'Google Search',
      description: 'Google検索APIを使用したWeb検索',
      category: '検索',
      enabled: true,
      type: 'builtin',
    },
    {
      id: 2,
      name: 'Bing Search',
      description: 'Bing Search APIを使用したWeb検索',
      category: '検索',
      enabled: true,
      type: 'builtin',
    },
    {
      id: 3,
      name: 'DuckDuckGo Search',
      description: 'プライバシー重視のWeb検索',
      category: '検索',
      enabled: false,
      type: 'builtin',
    },
    // クラウドストレージ
    {
      id: 4,
      name: 'Amazon S3',
      description: 'AWS S3バケットへのアクセスとファイル操作',
      category: 'クラウドストレージ',
      enabled: false,
      type: 'addon',
    },
    {
      id: 5,
      name: 'Google Cloud Storage',
      description: 'GCSバケットへのアクセスとファイル管理',
      category: 'クラウドストレージ',
      enabled: false,
      type: 'addon',
    },
    {
      id: 6,
      name: 'Dropbox',
      description: 'Dropboxアカウントの接続とファイル操作',
      category: 'クラウドストレージ',
      enabled: false,
      type: 'addon',
    },
    // データベース
    {
      id: 7,
      name: 'BigQuery',
      description: 'Google BigQueryへの接続とデータ分析',
      category: 'データベース',
      enabled: false,
      type: 'addon',
    },
    {
      id: 8,
      name: 'PostgreSQL',
      description: 'PostgreSQLデータベースへの接続',
      category: 'データベース',
      enabled: false,
      type: 'addon',
    },
    {
      id: 9,
      name: 'MongoDB',
      description: 'MongoDBへの接続とドキュメント操作',
      category: 'データベース',
      enabled: false,
      type: 'addon',
    },
    // コミュニケーション
    {
      id: 10,
      name: 'Slack',
      description: 'Slackワークスペースへのメッセージ送信',
      category: 'コミュニケーション',
      enabled: false,
      type: 'addon',
    },
    {
      id: 11,
      name: 'Gmail',
      description: 'Gmailメール送受信とラベル管理',
      category: 'コミュニケーション',
      enabled: false,
      type: 'addon',
    },
    {
      id: 12,
      name: 'Teams',
      description: 'Microsoft Teamsへのメッセージ送信',
      category: 'コミュニケーション',
      enabled: false,
      type: 'addon',
    },
    // タスク管理
    {
      id: 13,
      name: 'Jira',
      description: 'Jiraプロジェクトのタスク管理と追跡',
      category: 'タスク管理',
      enabled: false,
      type: 'addon',
    },
    {
      id: 14,
      name: 'Asana',
      description: 'Asanaプロジェクトの管理',
      category: 'タスク管理',
      enabled: false,
      type: 'addon',
    },
    {
      id: 15,
      name: 'GitHub Issues',
      description: 'GitHubのIssueとプルリクエスト管理',
      category: 'タスク管理',
      enabled: false,
      type: 'addon',
    },
    // API・ウェブサービス
    {
      id: 16,
      name: 'OpenWeather API',
      description: '天気予報と気象データの取得',
      category: 'API・ウェブサービス',
      enabled: false,
      type: 'addon',
    },
    {
      id: 17,
      name: 'REST API',
      description: 'カスタムREST APIエンドポイントへのアクセス',
      category: 'API・ウェブサービス',
      enabled: false,
      type: 'addon',
    },
    {
      id: 18,
      name: 'GraphQL',
      description: 'GraphQL APIエンドポイントへのクエリ実行',
      category: 'API・ウェブサービス',
      enabled: false,
      type: 'addon',
    },
    // コード実行
    {
      id: 19,
      name: 'Python Executor',
      description: 'Pythonコードの実行と結果の取得',
      category: 'コード実行',
      enabled: false,
      type: 'addon',
    },
    {
      id: 20,
      name: 'Node.js Runtime',
      description: 'JavaScriptコードの実行',
      category: 'コード実行',
      enabled: false,
      type: 'addon',
    },
    // 分析・ビジュアライゼーション
    {
      id: 21,
      name: 'Data Visualization',
      description: 'データの可視化とグラフ生成',
      category: '分析・ビジュアライゼーション',
      enabled: false,
      type: 'addon',
    },
    {
      id: 22,
      name: 'Analytics',
      description: 'Google Analyticsのデータ取得',
      category: '分析・ビジュアライゼーション',
      enabled: false,
      type: 'addon',
    },
    // MCPサーバー
    {
      id: 23,
      name: 'MCP: File System',
      description: 'ファイルシステムへの安全なアクセスと操作',
      category: 'MCPサーバー',
      enabled: false,
      type: 'mcp',
      protocol: 'stdio',
    },
    {
      id: 24,
      name: 'MCP: GitHub',
      description: 'GitHubリポジトリの管理とコード操作',
      category: 'MCPサーバー',
      enabled: false,
      type: 'mcp',
      protocol: 'stdio',
    },
    {
      id: 25,
      name: 'MCP: PostgreSQL',
      description: 'PostgreSQLデータベースへの直接クエリ実行',
      category: 'MCPサーバー',
      enabled: false,
      type: 'mcp',
      protocol: 'stdio',
    },
    {
      id: 26,
      name: 'MCP: Slack',
      description: 'Slackワークスペースの統合的なアクセス',
      category: 'MCPサーバー',
      enabled: false,
      type: 'mcp',
      protocol: 'stdio',
    },
    {
      id: 27,
      name: 'MCP: Browser',
      description: 'ウェブブラウザの自動化とスクレイピング',
      category: 'MCPサーバー',
      enabled: false,
      type: 'mcp',
      protocol: 'stdio',
    },
    {
      id: 28,
      name: 'MCP: Google Drive',
      description: 'Google Driveのファイルとドキュメントへのアクセス',
      category: 'MCPサーバー',
      enabled: false,
      type: 'mcp',
      protocol: 'stdio',
    },
    // A2Aエージェント
    {
      id: 29,
      name: 'Research Agent',
      description: '情報収集と調査を専門とするエージェント',
      category: 'A2Aエージェント',
      enabled: false,
      type: 'a2a',
      agentType: 'research',
    },
    {
      id: 30,
      name: 'Data Analysis Agent',
      description: 'データ分析と統計処理を行うエージェント',
      category: 'A2Aエージェント',
      enabled: false,
      type: 'a2a',
      agentType: 'analysis',
    },
    {
      id: 31,
      name: 'Code Assistant Agent',
      description: 'コード生成とデバッグを支援するエージェント',
      category: 'A2Aエージェント',
      enabled: false,
      type: 'a2a',
      agentType: 'coding',
    },
    {
      id: 32,
      name: 'Content Generation Agent',
      description: 'テキスト、ドキュメント、コンテンツを生成するエージェント',
      category: 'A2Aエージェント',
      enabled: false,
      type: 'a2a',
      agentType: 'content',
    },
    {
      id: 33,
      name: 'Project Manager Agent',
      description: 'プロジェクト管理とタスク調整を行うエージェント',
      category: 'A2Aエージェント',
      enabled: false,
      type: 'a2a',
      agentType: 'management',
    },
    {
      id: 34,
      name: 'Quality Assurance Agent',
      description: 'テストと品質保証を実施するエージェント',
      category: 'A2Aエージェント',
      enabled: false,
      type: 'a2a',
      agentType: 'qa',
    },
  ])
  const [activeTab, setActiveTab] = useState('list')

  const categories = ['すべて', ...new Set(tools.map((t) => t.category))]
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
              placeholder="ツールを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="tools-search-input"
            />
          </div>

          {/* Tools List */}
          <div className="tools-list">
            {Object.entries(groupedTools).length === 0 ? (
              <div className="tools-empty">
                <p>ツールが見つかりません</p>
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
                            {tool.type === 'addon' && <span className="tool-badge">アドオン</span>}
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
                            title={tool.enabled ? '無効にする' : '有効にする'}
                            animated={false}
                          >
                            <FiPower size={24} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="設定"
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
                              title="削除"
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
          <h3>新しいツールを追加</h3>
          <form>
            <div className="form-group">
              <label>ツール名</label>
              <input type="text" placeholder="例: My API Tool" />
            </div>
            <div className="form-group">
              <label>説明</label>
              <textarea placeholder="ツールの説明を入力してください..." rows="4" />
            </div>
            <div className="form-group">
              <label>ツールタイプ</label>
              <select>
                <optgroup label="標準">
                  <option value="api">API</option>
                  <option value="webhook">Webhook</option>
                  <option value="rest">REST API</option>
                  <option value="graphql">GraphQL</option>
                </optgroup>
                <optgroup label="データ関連">
                  <option value="database">データベース</option>
                  <option value="dataprocessing">データ処理</option>
                  <option value="analytics">分析</option>
                </optgroup>
                <optgroup label="統合">
                  <option value="saas">SaaS統合</option>
                  <option value="cloud">クラウドサービス</option>
                </optgroup>
                <optgroup label="プロトコル">
                  <option value="mcp-server">MCP サーバー</option>
                  <option value="a2a-agent">A2A エージェント</option>
                </optgroup>
                <optgroup label="実行環境">
                  <option value="runtime">ランタイム</option>
                  <option value="code">コード実行</option>
                  <option value="script">スクリプト</option>
                </optgroup>
                <optgroup label="その他">
                  <option value="custom">カスタム</option>
                  <option value="plugin">プラグイン</option>
                  <option value="other">その他</option>
                </optgroup>
              </select>
            </div>
            <div className="form-actions">
              <Button variant="primary">ツールを追加</Button>
            </div>
          </form>
        </div>
      )}

      {selectedToolConfig && (
        <div className="tool-config-modal-overlay" onClick={() => setSelectedToolConfig(null)}>
          <div className="tool-config-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tool-config-header">
              <h3>{selectedToolConfig.name} - 設定</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedToolConfig(null)} animated={false}>
                ×
              </Button>
            </div>
            <div className="tool-config-content">
              <div className="config-section">
                <h4>基本設定</h4>
                <div className="form-group">
                  <label>有効/無効</label>
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
                    <span>{selectedToolConfig.enabled ? '有効' : '無効'}</span>
                  </div>
                </div>
              </div>

              <div className="config-section">
                <h4>認証設定</h4>
                <div className="form-group">
                  <label>APIキー / トークン</label>
                  <input type="password" placeholder="APIキーを入力..." />
                </div>
                <div className="form-group">
                  <label>認証方式</label>
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
                <h4>接続設定</h4>
                <div className="form-group">
                  <label>ベースURL / エンドポイント</label>
                  <input type="text" placeholder="https://api.example.com" />
                </div>
                <div className="form-group">
                  <label>タイムアウト（秒）</label>
                  <input type="number" placeholder="30" defaultValue="30" />
                </div>
                <div className="form-group">
                  <label>リトライ回数</label>
                  <input type="number" placeholder="3" defaultValue="3" />
                </div>
              </div>

              <div className="config-section">
                <h4>レート制限</h4>
                <div className="form-group">
                  <label>1時間あたりのリクエスト制限</label>
                  <input type="number" placeholder="1000" defaultValue="1000" />
                </div>
                <div className="form-group">
                  <label>バースト制限（秒）</label>
                  <input type="number" placeholder="100" defaultValue="100" />
                </div>
              </div>

              <div className="config-section">
                <h4>ログ・デバッグ</h4>
                <div className="form-group">
                  <label>
                    <input type="checkbox" defaultChecked={false} />
                    {' '}詳細ログを有効にする
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input type="checkbox" defaultChecked={false} />
                    {' '}リクエスト/レスポンスのログを保存
                  </label>
                </div>
              </div>

              {selectedToolConfig.type === 'mcp' && (
                <div className="config-section">
                  <h4>MCP サーバー設定</h4>
                  <div className="form-group">
                    <label>プロトコル</label>
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
                      {' '}自動再接続を有効にする
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
                    <label>エージェント説明</label>
                    <textarea placeholder="このエージェントの役割と能力を説明..." rows="3" />
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
                      {' '}エージェント間の直接通信を許可
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
                  保存
                </Button>
                <Button variant="ghost" onClick={() => setSelectedToolConfig(null)} animated={false}>
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

export default ToolsPanel
