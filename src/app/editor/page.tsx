"use client"

import { useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { fabric } from "fabric"
import { Button } from "@/components/ui/button"
import { Square, Circle as CircleIcon, Type, Download } from "lucide-react"

const FabricCanvas = dynamic(() => import("@/components/canvas/FabricCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-ful flex items-center justify-center">Loading Editor...</div>,
})

export default function EditorPage() {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)

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

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 item-center border-b px-4 gap-2 bg-white z-10">
        <h1 className="font-bold mr-4">問題作成エディタ</h1>

        <Button variant="outline" size="icon" onClick={addRect} title="四角形">
          <Square className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={addCircle} title="円">
          <CircleIcon className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={addText} title="テキスト">
          <Type className="h-4 w-4" />
        </Button>

        <div className="flex-1" />

        <Button>
          <Download className="mr-2 h-4 w-4" />
          保存
        </Button>
      </header>

      <main className="flex-1 relative bg-slate-100">
        <FabricCanvas onLoaded={onCanvasLoaded} />
      </main>
    </div>
  )
}
