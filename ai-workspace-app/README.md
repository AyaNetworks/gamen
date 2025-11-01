# Dione Workspace - Frontend Mockup

An AI-powered collaborative workspace application built with React and Vite. This is a comprehensive frontend mockup with mock authentication and realistic sample data - no backend server required.

## Features Overview

### 🔐 Authentication & User Management
- **Frontend-only Mock Authentication**: Complete login/signup system with localStorage persistence
- **Demo Accounts**: Pre-configured accounts for instant testing
- **Account Modal**: View profile, last login time, and toggle system guidelines
- **User Management**: Add/remove collaborators with system notifications

### 💬 Chat & Messaging
- **Multiple Chat Sessions**: Create, manage, and switch between different conversations
- **Project Organization**: Organize chats into projects for better structure
- **Message Types**:
  - **Dione Messages**: AI responses with success/pending/error states
  - **Tool Execution**: Track tool selection and execution with detailed traces
  - **System Messages**: Notifications for member joins/leaves
  - **User Messages**: Direct chat input with augmentation options
- **Message Details Modal**: Click any message to view detailed trace information
- **Message Actions**: Copy message content with keyboard shortcuts

### ✨ Advanced Message Features
- **Message Augmentation**:
  - Press `Ctrl+Enter` to enter confirmation mode
  - Press `Tab` to optimize message text with AI suggestions
  - Press `Ctrl+Enter` again to send the final message
- **Reply Context**: Quote specific messages to keep conversations organized
- **Auto-expanding Input**: Chat input field grows with content (up to 200px max)
- **Scroll Navigation**: Scroll through long messages in the input field
- **Task Mentions**: Use `@` to mention tasks and track them in conversations

### 👥 Team Collaboration
- **Chat Member Display**: See team member avatars at the top of each chat
- **Member Details Modal**: Click avatars to view member information
- **Member Removal**: Remove team members from chats with system notifications
- **Invite Collaborator Button**:
  - Floating button to invite new team members
  - Automatically hides when sidebar is hovered (smooth fade animation)
- **System Notifications**: Track member joins and leaves in chat history

### 🛠️ Tool Management & Configuration
- **Tool Types**:
  - **Search**: Web, Documents, Code Search
  - **Cloud Storage**: Google Drive, Dropbox, OneDrive
  - **Database**: PostgreSQL, MongoDB, MySQL
  - **Communication**: Email, Slack, Teams
  - **Task Management**: GitHub Issues, Jira, Asana
  - **APIs**: RESTful APIs, GraphQL APIs, Webhook APIs
  - **Code Execution**: Python, JavaScript
  - **Analytics**: Google Analytics, Mixpanel

- **MCP Servers** (6 pre-configured):
  - File System, GitHub, PostgreSQL, Slack, Browser, Google Drive
  - Each with independent configuration settings

- **A2A Agents** (6 pre-configured):
  - Research Agent, Data Analysis, Code Assistant, Content Generation, Project Manager, QA
  - Specialized configuration for each agent type

- **Tool Configuration Modal**:
  - Enable/disable tools per chat
  - Configure authentication, connections, rate limiting, logging
  - Type-based dropdown with organized categories
  - MCP and A2A specific settings

### 🎨 User Interface & Experience
- **Dark Theme**: Modern dark interface with glassmorphism effects
- **Light/Dark Mode Toggle**: Switch between themes in the header
- **Smooth Animations**: Framer Motion for UI transitions
- **Sidebar Navigation**:
  - Collapsible chat history sidebar (expands on hover)
  - Compact view when closed, full view when expanded
  - Projects organization support
- **Responsive Design**: Works on various screen sizes
- **Visual Indicators**: Message status badges, member avatars, tool badges

### 📊 Sample Data & Demonstrations
The mockup includes 10 pre-configured chat sessions demonstrating:
- **Chat 1**: Q2 Marketing Analysis (Success message)
- **Chat 2**: New Customer Segment Strategy (Pending to Success)
- **Chat 3**: Product Roadmap Q3-Q4 (Tool execution with Jira)
- **Chat 4**: Bug Report & Response (Error handling and recovery)
- **Chat 5**: API Documentation Organization (Multiple tool executions)
- **Chat 8**: Data Processing Pipeline Optimization (Multiple states)
- **Chat 9**: Research Agent Execution (Research Agent with tools)
- **Chat 10**: Tool Execution Workflow (Complete Dione → Tool → Dione flow)

Each chat demonstrates different message types:
- ✅ Success messages
- ⏳ Pending/thinking states
- ❌ Error messages with detailed traces
- 🔧 Tool execution with arguments and results

### ⌨️ Keyboard Shortcuts
- **Ctrl + Enter**: Enter message confirmation mode or send message
- **Tab**: Augment message text (in confirmation mode only)
- **Escape**: Clear error messages or close modals
- **Mouse Wheel**: Scroll through long messages in input field

## Demo Accounts

The application comes with two pre-configured demo accounts:

### Regular User Account
- **Email**: `demo@example.com`
- **Password**: `demo123`
- **Role**: User

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: Admin

You can also create new accounts by signing up - all data is stored locally in your browser's localStorage.

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## Technology Stack

- **Frontend Framework**: React 18 with hooks
- **Build Tool**: Vite
- **State Management**: Zustand with persist middleware (localStorage)
- **Animations**: Framer Motion
- **Icons**: React Icons (Feather icons)
- **Markdown Rendering**: React Markdown with syntax highlighting
- **Styling**: CSS with CSS variables for theming
- **Language**: JavaScript (JSX)
- **Type Safety**: TypeScript definitions in store files

## Project Structure

```
src/
├── components/
│   ├── ChatPanel.jsx              # Main chat interface
│   ├── ChatPanel.css              # Chat styling
│   ├── LoginScreen.jsx            # Authentication screen
│   ├── ConfigurationModal.jsx     # Tool configuration
│   ├── DionePowersScreen.jsx      # System guidelines editor
│   ├── AccountModal.jsx           # User profile modal
│   ├── InviteCollaboratorModal.jsx # Team invitation
│   ├── MemberDetailsModal.jsx     # Member information
│   ├── MessageDetailModal.jsx     # Message trace details
│   ├── ToolsPanel.jsx             # Tool management UI
│   └── ui/
│       └── Button.jsx             # Reusable button component
├── store/
│   ├── useAuthStore.ts            # Authentication state
│   ├── useChatStore.ts            # Chat sessions and messages
│   ├── useThemeStore.ts           # Theme management
│   ├── useWorkspaceStore.ts       # Workspace state
│   ├── useProjectStore.ts         # Project organization
│   └── useTaskStore.ts            # Task tracking
├── types/
│   └── index.ts                   # TypeScript type definitions
├── App.jsx                        # Main application component
├── App.css                        # Global styles
└── main.jsx                       # Entry point
```

## UI Components Explained

### ChatPanel
The main chat interface featuring:
- Left sidebar with chat history and projects
- Member display bar with team avatars
- Message list with different message types
- Input area with augmentation controls
- Floating invite button (hidden when sidebar is hovered)

### Message Types
1. **User Message**: Regular text input, can be augmented
2. **Dione Message**: AI responses with thinking/success/error states
3. **Tool Message**: Tool execution details with trace information
4. **System Message**: Member activity notifications (join/leave)

### Modals
- **Login/Signup**: Authentication with demo accounts
- **Account Modal**: User profile and settings
- **Configuration Modal**: Tool and agent settings per chat
- **Invite Collaborator**: Add team members to chats
- **Member Details**: View and manage team members
- **Message Details**: View detailed trace information
- **Dione Powers Screen**: Edit system guidelines

## Features in Detail

### Message Augmentation Workflow
1. User types a message in the input field
2. User presses `Ctrl+Enter` to enter confirmation mode
3. Placeholder changes to show augment/send options
4. User can press `Tab` to augment the message text
5. User presses `Ctrl+Enter` again to send the final message

### Tool Execution Flow
1. Dione receives user request (shows pending state)
2. Dione selects appropriate tool(s) from available options
3. Tool execution begins (tool message shows pending state)
4. Tool completes with success or error (trace shows details)
5. Dione processes results and sends final response

### Chat Organization
- Create new chats with the `+` button
- Create projects to group related chats
- Drag and drop chats into projects (via sidebar)
- Switch between chats instantly
- Each chat maintains its own message history and settings

## Notes

This is a **frontend mockup** with complete mock data and authentication:
- ✅ All user accounts stored in browser localStorage
- ✅ Chat data persists across page refreshes
- ✅ Authentication is simulated entirely on the frontend
- ✅ No backend API calls required
- ✅ Perfect for UI/UX testing, demos, and prototyping
- ✅ Sample chats include diverse message types and tools
- ✅ Fully functional with realistic user interactions

## Data Persistence

All data is stored in browser localStorage with version tracking:
- User accounts and login information
- Chat sessions and message history
- Tool configurations per chat
- Theme preferences
- Project organization

Clear your browser's localStorage to reset to initial state.

## Browser Support

Works on all modern browsers that support:
- ES2020+
- CSS Grid and Flexbox
- CSS Backdrop Filter
- LocalStorage API
- ResizeObserver API

## Future Enhancements

Potential features for a full implementation:
- Real backend API integration
- WebSocket for real-time collaboration
- File upload and sharing
- Voice/video chat integration
- Advanced message search and filtering
- Custom tool creation interface
- Analytics and usage tracking

## License

MIT
