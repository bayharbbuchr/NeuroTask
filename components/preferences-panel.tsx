"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Volume2, VolumeX } from "lucide-react"
import { usePreferences } from "@/hooks/use-preferences"

interface PreferencesPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PreferencesPanel({ open, onOpenChange }: PreferencesPanelProps) {
  const { preferences, updatePreferences } = usePreferences()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900/95 backdrop-blur-sm border border-cyan-500/30 text-cyan-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-cyan-300 font-mono">
            <Settings className="w-5 h-5 text-cyan-400" />
            NEURAL PREFERENCES
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Buffer Time */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-cyan-300 font-mono text-sm">BUFFER TIME</Label>
              <Switch
                checked={preferences.bufferTime.enabled}
                onCheckedChange={(enabled) =>
                  updatePreferences({
                    bufferTime: { ...preferences.bufferTime, enabled },
                  })
                }
              />
            </div>
            {preferences.bufferTime.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-cyan-400/70">BEFORE (min)</Label>
                  <Input
                    type="number"
                    value={preferences.bufferTime.before}
                    onChange={(e) =>
                      updatePreferences({
                        bufferTime: { ...preferences.bufferTime, before: Number.parseInt(e.target.value) || 0 },
                      })
                    }
                    className="bg-black/50 border-cyan-500/30 text-cyan-100"
                  />
                </div>
                <div>
                  <Label className="text-xs text-cyan-400/70">AFTER (min)</Label>
                  <Input
                    type="number"
                    value={preferences.bufferTime.after}
                    onChange={(e) =>
                      updatePreferences({
                        bufferTime: { ...preferences.bufferTime, after: Number.parseInt(e.target.value) || 0 },
                      })
                    }
                    className="bg-black/50 border-cyan-500/30 text-cyan-100"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Default Task Duration */}
          <div className="space-y-2">
            <Label className="text-cyan-300 font-mono text-sm">DEFAULT TASK DURATION</Label>
            <Select
              value={preferences.defaultDuration.toString()}
              onValueChange={(value) => updatePreferences({ defaultDuration: Number.parseInt(value) })}
            >
              <SelectTrigger className="bg-black/50 border-cyan-500/30 text-cyan-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-cyan-500/30">
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visual Modes */}
          <div className="space-y-3">
            <Label className="text-cyan-300 font-mono text-sm">VISUAL MODES</Label>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-cyan-400/70">GLITCH PULSE</Label>
              <Switch
                checked={preferences.visualModes.glitchPulse}
                onCheckedChange={(glitchPulse) =>
                  updatePreferences({
                    visualModes: { ...preferences.visualModes, glitchPulse },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-cyan-400/70">SYNTHWAVE MODE</Label>
              <Switch
                checked={preferences.visualModes.synthwave}
                onCheckedChange={(synthwave) =>
                  updatePreferences({
                    visualModes: { ...preferences.visualModes, synthwave },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-cyan-400/70 flex items-center gap-2">
                SOUND FX
                {preferences.visualModes.soundFx ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              </Label>
              <Switch
                checked={preferences.visualModes.soundFx}
                onCheckedChange={(soundFx) =>
                  updatePreferences({
                    visualModes: { ...preferences.visualModes, soundFx },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-semibold"
          >
            SAVE PREFERENCES
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
