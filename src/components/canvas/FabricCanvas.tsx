"use client"

import { DragEvent, useEffect, useRef, useState } from "react"
import { fabric } from "fabric"

interface FabricCanvasProps {
  onLoaded: (canvas: fabric.Canvas) => void
  onDrop?: (e: DragEvent<HTMLDivElement>, canvas: fabric.Canvas) => void
}

export default function FabricCanvas({ onLoaded, onDrop }: FabricCanvasProps) {
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const fabricRef = useRef<fabric.Canvas | null>(null)

  useEffect(() => {
    if (!canvasEl.current || !containerRef.current) return

    const canvas = new fabric.Canvas(canvasEl.current, {
      backgroundColor: "#ffffff",
      selection: true,
      preserveObjectStacking: true,
    })

    fabricRef.current = canvas

    const resizeCanvas = () => {
      if (!containerRef.current || !canvas) return
      const { clientWidth, clientHeight } = containerRef.current
      canvas.setWidth(clientWidth)
      canvas.setHeight(clientHeight)
      canvas.renderAll()
    }

    resizeCanvas()

    window.addEventListener("resize", resizeCanvas)

    onLoaded(canvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.dispose()
      fabricRef.current = null
    }
  }, [onLoaded])

  const handlerDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }

  const handlerDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (fabricRef.current && onDrop) {
      onDrop(e, fabricRef.current)
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-slate-100 p-8 overflow-hidden"
      onDragOver={handlerDragOver}
      onDrop={handlerDrop}
    >
      <div className="shadow-lg mx-auto bg-white">
        <canvas ref={canvasEl} />
      </div>
    </div>
  )

}