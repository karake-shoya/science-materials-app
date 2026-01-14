"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { fabric } from "fabric"
import { Button } from "@/components/ui/button"
import { 
  Lightbulb, 
  Battery, 
  Cpu, 
  ToggleRight, 
  Trash2,
  MousePointer2,
  Plus
} from "lucide-react"
import * as Factory from "@/lib/canvas/symbol-factory"
import { GRID_SIZE } from "@/lib/canvas/constants"

const FabricCanvas = dynamic(() => import("@/components/canvas/FabricCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed">キャンバスを準備中...</div>,
})

const WireOverlay = dynamic(() => import("@/components/canvas/WireOverlay"), {
  ssr: false,
})

import type { WireOverlayHandle } from "@/components/canvas/WireOverlay"
import type { PlaceSymbolOptions } from "@/components/canvas/FabricCanvas"

export function CircuitDemo() {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)
  const wireOverlayRef = useRef<WireOverlayHandle | null>(null)

  const onCanvasLoaded = useCallback((canvasInstance: fabric.Canvas) => {
    setCanvas(canvasInstance)
  }, [])

  // デフォルトの回路を生成
  useEffect(() => {
    if (!canvas) return

    // 既にオブジェクトがある場合は実行しない
    if (canvas.getObjects().length > 0) return

    // シンボルを作成
    const source = Factory.createPowerSource({ left: 300, top: 100 })
    // @ts-ignore
    source.id = "demo-source"

    const sw = Factory.createSwitch({ left: 500, top: 100 })
    // @ts-ignore
    sw.id = "demo-switch"

    const r1 = Factory.createResistor({ left: 500, top: 320 })
    // @ts-ignore
    r1.id = "demo-r1"

    const r2 = Factory.createResistor({ left: 300, top: 320 })
    // @ts-ignore
    r2.id = "demo-r2"

    // キャンバスに追加
    canvas.add(source, sw, r1, r2)
    canvas.renderAll()

    // 導線を接続 (ReactFlowのノード登録を待つため少し遅延させる)
    const timer = setTimeout(() => {
      if (wireOverlayRef.current) {
        const demoEdges = [
          {
            id: "demo-w1",
            source: "demo-source",
            sourceHandle: "right-src",
            target: "demo-switch",
            targetHandle: "left-tgt",
            type: "smoothstep",
            style: { stroke: "#000", strokeWidth: 2 },
          },
          {
            id: "demo-w2",
            source: "demo-switch",
            sourceHandle: "right-src",
            target: "demo-r1",
            targetHandle: "right-tgt",
            type: "smoothstep",
            style: { stroke: "#000", strokeWidth: 2 },
          },
          {
            id: "demo-w3",
            source: "demo-r1",
            sourceHandle: "left-src",
            target: "demo-r2",
            targetHandle: "right-tgt",
            type: "smoothstep",
            style: { stroke: "#000", strokeWidth: 2 },
          },
          {
            id: "demo-w4",
            source: "demo-r2",
            sourceHandle: "left-src",
            target: "demo-source",
            targetHandle: "left-tgt",
            type: "smoothstep",
            style: { stroke: "#000", strokeWidth: 2 },
          },
        ]
        // @ts-ignore
        wireOverlayRef.current.loadEdges(demoEdges)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [canvas])

  const handlePlaceSymbol = useCallback((options: PlaceSymbolOptions) => {
    if (!canvas) return

    const { symbolId, x, y, width } = options
    const scale = width || 1

    let symbol: fabric.Object | null = null

    switch (symbolId) {
      case "lamp":
        symbol = Factory.createLamp({ left: x, top: y })
        break
      case "resistor":
        symbol = Factory.createResistor({ left: x, top: y })
        break
      case "source":
        symbol = Factory.createPowerSource({ left: x, top: y })
        break
      case "switch":
        symbol = Factory.createSwitch({ left: x, top: y })
        break
    }

    if (symbol) {
      if (scale !== 1) {
        symbol.scale(scale)
      }
      canvas.add(symbol)
      canvas.setActiveObject(symbol)
      canvas.renderAll()
    }
  }, [canvas])

  const handleClearSelection = useCallback(() => {
    setSelectedSymbol(null)
  }, [])

  const clearCanvas = () => {
    if (!canvas) return
    canvas.clear()
    canvas.backgroundColor = "#ffffff"
    if (wireOverlayRef.current) {
        wireOverlayRef.current.loadEdges([])
    }
    // グリッドを再描画するために背景パターンを設定（FabricCanvas.tsxのロジックに合わせるのが理想だが、ここではシンプルに）
    const gridSize = GRID_SIZE
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
    canvas.renderAll()
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5">
          <Button 
            variant={selectedSymbol === null ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSelectedSymbol(null)}
            className="rounded-xl"
          >
            <MousePointer2 className="w-4 h-4 mr-1.5" />
            選択
          </Button>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <Button 
            variant={selectedSymbol === "lamp" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSelectedSymbol("lamp")}
            className="rounded-xl"
          >
            <Lightbulb className="w-4 h-4 mr-1.5" />
            豆電球
          </Button>
          <Button 
            variant={selectedSymbol === "source" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSelectedSymbol("source")}
            className="rounded-xl"
          >
            <Battery className="w-4 h-4 mr-1.5" />
            電源
          </Button>
          <Button 
            variant={selectedSymbol === "resistor" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSelectedSymbol("resistor")}
            className="rounded-xl"
          >
            <Cpu className="w-4 h-4 mr-1.5" />
            抵抗
          </Button>
          <Button 
            variant={selectedSymbol === "switch" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSelectedSymbol("switch")}
            className="rounded-xl"
          >
            <ToggleRight className="w-4 h-4 mr-1.5" />
            スイッチ
          </Button>
        </div>
        
        <Button variant="ghost" size="sm" onClick={clearCanvas} className="text-slate-500 hover:text-red-500 rounded-xl">
          <Trash2 className="w-4 h-4 mr-1.5" />
          すべて消去
        </Button>
      </div>

      <div className="relative aspect-video rounded-4xl overflow-hidden border-2 border-slate-200 shadow-2xl bg-white group mt-2">
        <FabricCanvas 
          onLoaded={onCanvasLoaded} 
          gridSize={GRID_SIZE}
          selectedSymbol={selectedSymbol}
          onPlaceSymbol={handlePlaceSymbol}
          onClearSelection={handleClearSelection}
        />
        <WireOverlay ref={wireOverlayRef} fabricCanvas={canvas} />
        
        {/* Overlay Instruction */}
        {!selectedSymbol && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/80 text-white text-sm rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-md">
            青色の丸からドラッグして配線できます
          </div>
        )}
        {selectedSymbol && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-primary/90 text-white text-sm rounded-full pointer-events-none backdrop-blur-md">
            クリックまたはドラッグして配置
          </div>
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-2">
        ※ これはデモ版です。完全な機能はログイン後にご利用いただけます。
      </p>
    </div>
  )
}
