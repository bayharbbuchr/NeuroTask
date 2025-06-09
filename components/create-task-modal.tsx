"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { Task, TaskPriority, TaskStatus } from "@/types/task"
import { Zap } from "lucide-react"

interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTask: (task: Omit<Task, "id" | "createdAt">) => void
}

export function CreateTaskModal({ open, onOpenChange, onCreateTask }: CreateTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<TaskPriority>("medium")
  const [status, setStatus] = useState<TaskStatus>("todo")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onCreateTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      scheduledTime: null,
    })

    // Reset form
    setTitle("")
    setDescription("")
    setPriority("medium")
    setStatus("todo")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900/95 backdrop-blur-sm border border-cyan-500/30 text-cyan-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-cyan-300 font-mono">
            <Zap className="w-5 h-5 text-cyan-400" />
            CREATE NEW TASK
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-cyan-300 font-mono text-sm">
              TASK TITLE
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder:text-cyan-400/50 focus:border-cyan-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-cyan-300 font-mono text-sm">
              DESCRIPTION
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
              className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder:text-cyan-400/50 focus:border-cyan-400 resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-cyan-300 font-mono text-sm">PRIORITY</Label>
              <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
                <SelectTrigger className="bg-black/50 border-cyan-500/30 text-cyan-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-cyan-500/30">
                  <SelectItem value="low" className="text-green-400">
                    Low
                  </SelectItem>
                  <SelectItem value="medium" className="text-yellow-400">
                    Medium
                  </SelectItem>
                  <SelectItem value="high" className="text-red-400">
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-cyan-300 font-mono text-sm">STATUS</Label>
              <Select value={status} onValueChange={(value: TaskStatus) => setStatus(value)}>
                <SelectTrigger className="bg-black/50 border-cyan-500/30 text-cyan-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-cyan-500/30">
                  <SelectItem value="todo" className="text-cyan-400">
                    To Do
                  </SelectItem>
                  <SelectItem value="in-progress" className="text-yellow-400">
                    In Progress
                  </SelectItem>
                  <SelectItem value="done" className="text-green-400">
                    Done
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-semibold"
            >
              CREATE TASK
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
