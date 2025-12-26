"use client"

import { DragEvent, useEffect, useRef, useCallback } from "react"
import { fabric } from "fabric"
import * as Factory from "@/lib/canvas/symbol-factory"

export interface PlaceSymbolOptions {
  symbolId: string
  x: number
  y: number
  width?: number
  height?: number
}

interface FabricCanvasProps {
  onLoaded: (canvas: fabric.Canvas) => void
  onDrop?: (e: DragEvent<HTMLDivElement>, canvas: fabric.Canvas) => void
  showGrid?: boolean
  gridSize?: number
  selectedSymbol: string | null
  onPlaceSymbol?: (options: PlaceSymbolOptions) => void
  onClearSelection?: () => void
}

export default function FabricCanvas({ 
  onLoaded, 
  onDrop, 
  showGrid = true, 
  gridSize = 20,
  selectedSymbol,
  onPlaceSymbol,
  onClearSelection,
}: FabricCanvasProps) {
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const onLoadedRef = useRef(onLoaded)
  onLoadedRef.current = onLoaded

  // プレビュー用
  const previewRef = useRef<fabric.Object | null>(null)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const selectedSymbolRef = useRef(selectedSymbol)
  selectedSymbolRef.current = selectedSymbol

  // 実際の記号でプレビューを作成
  const createPreviewShape = useCallback((symbolId: string, x: number, y: number, scale = 1) => {
    const options = { left: x, top: y }
    let symbol: fabric.Object | null = null

    switch (symbolId) {
      case "lamp":
        symbol = Factory.createLamp(options)
        break
      case "resistor":
        symbol = Factory.createResistor(options)
        break
      case "source":
        symbol = Factory.createPowerSource(options)
        break
      case "meter_a":
        symbol = Factory.createMeter("A", options)
        break
      case "meter_v":
        symbol = Factory.createMeter("V", options)
        break
      case "switch":
        symbol = Factory.createSwitch(options)
        break
    }

    if (symbol) {
      symbol.set({
        opacity: 0.5,
        selectable: false,
        evented: false,
      })
      if (scale !== 1) {
        symbol.scale(scale)
      }
    }

    return symbol
  }, [])

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

  // プレビュー表示・配置のイベントハンドラ
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    const removePreview = () => {
      if (previewRef.current) {
        canvas.remove(previewRef.current)
        previewRef.current = null
        canvas.renderAll()
      }
    }

    const handleMouseMove = (options: fabric.IEvent<MouseEvent>) => {
      if (!selectedSymbolRef.current) {
        removePreview()
        return
      }

      const pointer = canvas.getPointer(options.e)

      // ドラッグ中はスケールを計算
      if (isDraggingRef.current && dragStartRef.current) {
        const dx = pointer.x - dragStartRef.current.x
        const dy = pointer.y - dragStartRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const scale = Math.max(0.5, distance / 40)
        
        removePreview()
        const preview = createPreviewShape(
          selectedSymbolRef.current,
          dragStartRef.current.x,
          dragStartRef.current.y,
          scale
        )
        if (preview) {
          previewRef.current = preview
          canvas.add(preview)
        }
        canvas.renderAll()
        return
      }

      // 通常のプレビュー（マウス追従）
      removePreview()
      const preview = createPreviewShape(selectedSymbolRef.current, pointer.x, pointer.y)
      if (preview) {
        previewRef.current = preview
        canvas.add(preview)
      }
      canvas.defaultCursor = 'crosshair'
      canvas.renderAll()
    }

    const handleMouseDown = (options: fabric.IEvent<MouseEvent>) => {
      if (!selectedSymbolRef.current) return
      
      // オブジェクト上でのクリックは無視
      if (options.target) return

      const pointer = canvas.getPointer(options.e)
      isDraggingRef.current = true
      dragStartRef.current = { x: pointer.x, y: pointer.y }
      canvas.selection = false
    }

    const handleMouseUp = (options: fabric.IEvent<MouseEvent>) => {
      if (!selectedSymbolRef.current || !dragStartRef.current) {
        isDraggingRef.current = false
        dragStartRef.current = null
        return
      }

      const pointer = canvas.getPointer(options.e)
      const dx = pointer.x - dragStartRef.current.x
      const dy = pointer.y - dragStartRef.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      removePreview()

      // ドラッグ距離が小さい場合はクリック配置（デフォルトサイズ）
      // 大きい場合はドラッグ配置（スケール指定）
      if (onPlaceSymbol) {
        if (distance < 10) {
          // クリック配置
          onPlaceSymbol({
            symbolId: selectedSymbolRef.current,
            x: dragStartRef.current.x,
            y: dragStartRef.current.y,
          })
        } else {
          // ドラッグ配置（スケール指定）
          const scale = Math.max(0.5, distance / 40)
          onPlaceSymbol({
            symbolId: selectedSymbolRef.current,
            x: dragStartRef.current.x,
            y: dragStartRef.current.y,
            width: scale, // スケール値として使用
            height: scale,
          })
        }
      }

      // 配置後に選択解除
      if (onClearSelection) {
        onClearSelection()
      }

      isDraggingRef.current = false
      dragStartRef.current = null
      canvas.selection = true
      canvas.defaultCursor = 'default'
    }

    canvas.on('mouse:move', handleMouseMove)
    canvas.on('mouse:down', handleMouseDown)
    canvas.on('mouse:up', handleMouseUp)

    return () => {
      canvas.off('mouse:move', handleMouseMove)
      canvas.off('mouse:down', handleMouseDown)
      canvas.off('mouse:up', handleMouseUp)
      removePreview()
    }
  }, [createPreviewShape, onPlaceSymbol, onClearSelection])

  // selectedSymbol が null になったらプレビューを消す
  useEffect(() => {
    if (!selectedSymbol && fabricRef.current) {
      if (previewRef.current) {
        fabricRef.current.remove(previewRef.current)
        previewRef.current = null
        fabricRef.current.defaultCursor = 'default'
        fabricRef.current.renderAll()
      }
    }
  }, [selectedSymbol])

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