# Gamen (画面)

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

**A next-generation UI mockup exploring artifact-first design for multi-agent AI workflows**

Gamen demonstrates four core paradigms for human-AI collaboration: **artifact-first design**, **dynamic agent configuration**, **user-led control**, and **unified knowledge access**.

[Quick Start](#-getting-started) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-project-structure)

</div>

---

## 🌍 Language Support

Read this README in your preferred language:

| Language | Link |
|----------|------|
| 🇬🇧 **English** | [README.md](README.md) |
| 🇯🇵 **日本語** | [README.ja.md](README.ja.md) |
| 🇩🇪 **Deutsch** | [README.de.md](README.de.md) |
| 🇫🇷 **Français** | [README.fr.md](README.fr.md) |
| 🇨🇳 **简体中文** | [README.zh.md](README.zh.md) |
| 🇰🇷 **한국어** | [README.ko.md](README.ko.md) |
| 🇪🇸 **Español** | [README.es.md](README.es.md) |

---

## 🚀 What is Gamen?

Gamen (画面, literally "screen") is a **working prototype exploring UX paradigms for multi-agent AI workflows**. It reimagines how humans and AI agents collaborate by treating:

1. **Artifact-First Screen** — AI outputs and artifacts are first-class citizens, not ephemeral chat
2. **Automatic Agent Prompt Renewal** — Dynamic guideline editing for real-time agent reconfiguration
3. **User-Led Tools & Tasks Management** — Explicit user control over tool execution and task orchestration
4. **Knowledge Base Integration** — Unified document library for contextual intelligence

Built with **React 19**, **Zustand**, and **Framer Motion**. Inspired by Dione's workspace concepts. **MIT License**.

---

## 📖 Table of Contents

- [🌍 Language Support](#-language-support)
- [🚀 What is Gamen?](#-what-is-gamen)
- [🎯 Philosophy](#-philosophy)
- [🎬 Visual Overview](#-visual-overview)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [💡 Design Philosophy](#-design-philosophy)
- [📜 License](#-license)

---

## 🎯 Philosophy

### Artifact-First Screen

The workspace treats AI outputs as **persistent artifacts**, not transient messages:

- **Thinking Traces**: Step-by-step AI reasoning with execution details
- **Tool Execution Logs**: Tool arguments, results, error traces, and timestamps
- **Collaborative Artifacts**: Markdown scratchpads with version control and publishing
- **Contextual Knowledge**: Dual-source document library (knowledge base + user uploads)

Every artifact remains visible and accessible within the same workspace, creating persistent context.

### Automatic Agent Prompt Renewal

Agents are not static. The **Guideline Editor** allows real-time agent reconfiguration:

- Edit and review agent system prompts without restarting
- Modify tool availability and task parameters on-the-fly
- Changes apply to ongoing conversations immediately
- Guideline history for tracking configuration evolution

### User-Led Tools & Tasks Management

Users maintain control throughout AI operations:

- **Task Integration**: Create, manage, and reference tasks via @mentions in chat
- **Explicit Tool Selection**: Configure which tools agents can access
- **Bidirectional Linking**: Tasks and conversations stay synchronized
- **Task Panel**: View, search, and filter tasks by priority and status

Users guide agent behavior. Agents augment—never replace—human judgment.

### Knowledge Base Integration (Library Panel)

Contextual intelligence is unified and accessible:

- **Dual-Source Documents**: Knowledge base and user uploads in one panel
- **Polymorphic Preview**: Markdown, PDF, Excel, Word, images, and code—all rendered inline
- **Rich Metadata**: Category, framework, level, source, upload timestamp
- **Drag-and-Drop**: Instantly add documents to chat or scratchpad
- **Attachment Continuity**: Documents stay linked to messages for context

Knowledge never goes out of reach—it lives in the workspace alongside conversation.

---

## 🎬 Visual Overview

### Three-Panel Workspace Architecture

The unified workspace seamlessly integrates chat, artifacts, and knowledge in one coordinated environment:

**Dark Mode** — Night sky with glowing tech accents
![Gamen Dark Mode](screens/darkmode-default-screen.png)

**Light Mode** — Day sky with drifting clouds
![Gamen Light Mode](screens/lightmode-default-screen.png)

### Artifact-First Scratchpad

Every scratchpad artifact features version control, live statistics (character/word count, engagement metrics), and a circular artifact controller for quick actions:

![Artifact Controller](screens/artifact-controler.png)

The published artifacts track engagement with real-time animated statistics at the bottom of each scratchpad.

### Automatic Agent Prompt Renewal

The Guideline Editor enables dynamic agent reconfiguration without restarting conversations:

![Guideline Editor](screens/editing-guidelines-by-chat.png)

Users edit system prompts, task parameters, and guidelines. Changes apply immediately to ongoing conversations, allowing real-time agent behavior adaptation.

### Knowledge Base Integration

The Library panel unifies AI knowledge and user uploads with rich metadata tagging (category, channel, expertise level, source, timestamp):

![Library Panel with Metadata](screens/knowledge-base-item-hovered.png)

Documents are easily accessible via drag-and-drop to chat or scratchpad, keeping contextual intelligence always in reach.

### Project Organization & Chat History

The chat sidebar reveals projects and organized conversations, enabling users to group related chats and maintain conversation context:

![Chat History with Project Folders](screens/chat-hostory-and-project-folder-revealed.png)

### User-Led Task Management

Task Settings modal provides comprehensive task search, filtering by status and priority, and detailed task descriptions with project associations:

![Task Settings & Management](screens/task-settings.png)

Users can search, filter, mark as complete, edit, or delete tasks directly within the workspace.

### Explicit Tool Configuration

Tool Settings modal displays available tools organized by category (Search, Cloud Storage, etc.) with enable/disable toggles and individual tool configuration:

![Tool Settings & Configuration](screens/tool-settings.png)

Users explicitly choose which tools the agent can access, maintaining full control over capabilities.

### Collaborative Workspace

Invite collaborators by searching for users by name, email, or role:

![Invite Collaborators](screens/collaborators-adding.png)

View and manage team members with detailed information including email, role, and membership controls:

![Member Information & Management](screens/collaborators-editing.png)

The workspace supports real-time collaboration with team members, transparent member management, and role-based organization.

---

## ✨ Features

### 🗨️ Chat Panel

- **Multiple chat sessions** with persistent message history
- **Rich message types**:
  - **Standard responses** (full markdown with syntax highlighting)
  - **Thinking traces** (step-by-step reasoning with execution details)
  - **Tool execution logs** (arguments, results, error traces with timestamps)
  - **System messages** (collaborative events and status updates)
- **Interactive detail modal** — Inspect reasoning, tool arguments, and error logs
- **Task @mentions** — Reference tasks inline with autocomplete
- **File attachments** — Preview images, documents, and media
- **Reply threading** — Quote and reference specific messages
- **Theme toggle** — Switch between animated dark and light themes

### 📝 Scratchpad (Artifact Editor)

- **Multi-tab markdown editor** with full edit/preview modes
- **Undo/redo history** per tab with visual navigation
- **Publishing system** — Publish notes with engagement tracking (views, likes, shares)
- **Live statistics** — Real-time character and word count with animated transitions
- **Download export** — Save markdown content locally
- **Document integration** — Drag documents into scratchpad for annotation
- **Full markdown support** — Tables, lists, code blocks, syntax highlighting

### 📚 Document Library (Knowledge Panel)

- **Dual-source document management**:
  - Knowledge base documents (AI-referenced)
  - User-uploaded files (PDF, Excel, Word, images, code, text, Markdown)
- **Format support**:
  - **Markdown**: Native rendering with syntax highlighting
  - **PDF**: Inline iframe preview
  - **Excel**: HTML table conversion
  - **Word**: HTML rendering via Mammoth
  - **Images, Code, Text**: Direct rendering with appropriate styling
- **Metadata tagging** — Category, framework, level, source, upload time
- **File operations** — Upload, download, delete with drag-and-drop
- **Preview modal** — Full-screen document viewing

### ⚙️ Guideline Editor (Agent Configuration)

- Edit agent system prompts and instructions
- Configure task templates and parameters
- Manage tool availability and settings
- Changes apply immediately to ongoing conversations

### 🎨 Theming & UI

- **Animated themes**:
  - **Dark**: Night sky with glowing accents and twinkling stars
  - **Light**: Day sky with drifting clouds
- **Resizable multi-panel layout** — Professional panel control with smooth transitions
- **Framer Motion animations** — Spring-based modal opens, counter animations, icon choreography
- **Custom styling** — Frosted glass effects, custom scrollbars, theme-aware components
- **Responsive design** — Adapts to different screen sizes

---

## 🛠 Tech Stack

**Frontend**: React 19, Vite
**State Management**: Zustand with localStorage persistence, Redux DevTools
**Rendering**: React Markdown (GFM, syntax highlighting), Mammoth (DOCX), XLSX (Excel)
**UI & Animation**: Framer Motion, react-resizable-panels, Radix UI, Tailwind CSS v4, React Icons
**Styling**: Component-scoped CSS modules with advanced animations

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **pnpm**
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/AyaNetworks/gamen.git
cd gamen/ai-workspace-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Quick Demo

Once the server is running, open your browser and navigate to:

```
http://localhost:5173
```

**Demo Credentials:**
| Field | Value |
|-------|-------|
| 📧 **Email** | `demo@example.com` |
| 🔑 **Password** | `demo123` |

You'll be greeted with a fully functional multi-panel workspace demonstrating all core features!

---

## 📁 Project Structure

```
ai-workspace-app/
├── src/
│   ├── components/        # UI components
│   │   ├── ChatPanel.jsx
│   │   ├── Scratchpad.jsx
│   │   ├── DocumentPanel.jsx
│   │   ├── MessageDetailModal.jsx
│   │   ├── TasksPanel.jsx
│   │   ├── FilePreview.jsx
│   │   └── ... (other modals and panels)
│   ├── store/            # Zustand stores
│   │   ├── useChatStore.ts
│   │   ├── useThemeStore.ts
│   │   ├── useAuthStore.ts
│   │   ├── useProjectStore.ts
│   │   ├── useWorkspaceStore.ts
│   │   └── useTaskStore.ts
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Utility functions (file type detection, etc.)
│   ├── App.jsx           # Main layout with resizable panels
│   ├── App.css           # Global theme animations
│   └── index.css         # Base styles
├── public/               # Static assets
└── package.json          # Dependencies
```

---

## 💡 Design Philosophy

Gamen is **a working prototype exploring UX paradigms** for multi-agent AI workflows—not a production application. It asks:

- **What if artifacts were first-class?** Not buried in chat history, but persistent and accessible.
- **What if agents were dynamically reconfigurable?** Not fixed at deployment, but adaptable through guideline editing.
- **What if users had explicit control?** Not hidden behind agent autonomy, but visible through task and tool management.
- **What if knowledge was always accessible?** Not scattered across tools, but unified in the workspace.

These are design questions, not final answers. Gamen demonstrates one possible approach to human-AI collaboration.

---

## 📜 License

<div align="center">

**MIT License** — See [LICENSE](LICENSE) file for details.

This project is licensed under the MIT License, making it free to use, modify, and distribute.

**Note**: Gamen is inspired by **Dione workspace concepts** (© Dione commercial project). Gamen implements these concepts under MIT License. The name "Dione" and associated branding remain the property of their respective owners.

---

### 🤝 Contributing

Contributions are welcome! We believe in collaborative development. Whether you're fixing bugs, improving documentation, or proposing new features, your contributions help make Gamen better for everyone.

### 📧 Contact & Support

For questions, feedback, or collaboration inquiries:
- 💬 [Open a GitHub Issue](https://github.com/AyaNetworks/gamen/issues)
- 📝 [Discussions](https://github.com/AyaNetworks/gamen/discussions)

---

<div align="center">

**Gamen** — Exploring the future of human-AI collaboration

Built with ❤️ for the global developer community

[⬆ Back to Top](#gamen-画面)

</div>
