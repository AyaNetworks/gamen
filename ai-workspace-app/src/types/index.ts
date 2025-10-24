// Core data types for the application

export interface Message {
  role: 'user' | 'ai'
  content: string
  timestamp: string
  type?: 'dione' | 'claude'
  status?: 'success' | 'error' | 'pending'
  trace?: string
  replyingTo?: string
  attachedWorkspaces?: Workspace[]
  attachments?: Attachment[]
}

export interface ChatSession {
  id: number
  title: string
  messages: Message[]
  createdAt: string
  projectId?: number
}

export interface Project {
  id: number
  name: string
  createdAt: string
}

export interface Workspace {
  id: string
  name: string
  path: string
  type?: 'folder' | 'file'
}

export interface Attachment {
  name: string
  size: number
  type: string
  preview?: string
}

export interface ReplyContext {
  replyingToContent?: string
  attachedWorkspaces?: Workspace[]
}

export type Theme = 'dark' | 'light'
