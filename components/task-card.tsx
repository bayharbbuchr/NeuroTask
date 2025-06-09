"use client"

import type React from "react"

import { useDraggable } from "@dnd-kit/core"
import type { Task, TaskPriority, TaskStatus } from "@/types/task"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, Circle, Copy, Trash2, Edit } from "lucide-react"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"

interface TaskCardProps {
  task: Task
  compact?: boolean
  isDragging?: boolean
  onDuplicate?: (task: Task) => void
  onDelete?: (taskId: string) => void
  isSelected?: boolean
  onSelect?: (taskId: string | null) => void
}

export function TaskCard({
  task,
  compact = false,
  isDragging = false,
  onDuplicate,
  onDelete,
  isSelected = false,
  onSelect,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isDrag,
  } = useDraggable({
    id: task.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return "from-red-500 to-pink-500"
      case "medium":
        return "from-yellow-500 to-orange-500"
      case "low":
        return "from-green-500 to-emerald-500"
    }
  }

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "done":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-400" />
      case "todo":
        return <Circle className="w-4 h-4 text-cyan-400" />
    }
  }

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(task)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id)
    }
  }

  // Use double-click for selection to avoid conflict with dragging
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log(`Double-clicked task: ${task.title}`)

    if (onSelect && !isDrag && !isDragging) {
      onSelect(isSelected ? null : task.id)
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
          onDoubleClick={handleDoubleClick}
          className={`
            group cursor-grab active:cursor-grabbing
            bg-gradient-to-br from-gray-900/80 to-gray-800/80 
            backdrop-blur-sm border transition-all duration-300
            rounded-lg 
            ${isDrag || isDragging ? "shadow-2xl shadow-cyan-500/40 border-cyan-400 scale-105" : ""}
            ${
              isSelected
                ? "border-cyan-400 shadow-lg shadow-cyan-500/30 bg-gradient-to-br from-gray-800/90 to-gray-700/90"
                : "border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/20"
            }
            ${compact ? "p-2" : "p-3"}
          `}
        >
          {/* Priority Indicator */}
          <div
            className={`h-1 w-full bg-gradient-to-r ${getPriorityColor(task.priority)} rounded-full mb-2 ${isSelected ? "shadow-sm" : ""}`}
          />

          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(task.status)}
                <h3 className={`font-semibold text-cyan-100 truncate font-mono ${compact ? "text-xs" : "text-sm"}`}>
                  {task.title}
                </h3>
              </div>

              {!compact && task.description && (
                <p className="text-xs text-cyan-300/70 line-clamp-2 mb-2">{task.description}</p>
              )}

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-xs border-0 bg-gradient-to-r ${getPriorityColor(task.priority)} text-black font-semibold`}
                >
                  {task.priority.toUpperCase()}
                </Badge>

                {task.scheduledTime && (
                  <Badge variant="outline" className="text-xs border-cyan-500/50 text-cyan-300">
                    <Clock className="w-3 h-3 mr-1" />
                    {task.scheduledTime.includes("timeslot-")
                      ? task.scheduledTime.split("-").slice(-1)[0] + ":00"
                      : task.scheduledTime}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse" />
          )}

          {/* Instruction hint for selection */}
          {!isSelected && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-60 transition-opacity">
              <div className="text-xs text-cyan-400/70 font-mono bg-black/50 px-1 py-0.5 rounded text-center">
                2x CLICK
              </div>
            </div>
          )}

          {/* Holographic Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="bg-gray-900/95 backdrop-blur-sm border border-cyan-500/30 text-cyan-100">
        <ContextMenuItem onClick={handleDuplicate} className="hover:bg-cyan-500/20 focus:bg-cyan-500/20 text-cyan-300">
          <Copy className="w-4 h-4 mr-2" />
          Duplicate Task
        </ContextMenuItem>
        <ContextMenuItem className="hover:bg-cyan-500/20 focus:bg-cyan-500/20 text-cyan-300">
          <Edit className="w-4 h-4 mr-2" />
          Edit Task
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDelete} className="hover:bg-red-500/20 focus:bg-red-500/20 text-red-300">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Task
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
