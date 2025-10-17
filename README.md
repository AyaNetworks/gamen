# Dione Workspace App

Dione Workspace App is a **React + Vite** application that delivers an AI-assisted, multi-panel workspace for enhanced productivity and collaboration with the Dione AI assistant.  
It integrates **real-time chat**, **markdown-based scratchpads**, and **document management** into a unified interface, with rich support for file handling, theming, and interactive tools.

---

## ✨ Features

### 🗨️ Chat Panel
- **Real-time conversation** with Dione AI.
- **Multiple chat sessions** with persistent history.
- Rich message types:
  - **DIONE** – Standard AI responses.
  - **THINKING** – Displays AI thought process with detailed trace.
  - **TOOL** – Shows tool execution results or errors, including arguments and outputs.
- **Error handling** with traceback display for failed AI/tool operations.
- **File attachments** with previews for images, videos, audio, and documents.
- **Attachment metadata** stored in Dione Knowledge Base for future reference.
- **Theme toggle** between Dark and Light modes.
- **Interactive message details modal** for viewing execution traces, tool arguments/results, and error logs.
- **Compact and expanded chat history views** with hover-based expansion.
- **Attachment previews** before sending, with remove option.

### 📝 Scratchpad
- **Markdown-based collaborative workspace** with syntax highlighting.
- **Preview and edit modes** for seamless content creation.
- **Undo/Redo history** per tab with inline version control buttons.
- **Multi-tab support** with rename and close functionality.
- **Circular context menu controller** for quick actions and mode switching.
- **Context menu directional actions** placeholder for future integrations.
- **Download button** for exporting scratchpad content.
- **Full markdown rendering** with headings, lists, tables, code blocks, and inline code styling.
- **Light/Dark theme styling** for editor and preview.

### 📂 Document Panel
- **Dione Knowledge**: AI-referenced documents for contextual assistance.
- **Uploaded Documents**: User-uploaded files (PDF, PPTX, DOCX, XLSX, images, text, code, etc.).
- **File preview** for:
  - Markdown
  - PDF (inline iframe)
  - Excel (HTML table rendering)
  - Word (HTML conversion via Mammoth)
  - Images
  - Text and code files
- **Unsupported file handling** with clear messaging (e.g., PowerPoint).
- **Download functionality** for any document.
- **Delete and upload** functions.
- **File type icons** powered by `fileTypeDetector`.
- **Preview modal** for viewing document contents in detail.
- **Tag display** for metadata such as category, framework, level, source, and upload time.

### 🎨 Theming & UI
- **Dark Theme**: Animated night sky with glowing tech accents and twinkling stars.
- **Light Theme**: Animated day sky with drifting clouds.
- **Resizable panels** with visual hover/active indicators.
- **Responsive layout** for different screen sizes.
- **Custom scrollbar styling** for all scrollable areas.

---

## 🛠 Tech Stack
- **Frontend**: React 19, Vite
- **UI Components**: `react-resizable-panels`, `react-icons`
- **Markdown Rendering**: `react-markdown`, `remark-gfm`, `remark-breaks`, `rehype-highlight`
- **File Handling**: `mammoth` (DOCX), `xlsx` (Excel), `react-pdf` (PDF)
- **Styling**: Component-scoped CSS modules with advanced theme animations

---

## 🚀 Installation

```bash
# Install dependencies
uv run npm install

# Start development server
uv run npm run dev
```

---

## 📁 Project Structure

```
ai-workspace-app/
├── public/                # Static assets
├── src/
│   ├── components/        # UI components (ChatPanel, Scratchpad, DocumentPanel, FilePreview, MessageDetailModal, etc.)
│   ├── utils/             # Utility functions (file type detection)
│   ├── App.jsx            # Main layout with resizable panels
│   ├── main.jsx           # Entry point
│   ├── App.css            # Global styles with theme animations
│   ├── index.css          # Base styles
└── package.json           # Dependencies and scripts
```

---

## 📖 Usage
1. **Chat** with Dione AI to get answers, run tools, or view AI thought processes.
2. Use the **Scratchpad** to collaboratively edit and preview markdown notes.
3. Manage **Documents** by uploading, previewing, downloading, and deleting files.
4. Switch between **Dark** and **Light** themes for optimal viewing.
5. Resize panels to customize your workspace layout.
6. View detailed execution traces and tool logs via the message detail modal.

---

## 📜 License
This project is private and not licensed for public distribution.
