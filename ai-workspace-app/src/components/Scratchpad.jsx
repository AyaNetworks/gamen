import './Scratchpad.css'

function Scratchpad({ content, onChange }) {
  return (
    <div className="scratchpad">
      <div className="scratchpad-header">
        <h2>Scratchpad</h2>
        <span className="scratchpad-subtitle">AIが作成するワークスペース</span>
      </div>
      <textarea
        className="scratchpad-editor"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="AIがここに内容を生成します..."
      />
    </div>
  )
}

export default Scratchpad
