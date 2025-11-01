// Core data types for the application

export interface Message {
  role: 'user' | 'ai' | 'system'
  content: string
  timestamp: string
  type?: 'dione' | 'claude' | 'join' | 'leave'
  status?: 'success' | 'error' | 'pending'
  trace?: string
  replyingTo?: string
  attachedWorkspaces?: Workspace[]
  attachments?: Attachment[]
  userName?: string
}

export interface ChatMember {
  id: number | string
  displayName: string
  email: string
  role?: string
}

export interface ChatSession {
  id: number
  title: string
  messages: Message[]
  createdAt: string
  projectId?: number
  members?: ChatMember[]
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
