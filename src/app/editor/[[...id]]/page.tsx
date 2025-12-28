"use client"

import { useState, useCallback, DragEvent, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { fabric } from "fabric"
import { Button } from "@/components/ui/button"
import { Square, Circle as CircleIcon, Type, Save, ChevronDown, Download, FileImage, Printer, Trash2, Home, Copy, Clipboard } from "lucide-react"
import Link from "next/link"
import { AssetSidebar } from "@/components/editor/AssetSidebar"
import { saveCanvas, deleteCanvas, getCanvasById } from "@/app/editor/actions"
import type { PlaceSymbolOptions } from "@/components/canvas/FabricCanvas"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
import { jsPDF } from "jspdf"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import * as Factory from "@/lib/canvas/symbol-factory"

// Custom Hooks
import { useCanvasHistory } from "@/lib/canvas/hooks/useCanvasHistory"
import { useCanvasClipboard } from "@/lib/canvas/hooks/useCanvasClipboard"
import { useCanvasSelection } from "@/lib/canvas/hooks/useCanvasSelection"
import { useCanvasConnection } from "@/lib/canvas/hooks/useCanvasConnection"
import { useCanvasGrid } from "@/lib/canvas/hooks/useCanvasGrid"
import { useCanvasEvents } from "@/lib/canvas/hooks/useCanvasEvents"
import { GRID_SIZE } from "@/lib/canvas/constants"

const FabricCanvas = dynamic(() => import("@/components/canvas/FabricCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-ful flex items-center justify-center">Loading Editor...</div>,
})

const WireOverlay = dynamic(() => import("@/components/canvas/WireOverlay"), {
  ssr: false,
})

import type { WireOverlayHandle } from "@/components/canvas/WireOverlay"

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const idParam = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : null

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [canvasId, setCanvasId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [projectTitle, setProjectTitle] = useState("無題のプロジェクト")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const isLoadedRef = useRef(false)
  const [isGridEnabled, setIsGridEnabled] = useState(true)
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)
  const wireOverlayRef = useRef<WireOverlayHandle | null>(null)
  
  // Custom Hooks
  const { 
    saveHistory, 
    undo, 
    redo, 
    initHistory 
  } = useCanvasHistory(canvas)

  const { 
    copySelected, 
    pasteFromClipboard 
  } = useCanvasClipboard(canvas)

  const { 
    deleteSelected 
  } = useCanvasSelection(canvas, saveHistory)

  const { 
    resetWireDrawing 
  } = useCanvasConnection(canvas, selectedSymbol, saveHistory)

  useCanvasGrid(canvas, isGridEnabled)

  useCanvasEvents(canvas, {
    deleteSelected,
    copySelected,
    pasteFromClipboard,
    undo,
    redo,
    resetWireDrawing
  })

  // Load Project
  useEffect(() => {
    const loadProject = async () => {
      if (!canvas || !idParam || isLoadedRef.current) return

      const { data, error } = await getCanvasById(idParam)

      if (error || !data) {
        toast.error("読み込みエラー", { description: error || "プロジェクトが見つかりませんでした。" })
        return
      }

      setCanvasId(data.id)
      setProjectTitle(data.title)
      console.log("DB data:", data.data)

      const jsonContent = typeof data.data === "string" ? JSON.parse(data.data) : data.data

      canvas.loadFromJSON(jsonContent, () => {
        console.log("Fabric loadFromJSON finished")
        console.log("Objects on canvas:", canvas.getObjects().length)
        canvas.requestRenderAll()
        isLoadedRef.current = true
        toast.success("読み込み完了", { description: `${data.title} を読み込みました。` })
      })
    }
    loadProject()
  }, [canvas, idParam])

  const onCanvasLoaded = useCallback((canvasInstance: fabric.Canvas) => {
    setCanvas(canvasInstance)
    initHistory(canvasInstance)

    // オブジェクトの変更完了時に履歴を保存
    canvasInstance.on("object:modified", () => {
      saveHistory()
    })

    // オブジェクト削除時に履歴を保存
    canvasInstance.on("object:removed", () => {
      saveHistory()
    })
  }, [initHistory, saveHistory])

  // Helper functions for adding shapes
  const addRect = useCallback(() => {
    if (!canvas) return
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      width: 100,
      height: 100,
      originX: 'center',
      originY: 'center',
    })
    // @ts-expect-error - custom id property
    rect.id = `rect-${Date.now()}`
    canvas.add(rect)
    canvas.setActiveObject(rect)
    saveHistory()
  }, [canvas, saveHistory])

  const addCircle = useCallback(() => {
    if (!canvas) return
    const circle = new fabric.Circle({
      left: 200,
      top: 100,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      radius: 50,
      originX: 'center',
      originY: 'center',
    })
    // @ts-expect-error - custom id property
    circle.id = `circle-${Date.now()}`
    canvas.add(circle)
    canvas.setActiveObject(circle)
    saveHistory()
  }, [canvas, saveHistory])

  const addText = useCallback(() => {
    if (!canvas) return
    const text = new fabric.IText("テキスト", {
      left: 300,
      top: 100,
      fontSize: 20,
      fontFamily: "Arial",
      originX: 'center',
      originY: 'center',
    })
    // @ts-expect-error - custom id property
    text.id = `text-${Date.now()}`
    canvas.add(text)
    canvas.setActiveObject(text)
    saveHistory()
  }, [canvas, saveHistory])

  const handleCanvasDrop = useCallback((e: DragEvent<HTMLDivElement>, canvas: fabric.Canvas) => {
    if (!canvas) return

    const symbolId = e.dataTransfer.getData("symbolId")
    const pointer = canvas.getPointer(e.nativeEvent)
    const options = { left: pointer.x, top: pointer.y }

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
      canvas.add(symbol)
      canvas.setActiveObject(symbol)
      canvas.renderAll()
      saveHistory()
    }
  }, [saveHistory])

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
      case "meter_a":
        symbol = Factory.createMeter("A", { left: x, top: y })
        break
      case "meter_v":
        symbol = Factory.createMeter("V", { left: x, top: y })
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
      saveHistory()
    }
  }, [canvas, saveHistory])

  const handleClearSelection = useCallback(() => {
    setSelectedSymbol(null)
  }, [])

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

  const getExportDataUrl = useCallback(() => {
    if (!canvas) return null

    const wireLines: fabric.Line[] = []
    if (wireOverlayRef.current) {
      const edgeData = wireOverlayRef.current.getEdgesForExport()
      edgeData.forEach(edge => {
        const line = new fabric.Line(
          [edge.sourceX, edge.sourceY, edge.targetX, edge.targetY],
          {
            stroke: '#000',
            strokeWidth: 2,
            selectable: false,
            evented: false,
          }
        )
        wireLines.push(line)
        canvas.add(line)
      })
      canvas.renderAll()
    }

    const dataUrl = canvas.toDataURL({
      format: "png",
      multiplier: 3,
    })

    wireLines.forEach(line => canvas.remove(line))
    canvas.renderAll()

    return dataUrl
  }, [canvas])

  const exportToPDF = useCallback((format: "a4" | "b4" = "a4") => {
    if (!canvas) return
    toast.info("PDFを生成中...", { description: "高画質で処理しています。"})

    const dataUrl = getExportDataUrl()
    if (!dataUrl) return

    const orientation = "p"
    const pdf = new jsPDF(orientation, "mm", format)

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    const canvasWidth = canvas.getWidth()
    const canvasHeight = canvas.getHeight()
    const canvasRatio = canvasWidth / canvasHeight

    let imgWidth = pdfWidth
    let imgHeight = pdfWidth / canvasRatio

    if (imgHeight > pdfHeight) {
      imgHeight = pdfHeight
      imgWidth = pdfHeight * canvasRatio
    }

    const x = (pdfWidth - imgWidth) / 2
    const y = (pdfHeight - imgHeight) / 2

    pdf.addImage(dataUrl, "PNG", x, y, imgWidth, imgHeight)

    const fileName = `${projectTitle || "science-material"}.pdf`
    pdf.save(fileName)

    toast.success("PDFを出力しました")
  }, [canvas, projectTitle, getExportDataUrl])

  const exportToImage = useCallback(() => {
    if (!canvas) return

    toast.info("画像を生成中...", { description: "高画質で処理しています。"})

    const dataUrl = getExportDataUrl()
    if (!dataUrl) return

    const link = document.createElement("a")
    link.href = dataUrl
    const fileName = `${projectTitle || `science-material`}.png`
    link.download = fileName

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("画像を出力しました", { description: fileName})
  }, [canvas, projectTitle, getExportDataUrl])

  const handleDelete = async () => {
    if (!canvasId) return
    
    setIsDeleting(true)
    try {
      const result = await deleteCanvas(canvasId)
      if (result.error) {
        toast.error("削除エラー", { description: result.error })
      } else {
        toast.success("削除完了", { description: `${projectTitle} を削除しました。` })
        router.push("/dashboard")
      }
    } catch {
      toast.error("予期せぬエラーが発生しました")
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex h-16 item-center border-b px-4 gap-2 bg-white z-10">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" title="ダッシュボードに戻る">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        
        <h1 className="font-bold mr-4 text-lg">
          {projectTitle}
        </h1>
        
        <div className="flex items-center gap-1 border-r pr-4 mr-2">
          <Button variant="outline" size="icon" onClick={addRect} title="四角形"><Square className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={addCircle} title="円"><CircleIcon className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={addText} title="テキスト"><Type className="h-4 w-4" /></Button>
        </div>

        <div className="flex items-center gap-1 border-r pr-4 mr-2">
          <Button variant="outline" size="icon" onClick={copySelected} title="コピー (Ctrl+C)"><Copy className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={pasteFromClipboard} title="ペースト (Ctrl+V)"><Clipboard className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={deleteSelected} title="削除 (Delete)" className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
        </div>

        <div className="flex-1" />
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                出力
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={exportToImage} className="cursor-pointer">
                <FileImage className="mr-2 h-4 w-4" />
                画像を保存（PNG）
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => exportToPDF("a4")} className="cursor-pointer">
                <Printer className="mr-2 h-4 w-4" />
                PDFを保存（A4）
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToPDF("b4")} className="cursor-pointer">
                <Printer className="mr-2 h-4 w-4" />
                PDFを保存（B4）
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        <Button onClick={handleSaveClick} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "保存中..." : "保存"}
        </Button>
        
        {canvasId && (
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsDeleteDialogOpen(true)}
            title="削除"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <AssetSidebar 
          selectedSymbol={selectedSymbol}
          onSelectSymbol={setSelectedSymbol}
        />
        <main className="flex-1 relative bg-slate-100 overflow-hidden">
          <FabricCanvas 
            onLoaded={onCanvasLoaded} 
            onDrop={handleCanvasDrop}
            gridSize={GRID_SIZE}
            selectedSymbol={selectedSymbol}
            onPlaceSymbol={handlePlaceSymbol}
            onClearSelection={handleClearSelection}
          />
          <WireOverlay ref={wireOverlayRef} fabricCanvas={canvas} />
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>プロジェクトを削除</DialogTitle>
            <DialogDescription>
              「{projectTitle}」を削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>キャンセル</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "削除中..." : "削除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
