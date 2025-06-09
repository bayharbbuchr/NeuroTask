export type TaskPriority = "low" | "medium" | "high"
export type TaskStatus = "todo" | "in-progress" | "done"

export interface Task {
  id: string
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  scheduledTime: string | null // ISO string format
  createdAt: string // ISO string format
}
