"use client"

import { useDroppable } from "@dnd-kit/core"
import { TaskCard } from "./task-card"
import type { Task } from "@/types/task"
import { format, startOfWeek, addDays } from "date-fns"

interface TimelineProps {
  tasks: Task[]
  view: "day" | "week"
  currentDate: Date
  onDuplicate?: (task: Task) => void
  onDelete?: (taskId: string) => void
  selectedTaskId?: string | null
  onSelectTask?: (taskId: string | null) => void
}

export function Timeline({
  tasks,
  view,
  currentDate,
  onDuplicate,
  onDelete,
  selectedTaskId,
  onSelectTask,
}: TimelineProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const days =
    view === "week" ? Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate), i)) : [currentDate]

  // Simple slot-based filtering instead of complex date matching
  const getTasksForSlot = (slotId: string) => {
    return tasks.filter((task) => task.scheduledTime === slotId)
  }

  return (
    <div className="h-full overflow-auto">
      <div className="min-w-full">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm border-b border-cyan-500/30">
          <div className="grid grid-cols-[80px_1fr] gap-0">
            <div className="p-4 border-r border-cyan-500/30">
              <div className="text-xs text-cyan-400/70 font-mono">TIME</div>
            </div>
            <div className={`grid ${view === "week" ? "grid-cols-7" : "grid-cols-1"} gap-0`}>
              {days.map((day) => (
                <div key={day.toISOString()} className="p-4 border-r border-cyan-500/30 last:border-r-0">
                  <div className="text-sm font-semibold text-cyan-300 font-mono">{format(day, "EEE")}</div>
                  <div className="text-xs text-cyan-400/70 font-mono">{format(day, "MMM d")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="grid grid-cols-[80px_1fr] gap-0">
          {/* Hour Labels */}
          <div className="border-r border-cyan-500/30">
            {hours.map((hour) => (
              <div key={hour} className="h-20 p-2 border-b border-cyan-500/20 flex items-start">
                <div className="text-xs text-cyan-400/70 font-mono">{hour.toString().padStart(2, "0")}:00</div>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className={`grid ${view === "week" ? "grid-cols-7" : "grid-cols-1"} gap-0`}>
            {days.map((day) => (
              <div key={day.toISOString()} className="border-r border-cyan-500/30 last:border-r-0">
                {hours.map((hour) => {
                  const dateStr = format(day, "yyyy-MM-dd")
                  const hourStr = hour.toString().padStart(2, "0")
                  const slotId = `timeslot-${dateStr}-${hourStr}`
                  const slotTasks = getTasksForSlot(slotId)

                  return (
                    <TimeSlot
                      key={slotId}
                      id={slotId}
                      tasks={slotTasks}
                      onDuplicate={onDuplicate}
                      onDelete={onDelete}
                      selectedTaskId={selectedTaskId}
                      onSelectTask={onSelectTask}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface TimeSlotProps {
  id: string
  tasks: Task[]
  onDuplicate?: (task: Task) => void
  onDelete?: (taskId: string) => void
  selectedTaskId?: string | null
  onSelectTask?: (taskId: string | null) => void
}

function TimeSlot({ id, tasks, onDuplicate, onDelete, selectedTaskId, onSelectTask }: TimeSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`h-20 p-1 border-b border-cyan-500/20 transition-all duration-300 relative ${
        isOver ? "bg-cyan-500/20 border-cyan-400" : "hover:bg-cyan-500/5"
      }`}
    >
      <div className="space-y-1 h-full">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            compact
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            isSelected={selectedTaskId === task.id}
            onSelect={onSelectTask}
          />
        ))}
        {isOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-xs text-cyan-400 font-mono bg-black/50 px-2 py-1 rounded">DROP HERE</div>
          </div>
        )}
      </div>
    </div>
  )
}
