"use client"

import { useDroppable } from "@dnd-kit/core"
import { TaskCard } from "./task-card"
import type { Task } from "@/types/task"
import { Cpu } from "lucide-react"

interface TaskBoardProps {
  tasks: Task[]
  onDuplicate?: (task: Task) => void
  onDelete?: (taskId: string) => void
  selectedTaskId?: string | null
  onSelectTask?: (taskId: string | null) => void
}

export function TaskBoard({ tasks, onDuplicate, onDelete, selectedTaskId, onSelectTask }: TaskBoardProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "unscheduled",
  })

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-cyan-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-cyan-300 font-mono">UNSCHEDULED</h2>
        </div>
        <div className="text-xs text-cyan-400/70 font-mono">{tasks.length} TASKS PENDING</div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 p-4 space-y-3 transition-all duration-300 ${
          isOver ? "bg-cyan-500/10 border-l-2 border-cyan-400" : ""
        }`}
      >
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-cyan-400/50 font-mono text-sm">
            NO PENDING TASKS
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              isSelected={selectedTaskId === task.id}
              onSelect={onSelectTask}
            />
          ))
        )}
      </div>
    </div>
  )
}
