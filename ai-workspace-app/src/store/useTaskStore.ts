import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface Task {
  id: number
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'not_started' | 'in_progress' | 'completed'
  createdAt: string
  scope: 'project' | 'global'
  projectId?: number
}

interface TaskStoreState {
  tasks: Task[]
  addTask: (task: Task) => void
  updateTask: (taskId: number, updates: Partial<Task>) => void
  deleteTask: (taskId: number) => void
  getSortedTasks: () => Task[]
}

export const useTaskStore = create<TaskStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        tasks: [
          {
            id: 1,
            title: 'Schedule New Feature Release',
            description:
              'Adjust the release schedule for new features planned in the next sprint and optimize task distribution among team members.',
            priority: 'high',
            status: 'in_progress',
            createdAt: '2025/1/28',
            scope: 'project',
            projectId: 1,
          },
          {
            id: 2,
            title: 'Create Risk Assessment Report',
            description:
              'Evaluate technical, schedule, and resource risks for the current project and create a report with mitigation strategies.',
            priority: 'medium',
            status: 'not_started',
            createdAt: '2025/1/29',
            scope: 'project',
            projectId: 1,
          },
          {
            id: 3,
            title: 'Stakeholder Progress Report',
            description:
              'Prepare a quarterly progress report for management including milestone achievements and future outlook.',
            priority: 'high',
            status: 'not_started',
            createdAt: '2025/1/30',
            scope: 'global',
          },
          {
            id: 4,
            title: 'Build UI Design System',
            description:
              'Create and document a comprehensive design system including UI components, color palettes, and typography for the entire project.',
            priority: 'high',
            status: 'in_progress',
            createdAt: '2025/1/25',
            scope: 'project',
            projectId: 1,
          },
          {
            id: 5,
            title: 'Fix: Login Screen Bug',
            description:
              'Fix the authentication token storage bug on mobile devices. Test on both iOS and Android platforms.',
            priority: 'high',
            status: 'in_progress',
            createdAt: '2025/1/31',
            scope: 'project',
            projectId: 1,
          },
          {
            id: 6,
            title: 'Optimize Database Performance',
            description:
              'Optimize user data query processing time which is impacting system performance. Implement index optimization and query improvements.',
            priority: 'medium',
            status: 'not_started',
            createdAt: '2025/2/1',
            scope: 'global',
          },
          {
            id: 7,
            title: 'Create API Documentation',
            description:
              'Create complete documentation for the new REST API including endpoints, parameters, response formats, and error codes.',
            priority: 'medium',
            status: 'completed',
            createdAt: '2025/1/15',
            scope: 'global',
          },
          {
            id: 8,
            title: 'Create Team Meeting Minutes',
            description:
              'Create minutes from last week\'s sprint planning meeting and compile decisions and action items.',
            priority: 'low',
            status: 'completed',
            createdAt: '2025/1/20',
            scope: 'global',
          },
          {
            id: 9,
            title: 'Analyze User Feedback',
            description:
              'Extract customer pain points and feature requests from app store reviews and support tickets. Prioritize and report findings.',
            priority: 'medium',
            status: 'not_started',
            createdAt: '2025/2/2',
            scope: 'global',
          },
          {
            id: 10,
            title: 'Perform Security Audit',
            description:
              'Check system security vulnerabilities, identify potential risks, and present mitigation strategies based on OWASP Top 10.',
            priority: 'high',
            status: 'not_started',
            createdAt: '2025/2/3',
            scope: 'global',
          },
          {
            id: 11,
            title: 'Setup Test Environment',
            description:
              'Build a new test environment for CI/CD pipeline and verify existing test suite runs correctly.',
            priority: 'medium',
            status: 'in_progress',
            createdAt: '2025/1/27',
            scope: 'project',
            projectId: 1,
          },
          {
            id: 12,
            title: 'Prepare Webinar Materials',
            description:
              'Prepare slides and presentation materials for next month\'s webinar "API Security Best Practices".',
            priority: 'low',
            status: 'not_started',
            createdAt: '2025/2/4',
            scope: 'global',
          },
          {
            id: 13,
            title: 'Client Requirements Gathering',
            description:
              'Conduct detailed technical requirements discussion for new project and evaluate implementation feasibility. Create report.',
            priority: 'high',
            status: 'not_started',
            createdAt: '2025/2/5',
            scope: 'global',
          },
          {
            id: 14,
            title: 'Performance Monitoring Dashboard',
            description:
              'Build dashboard to monitor CPU usage, memory consumption, and response time of the application.',
            priority: 'low',
            status: 'in_progress',
            createdAt: '2025/1/26',
            scope: 'project',
            projectId: 1,
          },
        ],

        // Actions
        addTask: (task) =>
          set((state) => ({
            tasks: [...state.tasks, task],
          })),

        updateTask: (taskId, updates) =>
          set((state) => ({
            tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
          })),

        deleteTask: (taskId) =>
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== taskId),
          })),

        getSortedTasks: () => {
          const tasks = get().tasks
          return tasks.sort((a, b) => {
            if (a.scope === 'project' && b.scope === 'global') return -1
            if (a.scope === 'global' && b.scope === 'project') return 1
            return 0
          })
        },
      }),
      {
        name: 'task-storage',
      }
    )
  )
)
