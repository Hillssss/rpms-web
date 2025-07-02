"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface CameraSettingsModalProps {
  open: boolean
  onClose: () => void
  selectedAngle: number | null
  setSelectedAngle: (angle: number | null) => void
  offsetCamera: string
  setOffsetCamera: (val: string) => void
  elevationCamera: string
  setElevationCamera: (val: string) => void
  elevationRadar: string
  setElevationRadar: (val: string) => void
  radarFollowsCamera: boolean
  setRadarFollowsCamera: (val: boolean) => void
}

const CameraSettingsModal = ({
  open,
  onClose,
  selectedAngle,
  setSelectedAngle,
  offsetCamera,
  setOffsetCamera,
  elevationCamera,
  setElevationCamera,
  elevationRadar,
  setElevationRadar,
  radarFollowsCamera,
  setRadarFollowsCamera,
}: CameraSettingsModalProps) => {
  const angleButtons = [0, 1, 2, 3]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
            className="w-full max-w-[90vw] sm:max-w-md max-h-[85vh] overflow-hidden rounded-xl px-4 sm:px-6 py-6"
            >
        <div className="flex flex-col h-full">
          {/* Header - tidak scroll */}
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base font-medium">
              Kalibrasi Kamera
            </DialogTitle>
          </DialogHeader>

          {/* Konten scrollable */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {/* Sudut Radar */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Sudut Radar:
              </Label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {angleButtons.map((angle) => (
                  <Button
                    key={angle}
                    variant={selectedAngle === angle ? "default" : "outline"}
                    className="h-8 text-sm sm:text-sm text-xs"
                    onClick={() => setSelectedAngle(angle)}
                  >
                    {angle}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-8 text-sm sm:text-sm text-xs">
                  Kiri
                </Button>
                <Button variant="outline" className="h-8 text-sm sm:text-sm text-xs">
                  Kanan
                </Button>
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="offset"
                  className="text-sm whitespace-nowrap"
                >
                  Offset Kamera (0 - 360):
                </Label>
                <Input
                  id="offset"
                  type="number"
                  value={offsetCamera}
                  onChange={(e) => setOffsetCamera(e.target.value)}
                  className="w-24 h-8 text-sm ml-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="elevation-camera"
                  className="text-sm whitespace-nowrap"
                >
                  Elevasi Kamera (-90 - 90):
                </Label>
                <Input
                  id="elevation-camera"
                  type="number"
                  value={elevationCamera}
                  onChange={(e) => setElevationCamera(e.target.value)}
                  className="w-24 h-8 text-sm ml-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="elevation-radar"
                  className="text-sm whitespace-nowrap"
                >
                  Elevasi Radar (50 - 100):
                </Label>
                <Input
                  id="elevation-radar"
                  type="number"
                  value={elevationRadar}
                  onChange={(e) => setElevationRadar(e.target.value)}
                  className="w-24 h-8 text-sm ml-2"
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-8 text-sm sm:text-sm text-xs">
                Naik
              </Button>
              <Button variant="outline" className="h-8 text-sm sm:text-sm text-xs">
                Turun
              </Button>
            </div>

            {/* Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="radar-follows"
                checked={radarFollowsCamera}
                onCheckedChange={(checked) =>
                  setRadarFollowsCamera(checked as boolean)
                }
              />
              <Label htmlFor="radar-follows" className="text-sm">
                Radar Mengikuti Kamera
              </Label>
            </div>
          </div>

          {/* Footer - tidak scroll */}
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-8 px-4 text-sm sm:text-sm text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log("Settings saved:", {
                  selectedAngle,
                  offsetCamera,
                  elevationCamera,
                  elevationRadar,
                  radarFollowsCamera,
                })
                onClose()
              }}
              className="h-8 px-4 text-sm sm:text-sm text-xs"
            >
              OK
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CameraSettingsModal
