# Dione Workspace - Frontend Mockup

An AI-powered collaborative workspace application built with React and Vite. This is a frontend mockup with mock authentication and data - no backend server required.

## Features

- **Authentication**: Frontend-only mock authentication (no backend required)
- **Chat Sessions**: Create, manage, and organize multiple chat conversations
- **Team Collaboration**: Invite collaborators, display team members, and remove members from chats
- **Message Features**:
  - Message augmentation: Enhance messages before sending
  - Reply context: Quote and respond to specific messages
  - System notifications: Join/leave messages for team activities
- **UI/UX**:
  - Dark theme with modern design
  - Smooth animations with Framer Motion
  - Responsive design for various screen sizes
  - Keyboard shortcuts for power users

## Demo Accounts

The application comes with two pre-configured demo accounts for testing:

### Regular User Account
- **Email**: `demo@example.com`
- **Password**: `demo123`
- **Role**: User

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: Admin

You can also create new accounts by signing up - all data is stored locally in your browser.

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Keyboard Shortcuts

- **Ctrl + Enter**: Enter message confirmation mode (shows augment option) or send message
- **Tab**: Augment message text (while in confirmation mode)
- **Escape**: Clear error messages

## Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Zustand with persist middleware
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Styling**: CSS with CSS variables for theming
- **Language**: TypeScript & JavaScript

## Project Structure

```
src/
├── components/        # React components (ChatPanel, LoginScreen, Modals, etc.)
├── store/            # Zustand state management stores
├── types/            # TypeScript type definitions
├── styles/           # Global styles
└── App.jsx           # Main application component
```

## Notes

This is a **frontend mockup** with mock data and authentication:
- All user accounts and chat data are stored in browser localStorage
- Authentication is simulated on the frontend
- No backend API calls are made
- Perfect for UI/UX testing, demos, and prototyping

## License

MIT
