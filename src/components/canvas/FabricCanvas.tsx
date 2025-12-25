"use client"

import { DragEvent, useEffect, useRef } from "react"
import { fabric } from "fabric"

interface FabricCanvasProps {
  onLoaded: (canvas: fabric.Canvas) => void
  onDrop?: (e: DragEvent<HTMLDivElement>, canvas: fabric.Canvas) => void
  showGrid?: boolean
  gridSize?: number
}

export default function FabricCanvas({ onLoaded, onDrop, showGrid = true, gridSize = 20 }: FabricCanvasProps) {
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const onLoadedRef = useRef(onLoaded)
  onLoadedRef.current = onLoaded

  useEffect(() => {
    if (!canvasEl.current || !containerRef.current) return

    const container = containerRef.current
    const { clientWidth, clientHeight } = container

    const canvas = new fabric.Canvas(canvasEl.current, {
      backgroundColor: "#ffffff",
      selection: true,
      preserveObjectStacking: true,
      centeredRotation: true,
      centeredScaling: true,
      width: clientWidth || 800,
      height: clientHeight || 600,
    })

    fabricRef.current = canvas
    canvas.renderAll()

    const renderGrid = () => {
      if (!showGrid) {
        canvas.backgroundColor = '#ffffff'
        return
      }

      const canvasGrid = document.createElement('canvas')
      canvasGrid.width = gridSize
      canvasGrid.height = gridSize
      const ctx = canvasGrid.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, gridSize, gridSize)
        ctx.strokeStyle = '#e5e7eb'
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(0, gridSize)
        ctx.lineTo(gridSize, gridSize)
        ctx.lineTo(gridSize, 0)
        ctx.stroke()
      }

      const pattern = new fabric.Pattern({
        source: canvasGrid as unknown as HTMLImageElement,
        repeat: 'repeat',
      })
      canvas.backgroundColor = pattern as unknown as string
    }

    let isInitialized = false

    const resizeCanvas = () => {
      if (!container || !fabricRef.current) return
      const { clientWidth, clientHeight } = container
      if (clientWidth === 0 || clientHeight === 0) return

      canvas.setWidth(clientWidth)
      canvas.setHeight(clientHeight)
      renderGrid()
      canvas.renderAll()

      if (!isInitialized) {
        isInitialized = true
        onLoadedRef.current(canvas)
      }
    }

    // 初期化を少し遅延させる（レイアウト確定を待つ）
    const timeoutId = setTimeout(() => {
      resizeCanvas()
    }, 100)

    // ResizeObserverでコンテナサイズの変更を監視
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
    })
    resizeObserver.observe(container)

    return () => {
      clearTimeout(timeoutId)
      resizeObserver.disconnect()
      canvas.dispose()
      fabricRef.current = null
    }
  }, [showGrid, gridSize])

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
      className="w-full h-full bg-slate-100 overflow-hidden"
      onDragOver={handlerDragOver}
      onDrop={handlerDrop}
    >
      <canvas ref={canvasEl} />
    </div>
  )

}