"use client"

import { useState, useEffect } from "react"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent } from "@dnd-kit/core"
import { TaskBoard } from "@/components/task-board"
import { Timeline } from "@/components/timeline"
import { TaskCard } from "@/components/task-card"
import { CreateTaskModal } from "@/components/create-task-modal"
import { PreferencesPanel } from "@/components/preferences-panel"
import { ViewToggle } from "@/components/view-toggle"
import { useTaskStore } from "@/hooks/use-task-store"
import { usePreferences } from "@/hooks/use-preferences"
import type { Task } from "@/types/task"
import { Plus, Zap, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NeuroTask() {
  const { tasks, moveTask, addTask, duplicateTask, deleteTask } = useTaskStore()
  const { preferences } = usePreferences()
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [view, setView] = useState<"day" | "week">("week")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === ",") {
        event.preventDefault()
        setShowPreferences(true)
      }

      // Delete selected task with Del or Backspace
      if ((event.key === "Delete" || event.key === "Backspace") && selectedTaskId) {
        event.preventDefault()
        deleteTask(selectedTaskId)
        setSelectedTaskId(null)

        // Play delete sound effect if enabled
        if (preferences.visualModes.soundFx) {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2)

          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.2)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedTaskId, deleteTask, preferences.visualModes.soundFx])

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)

    // Play sound effect if enabled
    if (preferences.visualModes.soundFx) {
      // Create a subtle zap sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const overId = over.id as string

    console.log(`Drag end: taskId=${taskId}, overId=${overId}`)

    // Simple slot assignment - just use the overId directly
    if (overId === "unscheduled") {
      moveTask(taskId, null)
    } else {
      // For any other drop zone, use the overId as the scheduled slot
      moveTask(taskId, overId)
    }

    // Play chunk sound effect if enabled
    if (preferences.visualModes.soundFx) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.05)

      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.15)
    }
  }

  // Filter tasks for display
  const unscheduledTasks = tasks.filter((task) => !task.scheduledTime)
  const scheduledTasks = tasks.filter((task) => task.scheduledTime)

  return (
    <div
      className={`min-h-screen bg-black text-cyan-100 overflow-hidden relative ${
        preferences.visualModes.synthwave ? "synthwave-mode" : ""
      }`}
    >
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

      {/* Synthwave Mode Background */}
      {preferences.visualModes.synthwave && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-pink-900/20 to-cyan-900/30" />
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-[linear-gradient(rgba(255,0,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.3)_1px,transparent_1px)] bg-[size:100px_100px] animate-pulse" />
          </div>
        </>
      )}

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Header */}
        <header className="relative z-10 border-b border-cyan-500/30 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Zap
                  className={`w-8 h-8 text-cyan-400 ${preferences.visualModes.glitchPulse ? "animate-pulse" : ""}`}
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-mono tracking-wider">
                  NEUROTASK
                </h1>
              </div>
              <div className="h-6 w-px bg-cyan-500/50" />
              <div className="text-sm text-cyan-300/70 font-mono tracking-wide">BY P.K.F.F. INC</div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowPreferences(true)}
                variant="ghost"
                size="icon"
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                title="Preferences (⌘,)"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <ViewToggle view={view} onViewChange={setView} />
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-semibold border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40"
              >
                <Plus className="w-4 h-4 mr-2" />
                NEW TASK
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-80px)] relative z-10">
          {/* Task Board - Unscheduled Tasks */}
          <div className="w-80 border-r border-cyan-500/30 bg-black/30 backdrop-blur-sm">
            <TaskBoard
              tasks={unscheduledTasks}
              onDuplicate={duplicateTask}
              onDelete={deleteTask}
              selectedTaskId={selectedTaskId}
              onSelectTask={setSelectedTaskId}
            />
          </div>

          {/* Timeline */}
          <div className="flex-1 overflow-auto">
            <Timeline
              tasks={scheduledTasks}
              view={view}
              currentDate={currentDate}
              onDuplicate={duplicateTask}
              onDelete={deleteTask}
              selectedTaskId={selectedTaskId}
              onSelectTask={setSelectedTaskId}
            />
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <div className="transform rotate-3 scale-105">
              <TaskCard task={activeTask} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      <CreateTaskModal open={showCreateModal} onOpenChange={setShowCreateModal} onCreateTask={addTask} />
      <PreferencesPanel open={showPreferences} onOpenChange={setShowPreferences} />

      {/* Ambient Glow Effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Synthwave Purple Haze */}
      {preferences.visualModes.synthwave && (
        <div className="fixed top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      )}
    </div>
  )
}
