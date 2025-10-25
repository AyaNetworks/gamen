import { useState } from 'react'
import Button from './ui/Button'
import './UserPreferencesPanel.css'

function UserPreferencesPanel() {
  const [preferences, setPreferences] = useState({
    language: 'japanese',
    communicationStyle: 'friendly',
    detailLevel: 'balanced',
    responseLength: 'medium',
  })

  const handlePreferenceChange = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="user-preferences-panel">
      {/* Language Preference */}
      <div className="preference-group">
        <label className="preference-label">言語 (Language)</label>
        <div className="preference-options">
          {[
            { value: 'japanese', label: '日本語' },
            { value: 'english', label: 'English' },
          ].map((option) => (
            <button
              key={option.value}
              className={`preference-option ${preferences.language === option.value ? 'active' : ''}`}
              onClick={() => handlePreferenceChange('language', option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Communication Style */}
      <div className="preference-group">
        <label className="preference-label">コミュニケーションスタイル (Communication Style)</label>
        <div className="preference-options">
          {[
            { value: 'formal', label: 'フォーマル (Formal)' },
            { value: 'friendly', label: 'フレンドリー (Friendly)' },
            { value: 'casual', label: 'カジュアル (Casual)' },
          ].map((option) => (
            <button
              key={option.value}
              className={`preference-option ${preferences.communicationStyle === option.value ? 'active' : ''}`}
              onClick={() => handlePreferenceChange('communicationStyle', option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Detail Level */}
      <div className="preference-group">
        <label className="preference-label">詳細レベル (Detail Level)</label>
        <div className="preference-options">
          {[
            { value: 'brief', label: '簡潔 (Brief)' },
            { value: 'balanced', label: 'バランス (Balanced)' },
            { value: 'detailed', label: '詳細 (Detailed)' },
          ].map((option) => (
            <button
              key={option.value}
              className={`preference-option ${preferences.detailLevel === option.value ? 'active' : ''}`}
              onClick={() => handlePreferenceChange('detailLevel', option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Response Length */}
      <div className="preference-group">
        <label className="preference-label">回答の長さ (Response Length)</label>
        <div className="preference-options">
          {[
            { value: 'short', label: '短い (Short)' },
            { value: 'medium', label: '中程度 (Medium)' },
            { value: 'long', label: '長い (Long)' },
          ].map((option) => (
            <button
              key={option.value}
              className={`preference-option ${preferences.responseLength === option.value ? 'active' : ''}`}
              onClick={() => handlePreferenceChange('responseLength', option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Settings Display */}
      <div className="current-settings">
        <h3>現在の設定 (Current Settings)</h3>
        <div className="settings-list">
          <div className="setting-item">
            <span className="setting-key">言語:</span>
            <span className="setting-value">
              {preferences.language === 'japanese' ? '日本語' : 'English'}
            </span>
          </div>
          <div className="setting-item">
            <span className="setting-key">スタイル:</span>
            <span className="setting-value">
              {preferences.communicationStyle === 'formal' && 'フォーマル'}
              {preferences.communicationStyle === 'friendly' && 'フレンドリー'}
              {preferences.communicationStyle === 'casual' && 'カジュアル'}
            </span>
          </div>
          <div className="setting-item">
            <span className="setting-key">詳細:</span>
            <span className="setting-value">
              {preferences.detailLevel === 'brief' && '簡潔'}
              {preferences.detailLevel === 'balanced' && 'バランス'}
              {preferences.detailLevel === 'detailed' && '詳細'}
            </span>
          </div>
          <div className="setting-item">
            <span className="setting-key">回答長:</span>
            <span className="setting-value">
              {preferences.responseLength === 'short' && '短い'}
              {preferences.responseLength === 'medium' && '中程度'}
              {preferences.responseLength === 'long' && '長い'}
            </span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="preference-actions">
        <Button variant="primary">設定を保存</Button>
      </div>
    </div>
  )
}

export default UserPreferencesPanel
