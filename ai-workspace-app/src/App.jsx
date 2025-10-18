import { useState } from 'react'
import { motion } from 'framer-motion'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import ChatPanel from './components/ChatPanel'
import Scratchpad from './components/Scratchpad'
import DocumentPanel from './components/DocumentPanel'
import './App.css'

function App() {
  const [theme, setTheme] = useState('dark') // 'light' or 'dark'
  const [chatSessions, setChatSessions] = useState([
    {
      id: 1,
      title: 'Q2マーケティング分析',
      messages: [
        { role: 'user', content: 'Q2の顧客データを分析してください。campaign_data.csvを参照してください。', timestamp: new Date(Date.now() - 900000).toISOString() },
        {
          role: 'ai',
          type: 'dione',
          status: 'success',
          content: '承知しました。Q2のマーケティングキャンペーンデータを分析します。データから以下のポイントが確認できました：\n\n📊 **キャンペーン成果サマリー**\n- 総インプレッション数: 2.5M\n- クリック率: 3.2%\n- コンバージョン率: 1.8%\n- 平均CPC: ¥245\n\n🎯 **パフォーマンス分析**\n- Email キャンペーン: 最高のROI (420%)\n- Social Media: 最多クリック数 (89K)\n- Display Ads: 最低CPC (¥180)\n\n💡 **推奨事項**\nEmail キャンペーンへの予算配分を増やすことで、全体ROIが約15%向上する可能性があります。',
          timestamp: new Date(Date.now() - 890000).toISOString(),
          trace: 'Step 1: Load campaign_data.csv\nStep 2: Parse CSV structure\nStep 3: Calculate KPIs (CTR, CVR, CPC, ROI)\nStep 4: Segment by channel\nStep 5: Identify top performers\nStep 6: Generate insights and recommendations'
        },
        { role: 'user', content: 'データをスクラッチパッドに整理してもらえますか？', timestamp: new Date(Date.now() - 850000).toISOString() },
        {
          role: 'ai',
          type: 'dione',
          status: 'success',
          content: 'スクラッチパッドにQ2マーケティング分析レポートを作成しました。以下のセクションを含めました：\n\n✅ エグゼクティブサマリー\n✅ チャネル別詳細分析\n✅ 予算配分最適化案\n✅ 次四半期への推奨事項\n\nスクラッチパッドタブで確認してください。さらに詳細な分析が必要な部分があればお知らせください。',
          timestamp: new Date(Date.now() - 840000).toISOString()
        },
        { role: 'user', content: 'Emailキャンペーンの詳細なセグメンテーション分析をお願いします', timestamp: new Date(Date.now() - 750000).toISOString() },
        {
          role: 'ai',
          type: 'thinking',
          status: 'success',
          content: '詳細分析を実施中...\n\nステップ1: Emailキャンペーンのセグメント識別\nステップ2: 各セグメントのエンゲージメント指標計算\nステップ3: 年齢層・性別・地域別の効果測定\nステップ4: A/Bテスト結果の統計分析\nステップ5: セグメント別最適な送信時間の決定\nステップ6: パーソナライゼーション機会の特定',
          timestamp: new Date(Date.now() - 740000).toISOString(),
          trace: 'Analyzing 12 customer segments\nProcessing 450K email interactions\nCalculating engagement metrics\nPerforming chi-square tests for significance\nIdentifying optimal send times by timezone'
        },
        {
          role: 'ai',
          type: 'dione',
          status: 'success',
          content: '📧 **Emailキャンペーン セグメント分析完了**\n\n🔝 **Top Performer: 25-34歳 / 東京都**\n- OpenRate: 48%\n- CTR: 5.2%\n- Conversion: 2.8%\n- Best Send Time: 火・木 10:00-11:00\n\n🎯 **High Potential: 35-44歳 / 大阪府**\n- OpenRate: 42%\n- CTR: 4.1%\n- Conversion: 2.1%\n- 最適タイミング: 水・金 15:00-16:00\n\n💼 **Enterprise Segment: 45+ / 全国**\n- OpenRate: 35%\n- CTR: 3.2%\n- Conversion: 3.5% (最高)\n- 注: リード育成に時間必要\n\n**アクション:** セグメント別パーソナライゼーション実装で平均CTRが8%向上予測。',
          timestamp: new Date(Date.now() - 730000).toISOString()
        },
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: '新規顧客セグメント戦略',
      messages: [
        { role: 'user', content: 'VIPカスタマー層の行動パターン分析をしてください', timestamp: new Date(Date.now() - 600000).toISOString() },
        {
          role: 'ai',
          type: 'dione',
          status: 'success',
          content: '👑 **VIPカスタマー層の分析結果**\n\n📈 **購買パターン**\n- 月平均購買回数: 8.2回\n- 平均注文額: ¥28,500\n- リピート率: 92%\n- LTV: ¥342,000\n\n🎁 **嗜好性**\n- プレミアム商品: 68%\n- 限定版: 54%\n- 高速配送: 87%\n\n💬 **コミュニケーション**\n- メール開封率: 76%\n- SMS開封率: 89%\n- チャットサポート利用: 42%\n\n💡 **推奨施策:**\n1. VIP専用会員プログラム立ち上げ\n2. 専任コンシェルジュサービス\n3. 先行商品販売イベント',
          timestamp: new Date(Date.now() - 590000).toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    }
  ])
  const [currentChatId, setCurrentChatId] = useState(1)
  const [scratchpadTabs, setScratchpadTabs] = useState([
    {
      id: 1,
      title: 'Q2マーケティング分析レポート',
      content: `# Q2 マーケティング分析レポート

## エグゼクティブサマリー

### 主要KPI
- **総インプレッション数**: 2,500,000
- **クリック数**: 80,000
- **クリック率**: 3.2%
- **コンバージョン数**: 1,440
- **コンバージョン率**: 1.8%
- **総広告費用**: $19,600
- **ROI**: 185%

---

## チャネル別パフォーマンス

### 📧 Email キャンペーン ⭐ **最高パフォーマー**
- インプレッション: 450,000
- クリック率: 4.8%
- コンバージョン率: 2.5%
- ROI: **420%**
- **推奨アクション**: 予算を30%増加

### 📱 Social Media
- インプレッション: 1,200,000
- クリック数: 89,000 (最多)
- クリック率: 2.1%
- コンバージョン率: 1.2%
- ROI: 150%

### 📺 Display Ads
- インプレッション: 850,000
- CPC: ¥180 (最低)
- ROI: 120%

---

## 次四半期への提言

1. **予算最適化**: Email向けを45%、Social向けを40%、Display向けを15%に配分
2. **パーソナライゼーション**: セグメント別の最適送信時間に合わせたキャンペーン実施
3. **A/Bテスト**: 件名行と画像パターンのテスト継続
4. **自動化**: 高エンゲージメントセグメントのドリップキャンペーン設計

**期待される成果**: 全体ROI 20-25%向上`,
      history: [''],
      historyIndex: 0
    },
    {
      id: 2,
      title: 'セグメント分析ノート',
      content: `# 顧客セグメント分析ノート

## VIP層特性 (LTV ¥342,000)

### 購買行動
- 月平均購買: 8.2回
- 平均注文額: ¥28,500
- リピート率: 92%
- チャーンレート: 0.8%/月

### コミュニケーション選好
- メール開封率: 76%
- SMS開封率: 89%
- プッシュ通知開封率: 71%

### 提案
- VIP専用会員プログラムの立ち上げ
- 専任コンシェルジュサービス開始
- 先行商品販売イベント月2回開催
- カスタマイズされたギフト

---

## 標準層最適化戦略

### 目標
標準層顧客をVIP層へ昇格させる施策

### KPI
- 昇格率: 現在4% → 目標8%
- 平均購買額: ¥8,200 → ¥12,500
- 年間LTV: ¥98,400 → ¥150,000

### アクション
1. パーソナライズされたレコメンデーション導入
2. ロイヤリティプログラムのティアシステム
3. 限定商品へのアクセス権

---

## 休眠顧客の再活性化

### 対象
過去90日間購買なし: 12,400名

### 施策
- Win-back キャンペーン (週2回配信)
- 復帰割引コード (15-25%)
- パーソナライズされた商品提案`,
      history: [''],
      historyIndex: 0
    }
  ])
  const [currentScratchpadTabId, setCurrentScratchpadTabId] = useState(1)
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Email Marketing Best Practices.md',
      type: 'document',
      content: `# Email Marketing ベストプラクティス

## キャンペーン設計

### 件名行 (Subject Line)
- **最適な長さ**: 30-50文字
- **高開封率パターン**: 数字、疑問形、パーソナライゼーション
- **テスト**: 必ず50/50 A/Bテスト実施

### 送信タイミング
- 火曜日〜木曜日が最適
- 午前10時、午後2時がピーク
- セグメント別タイムゾーン対応

### コンテンツ構成
1. **プリヘッダー**: 40-50文字で主要なメッセージ
2. **ヘッダー**: ロゴ + ナビゲーション
3. **メインコンテンツ**: 画像+テキストの比率 40:60
4. **CTA**: 1-3個に制限、明確な行動指示
5. **フッター**: 配信停止リンク（必須）

## セグメンテーション戦略

### 基本セグメント
- **新規顧客**: ウェルカムシーケンス (5日間)
- **アクティブ**: 週1-2回配信
- **休眠**: Win-back キャンペーン
- **VIP**: 専用コンテンツ + 早期アクセス

## メトリクス

### 主要KPI
- **Open Rate**: 業界平均 20-25%, 目標 28%+
- **Click Rate**: 業界平均 2-3%, 目標 4%+
- **Conversion Rate**: 業界平均 1-2%, 目標 2.5%+
- **Unsubscribe Rate**: 許容 0.5% 以下

### 計算式
- **Open Rate** = (開封数 / 配信数) × 100
- **CTR** = (クリック数 / 開封数) × 100
- **Conversion Rate** = (コンバージョン数 / 配信数) × 100`,
      filePath: '/knowledge_base/email-marketing.md',
      tags: { category: 'marketing', channel: 'email', expertise: 'high' }
    },
    {
      id: 2,
      name: 'Customer Segmentation Guide.md',
      type: 'document',
      content: `# 顧客セグメンテーション戦略ガイド

## セグメント定義

### LTV (ライフタイムバリュー) に基づく分類

#### Segment 1: VIP (LTV ¥300,000+)
- **特徴**: 高頻度購買、高単価
- **構成比**: 2-5%
- **貢献度**: 売上の40-60%
- **戦略**: パーソナライズ + 専任サポート
- **施策**: 限定イベント、先行販売

#### Segment 2: 成長中 (LTV ¥100,000-300,000)
- **特徴**: 増加傾向、昇格可能
- **構成比**: 10-15%
- **貢献度**: 売上の25-35%
- **戦略**: エンゲージメント向上
- **施策**: パーソナライズメール、ロイヤリティ特典

#### Segment 3: 標準層 (LTV ¥50,000-100,000)
- **特徴**: 安定購買、基本的なエンゲージ
- **構成比**: 35-50%
- **貢献度**: 売上の15-25%
- **戦略**: 効率的な保持
- **施策**: 自動化フロー、ニュースレター

#### Segment 4: 休眠 (LTV ¥10,000-50,000)
- **特徴**: 購買停止、チャーン寸前
- **構成比**: 30-40%
- **貢献度**: 売上の5-10%
- **戦略**: Win-back キャンペーン
- **施策**: リターゲティング、割引オファー

## 実装ロードマップ

**フェーズ 1** (1ヶ月): セグメント構築
**フェーズ 2** (2-3ヶ月): パーソナライゼーション実装
**フェーズ 3** (4-6ヶ月): 自動化フロー構築`,
      filePath: '/knowledge_base/segmentation.md',
      tags: { category: 'strategy', focus: 'segmentation', level: 'advanced' }
    },
    {
      id: 3,
      name: '2024年 Q2 Marketing Calendar.md',
      type: 'document',
      content: `# 2024年 Q2 マーケティングカレンダー

## キャンペーンスケジュール

### 4月 - 春セール準備月
**テーマ**: 新商品導入 + 既存顧客エンゲージ

- **4/1-7**: Spring Preview キャンペーン (VIP)
- **4/8-14**: アーリーアクセス (成長中層)
- **4/15-30**: 全顧客向け春セール

**期待達成**: 売上 ¥45M

### 5月 - ゴールデンウィーク特別キャンペーン
**テーマ**: 家族向け / リラックス提案

- **4/25-5/2**: GW限定商品 先行販売
- **5/3-6**: 送料無料キャンペーン
- **5/7-31**: セール継続 + 夏商品プレビュー

**期待達成**: 売上 ¥52M

### 6月 - Summer Collection Launch
**テーマ**: 夏本番 / 新作コレクション

- **6/1-15**: Summer Preview Week
- **6/16-30**: 本格セール + 限定品

**期待達成**: 売上 ¥55M

---

**Q2 売上目標**: ¥152M
**目標達成率**: 105%`,
      filePath: '/knowledge_base/marketing-calendar.md',
      tags: { category: 'planning', timeframe: 'q2-2024' }
    },
  ])
  const [libraries, setLibraries] = useState([
    {
      id: 1,
      name: 'Q2_campaign_data.csv',
      type: 'library',
      content: 'Channel,Impressions,Clicks,CTR,Conversions,CVR,Spend,Revenue,ROI\nEmail,450000,21600,4.8%,540,2.5%,2400,10080,420%\nSocial Media,1200000,25200,2.1%,302,1.2%,8500,12758,150%\nDisplay Ads,850000,33200,3.9%,598,1.8%,8700,10370,120%',
      filePath: '/uploads/Q2_campaign_data.csv',
      tags: {
        source: 'chat',
        uploadedAt: new Date(Date.now() - 700000).toISOString(),
        fileType: 'text/csv',
        campaign: 'Q2-2024'
      }
    },
    {
      id: 2,
      name: 'customer_segmentation_analysis.xlsx',
      type: 'library',
      content: '',
      file: null,
      filePath: '/uploads/customer_segmentation_analysis.xlsx',
      tags: {
        source: 'chat',
        uploadedAt: new Date(Date.now() - 650000).toISOString(),
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        focus: 'VIP-Standard-Dormant'
      }
    },
    {
      id: 3,
      name: 'Email_Template_Q2.html',
      type: 'library',
      content: '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: Arial, sans-serif; }\n    .container { max-width: 600px; margin: 0 auto; }\n    .header { background-color: #6C6CFF; padding: 20px; color: white; }\n    .content { padding: 20px; background-color: #f9f9f9; }\n    .cta-button { background-color: #6C6CFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; }\n  </style>\n</head>\n<body>\n  <div class="container">\n    <div class="header">\n      <h1>Q2 Special Offer</h1>\n    </div>\n    <div class="content">\n      <p>Dear Valued Customer,</p>\n      <p>We have an exclusive offer for you this quarter...</p>\n      <a href="#" class="cta-button">Shop Now</a>\n    </div>\n  </div>\n</body>\n</html>',
      filePath: '/uploads/Email_Template_Q2.html',
      tags: {
        source: 'chat',
        uploadedAt: new Date(Date.now() - 600000).toISOString(),
        fileType: 'text/html',
        purpose: 'email-template'
      }
    },
    {
      id: 4,
      name: 'Q2_Marketing_Strategy.pptx',
      type: 'library',
      content: '',
      file: null,
      filePath: '/uploads/Q2_Marketing_Strategy.pptx',
      tags: {
        source: 'chat',
        uploadedAt: new Date(Date.now() - 550000).toISOString(),
        fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        slides: '24'
      }
    },
    {
      id: 5,
      name: 'brand_guidelines_2024.pdf',
      type: 'library',
      content: '',
      file: null,
      filePath: '/uploads/brand_guidelines_2024.pdf',
      tags: {
        source: 'chat',
        uploadedAt: new Date(Date.now() - 500000).toISOString(),
        fileType: 'application/pdf',
        version: '2.1'
      }
    },
    {
      id: 6,
      name: 'social_media_content_calendar.xlsx',
      type: 'library',
      content: '',
      file: null,
      filePath: '/uploads/social_media_content_calendar.xlsx',
      tags: {
        source: 'chat',
        uploadedAt: new Date(Date.now() - 450000).toISOString(),
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        platform: 'Instagram-Twitter-Facebook'
      }
    }
  ])

  const currentChat = chatSessions.find(chat => chat.id === currentChatId)

  const handleSendMessage = (userMessage, attachments = []) => {
    const updatedSessions = chatSessions.map(chat => {
      if (chat.id === currentChatId) {
        const newMessage = {
          role: 'user',
          content: userMessage,
          timestamp: new Date().toISOString()
        }

        // Add attachments if any
        if (attachments.length > 0) {
          newMessage.attachments = attachments.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: file.preview
          }))

          // Add attachments to libraries (uploaded documents)
          const newLibraries = attachments.map(file => ({
            id: Date.now() + Math.random(),
            name: file.name,
            type: 'library',
            content: '',
            file: file.file,
            filePath: `Uploaded from chat at ${new Date().toLocaleString('ja-JP')}`,
            tags: {
              source: 'chat',
              uploadedAt: new Date().toISOString(),
              fileType: file.type
            }
          }))

          setLibraries(prevLibs => [...prevLibs, ...newLibraries])
        }

        const newMessages = [...chat.messages, newMessage]

        // Update title if this is the first message
        const title = chat.messages.length === 0
          ? (userMessage || 'ファイル添付').substring(0, 30) + ((userMessage || 'ファイル添付').length > 30 ? '...' : '')
          : chat.title

        return { ...chat, messages: newMessages, title }
      }
      return chat
    })

    setChatSessions(updatedSessions)

    // Simple AI response logic
    setTimeout(() => {
      let aiResponse = ''
      const lowerMessage = userMessage.toLowerCase()

      if (lowerMessage.includes('スクラッチパッド') || lowerMessage.includes('scratchpad')) {
        aiResponse = 'スクラッチパッドを更新しました。'
        handleScratchpadUpdate(
          scratchpadTabs.find(tab => tab.id === currentScratchpadTabId)?.content +
          '\n// AI generated content\n' + userMessage
        )
      } else if (lowerMessage.includes('こんにちは') || lowerMessage.includes('hello')) {
        aiResponse = 'こんにちは！どのようにお手伝いできますか？'
      } else {
        aiResponse = 'ご質問ありがとうございます。シンプルなAIとして、基本的な応答のみ可能です。'
      }

      setChatSessions(prevSessions =>
        prevSessions.map(chat => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [...chat.messages, { role: 'ai', type: 'dione', status: 'success', content: aiResponse, timestamp: new Date().toISOString() }]
            }
          }
          return chat
        })
      )
    }, 500)
  }

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: '新しいチャット',
      messages: [],
      createdAt: new Date().toISOString()
    }
    setChatSessions([newChat, ...chatSessions])
    setCurrentChatId(newChat.id)
  }

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId)
  }

  const handleDeleteChat = (chatId) => {
    const filteredSessions = chatSessions.filter(chat => chat.id !== chatId)

    if (filteredSessions.length === 0) {
      // Create a new empty chat if all are deleted
      const newChat = {
        id: Date.now(),
        title: '新しいチャット',
        messages: [],
        createdAt: new Date().toISOString()
      }
      setChatSessions([newChat])
      setCurrentChatId(newChat.id)
    } else {
      setChatSessions(filteredSessions)
      if (currentChatId === chatId) {
        setCurrentChatId(filteredSessions[0].id)
      }
    }
  }

  // Scratchpad handlers
  const handleScratchpadUpdate = (newContent) => {
    setScratchpadTabs(prevTabs =>
      prevTabs.map(tab => {
        if (tab.id === currentScratchpadTabId) {
          const newHistory = tab.history.slice(0, tab.historyIndex + 1)
          newHistory.push(newContent)
          return {
            ...tab,
            content: newContent,
            history: newHistory,
            historyIndex: newHistory.length - 1
          }
        }
        return tab
      })
    )
  }

  const handleScratchpadUndo = () => {
    setScratchpadTabs(prevTabs =>
      prevTabs.map(tab => {
        if (tab.id === currentScratchpadTabId && tab.historyIndex > 0) {
          const newIndex = tab.historyIndex - 1
          return {
            ...tab,
            content: tab.history[newIndex],
            historyIndex: newIndex
          }
        }
        return tab
      })
    )
  }

  const handleScratchpadRedo = () => {
    setScratchpadTabs(prevTabs =>
      prevTabs.map(tab => {
        if (tab.id === currentScratchpadTabId && tab.historyIndex < tab.history.length - 1) {
          const newIndex = tab.historyIndex + 1
          return {
            ...tab,
            content: tab.history[newIndex],
            historyIndex: newIndex
          }
        }
        return tab
      })
    )
  }

  const handleNewScratchpadTab = () => {
    const newTab = {
      id: Date.now(),
      title: `Untitled ${scratchpadTabs.length + 1}`,
      content: '',
      history: [''],
      historyIndex: 0
    }
    setScratchpadTabs([...scratchpadTabs, newTab])
    setCurrentScratchpadTabId(newTab.id)
  }

  const handleSelectScratchpadTab = (tabId) => {
    setCurrentScratchpadTabId(tabId)
  }

  const handleCloseScratchpadTab = (tabId) => {
    const filteredTabs = scratchpadTabs.filter(tab => tab.id !== tabId)

    if (filteredTabs.length === 0) {
      const newTab = {
        id: Date.now(),
        title: 'Untitled 1',
        content: '',
        history: [''],
        historyIndex: 0
      }
      setScratchpadTabs([newTab])
      setCurrentScratchpadTabId(newTab.id)
    } else {
      setScratchpadTabs(filteredTabs)
      if (currentScratchpadTabId === tabId) {
        setCurrentScratchpadTabId(filteredTabs[0].id)
      }
    }
  }

  const handleRenameScratchpadTab = (tabId, newTitle) => {
    setScratchpadTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === tabId ? { ...tab, title: newTitle } : tab
      )
    )
  }

  const handleUploadLibrary = (file) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const newLibrary = {
        id: Date.now(),
        name: file.name,
        type: 'library',
        content: e.target.result,
        file: file
      }
      setLibraries([...libraries, newLibrary])
    }

    // Read as text for most files, but handle binary files differently
    const fileType = file.name.split('.').pop().toLowerCase()
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileType)) {
      // For binary files, store the file object directly
      const newLibrary = {
        id: Date.now(),
        name: file.name,
        type: 'library',
        content: '',
        file: file
      }
      setLibraries([...libraries, newLibrary])
    } else {
      reader.readAsText(file)
    }
  }

  const handleDeleteLibrary = (libraryId) => {
    setLibraries(libraries.filter(lib => lib.id !== libraryId))
  }

  const handleDeleteDocument = (documentId) => {
    setDocuments(documents.filter(doc => doc.id !== documentId))
  }

  const currentScratchpadTab = scratchpadTabs.find(tab => tab.id === currentScratchpadTabId)

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className={`app-container ${theme}-theme`}>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={35} minSize={15} maxSize={50}>
          <ChatPanel
            chatSessions={chatSessions}
            currentChatId={currentChatId}
            currentMessages={currentChat?.messages || []}
            onSendMessage={handleSendMessage}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        </Panel>
        <PanelResizeHandle className="resize-handle" />
        <Panel defaultSize={40} minSize={25}>
          <Scratchpad
            tabs={scratchpadTabs}
            currentTabId={currentScratchpadTabId}
            currentTab={currentScratchpadTab}
            onUpdate={handleScratchpadUpdate}
            onUndo={handleScratchpadUndo}
            onRedo={handleScratchpadRedo}
            onNewTab={handleNewScratchpadTab}
            onSelectTab={handleSelectScratchpadTab}
            onCloseTab={handleCloseScratchpadTab}
            onRenameTab={handleRenameScratchpadTab}
          />
        </Panel>
        <PanelResizeHandle className="resize-handle" />
        <Panel defaultSize={25} minSize={15} maxSize={40}>
          <DocumentPanel
            documents={documents}
            libraries={libraries}
            onUploadLibrary={handleUploadLibrary}
            onDeleteLibrary={handleDeleteLibrary}
            onDeleteDocument={handleDeleteDocument}
          />
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default App
