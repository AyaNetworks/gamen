import { useState } from 'react'
import Button from './ui/Button'
import './UserPreferencesPanel.css'

function UserPreferencesPanel() {
  const [preferences, setPreferences] = useState({
    language: 'japanese',
    communicationStyle: 'friendly',
    detailLevel: 'balanced',
    responseLength: 'medium',
    autoGuidelineEdition: false,
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
        <label className="preference-label">Response Length</label>
        <div className="preference-options">
          {[
            { value: 'short', label: 'Short' },
            { value: 'medium', label: 'Medium' },
            { value: 'long', label: 'Long' },
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

      {/* Automatic Guideline Edition Toggle */}
      <div className="preference-group">
        <label className="preference-label">Automatic Guideline Edition</label>
        <div className="preference-toggle">
          <button
            className={`toggle-switch ${preferences.autoGuidelineEdition ? 'active' : ''}`}
            onClick={() => handlePreferenceChange('autoGuidelineEdition', !preferences.autoGuidelineEdition)}
            type="button"
            aria-label="Toggle automatic guideline edition"
          >
            <span className="toggle-slider"></span>
            <span className="toggle-label">
              {preferences.autoGuidelineEdition ? 'ON' : 'OFF'}
            </span>
          </button>
          <p className="preference-description">
            {preferences.autoGuidelineEdition
              ? 'Guidelines will be edited automatically'
              : 'Manual guideline editing required'}
          </p>
        </div>
      </div>

      {/* Current Settings Display */}
      <div className="current-settings">
        <h3>Current Settings</h3>
        <div className="settings-list">
          <div className="setting-item">
            <span className="setting-key">Language:</span>
            <span className="setting-value">
              {preferences.language === 'japanese' ? 'Japanese' : 'English'}
            </span>
          </div>
          <div className="setting-item">
            <span className="setting-key">Style:</span>
            <span className="setting-value">
              {preferences.communicationStyle === 'formal' && 'Formal'}
              {preferences.communicationStyle === 'friendly' && 'Friendly'}
              {preferences.communicationStyle === 'casual' && 'Casual'}
            </span>
          </div>
          <div className="setting-item">
            <span className="setting-key">Detail:</span>
            <span className="setting-value">
              {preferences.detailLevel === 'brief' && 'Brief'}
              {preferences.detailLevel === 'balanced' && 'Balanced'}
              {preferences.detailLevel === 'detailed' && 'Detailed'}
            </span>
          </div>
          <div className="setting-item">
            <span className="setting-key">Response Length:</span>
            <span className="setting-value">
              {preferences.responseLength === 'short' && 'Short'}
              {preferences.responseLength === 'medium' && 'Medium'}
              {preferences.responseLength === 'long' && 'Long'}
            </span>
          </div>
          <div className="setting-item">
            <span className="setting-key">Auto Guideline Edition:</span>
            <span className="setting-value">
              {preferences.autoGuidelineEdition ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="preference-actions">
        <Button variant="primary">Save Settings</Button>
      </div>
    </div>
  )
}

export default UserPreferencesPanel
