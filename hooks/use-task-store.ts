"use client"

import { useState, useEffect } from "react"
import type { Task } from "@/types/task"

const STORAGE_KEY = "neurotask-data"

export function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedData = JSON.parse(stored)
        setTasks(parsedData)
      }
    } catch (error) {
      console.error("Failed to load tasks:", error)
    } finally {
      setLoaded(true)
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
      console.error("Failed to save tasks:", error)
    }
  }, [tasks, loaded])

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const duplicateTask = (task: Task) => {
    const duplicatedTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      title: `${task.title} (Copy)`,
      scheduledTime: null, // Always spawn duplicates as unscheduled
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, duplicatedTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const moveTask = (id: string, scheduledTime: string | null) => {
    console.log(`Moving task ${id} to ${scheduledTime || "unscheduled"}`)

    setTasks((prev) => {
      const updated = prev.map((task) => {
        if (task.id === id) {
          console.log(`Updated task ${task.title} scheduledTime from ${task.scheduledTime} to ${scheduledTime}`)
          return { ...task, scheduledTime }
        }
        return task
      })
      console.log("Updated tasks array:", updated)
      return updated
    })
  }

  return {
    tasks,
    addTask,
    duplicateTask,
    updateTask,
    deleteTask,
    moveTask,
  }
}
