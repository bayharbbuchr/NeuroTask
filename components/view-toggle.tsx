"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"

interface ViewToggleProps {
  view: "day" | "week"
  onViewChange: (view: "day" | "week") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-black/50 backdrop-blur-sm rounded-lg border border-cyan-500/30 p-1">
      <Button
        variant={view === "day" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("day")}
        className={`
          font-mono text-xs
          ${
            view === "day"
              ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-black"
              : "text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10"
          }
        `}
      >
        <Clock className="w-4 h-4 mr-1" />
        DAY
      </Button>
      <Button
        variant={view === "week" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("week")}
        className={`
          font-mono text-xs
          ${
            view === "week"
              ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-black"
              : "text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10"
          }
        `}
      >
        <Calendar className="w-4 h-4 mr-1" />
        WEEK
      </Button>
    </div>
  )
}
