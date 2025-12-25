"use client"

import { useState, useCallback, DragEvent } from "react"
import dynamic from "next/dynamic"
import { fabric } from "fabric"
import { Button } from "@/components/ui/button"
import { Square, Circle as CircleIcon, Type, Download, Save } from "lucide-react"
import { AssetSiderbar } from "@/components/editor/AssetSiderbar"
import { SCIENCE_ASSETS } from "@/data/science-assets"

import { saveCanvas } from "./actions"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const FabricCanvas = dynamic(() => import("@/components/canvas/FabricCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-ful flex items-center justify-center">Loading Editor...</div>,
})

export default function EditorPage() {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)

  const [canvasId, setCanvasId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [projectTitle, setProjectTitle] = useState("無題のプロジェクト")
  const [isSaving, setIsSaving] = useState(false)

  const onCanvasLoaded = useCallback((canvasInstance: fabric.Canvas) => {
    setCanvas(canvasInstance)
}, [])

  const addRect = () => {
    if (!canvas) return
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      width: 100,
      height: 100,
    })
    canvas.add(rect)
    canvas.setActiveObject(rect)
  }

  const addCircle = () => {
    if (!canvas) return
    const circle = new fabric.Circle({
      left: 200,
      top: 100,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      radius: 50,
    })
    canvas.add(circle)
    canvas.setActiveObject(circle)
  }

  const addText = () => {
    if (!canvas) return
    const text = new fabric.IText("テキスト", {
      left: 300,
      top: 100,
      fontSize: 20,
      fontFamily: "Arial",
    })
    canvas.add(text)
    canvas.setActiveObject(text)
  }

  const handleCanvasDrop = (e: DragEvent<HTMLDivElement>, canvas: fabric.Canvas) => {
    if (!canvas) return
    const assetId = e.dataTransfer.getData("assetId")
    const asset = SCIENCE_ASSETS.find((a) => a.id === assetId)
    if (!asset) return

    const pointer = canvas.getPointer(e.nativeEvent)

    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="${asset.viewBox}" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="${asset.svgPath}" />
      </svg>
    `
    fabric.loadSVGFromString(svgString, (objects, options) => {
      const obj = fabric.util.groupSVGElements(objects, options)

      obj.set({
        left: pointer.x,
        top: pointer.y,
        originX: "center",
        originY: "center",
        scaleX: 2,
        scaleY: 2,
      })

      canvas.add(obj)
      canvas.setActiveObject(obj)
      canvas.renderAll()
    })
  }

  const handleSaveClick = () => {
    if (!canvas) return

    if (!canvasId) {
      setIsDialogOpen(true)
    } else {
      executeSave(projectTitle)
    }
  }

  const executeSave = async (title: string) => {
    if (!canvas) return
    setIsSaving(true)
    try {
      const canvasData = canvas.toJSON()
      const result = await saveCanvas(canvasId, title, canvasData)
      if (result.error) {
        toast.error("保存エラー", {
          description: "保存できませんでした。ログイン状態を確認してください。",
        })
      } else {
        if (result.id) setCanvasId(result.id)
        setProjectTitle(title)
        setIsDialogOpen(false)

        toast.success("保存完了", {
          description: `${title} を保存しました。`,
        })
      }
    } catch (error) {
      toast.error("予期せぬエラーが発生しました", {
        description: "保存できませんでした。ログイン状態を確認してください。",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex h-16 item-center border-b px-4 gap-2 bg-white z-10">
        <h1 className="font-bold mr-4 text-lg">
          {projectTitle}
        </h1>
        
        <div className="flex items-center gap-1 border-r pr-4 mr-2">
          <Button variant="outline" size="icon" onClick={addRect} title="四角形"><Square className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={addCircle} title="円"><CircleIcon className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={addText} title="テキスト"><Type className="h-4 w-4" /></Button>
        </div>

        <div className="flex-1" />

        <Button onClick={handleSaveClick} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "保存中..." : "保存"}
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <AssetSiderbar />
        <main className="flex-1 relative bg-slate-100 overflow-hidden">
          <FabricCanvas onLoaded={onCanvasLoaded} onDrop={handleCanvasDrop} />
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>プロジェクトを保存</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">タイトル</Label>
            <Input id="title" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="col-span-3" placeholder="例： ２年 電流回路テスト" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>キャンセル</Button>
            <Button onClick={() => executeSave(projectTitle)} disabled={isSaving}>{isSaving ? "保存中..." : "保存"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
