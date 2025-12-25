"use client"

import { useState, useCallback, DragEvent } from "react"
import dynamic from "next/dynamic"
import { fabric } from "fabric"
import { Button } from "@/components/ui/button"
import { Square, Circle as CircleIcon, Type, Save, ChevronDown, Download, FileImage, Printer, Trash2 } from "lucide-react"
import { AssetSidebar } from "@/components/editor/AssetSidebar"
import { SCIENCE_ASSETS } from "@/data/science-assets"

import { saveCanvas, deleteCanvas } from "@/app/editor/actions"
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
import { useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { getCanvasById } from "@/app/editor/actions"
import { jsPDF } from "jspdf"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import * as Factory from "@/lib/canvas/symbol-factory"

const FabricCanvas = dynamic(() => import("@/components/canvas/FabricCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-ful flex items-center justify-center">Loading Editor...</div>,
})

const GRID_SIZE = 20
const SNAP_DISTANCE = 15

type ConnectionPoint = {
  x: number
  y: number
  side: 'top' | 'bottom' | 'left' | 'right'
  object: fabric.Object
}

// 図形の上下左右中心の接続ポイントを取得
const getConnectionPoints = (obj: fabric.Object): ConnectionPoint[] => {
  const bound = obj.getBoundingRect()
  const centerX = bound.left + bound.width / 2
  const centerY = bound.top + bound.height / 2
  
  return [
    { x: centerX, y: bound.top, side: 'top', object: obj },
    { x: centerX, y: bound.top + bound.height, side: 'bottom', object: obj },
    { x: bound.left, y: centerY, side: 'left', object: obj },
    { x: bound.left + bound.width, y: centerY, side: 'right', object: obj },
  ]
}

// 最も近い接続ポイントを検出
const findNearestConnectionPoint = (
  x: number,
  y: number,
  canvas: fabric.Canvas,
  excludeObject?: fabric.Object | null
): ConnectionPoint | null => {
  let nearest: ConnectionPoint | null = null
  let minDist = SNAP_DISTANCE

  canvas.getObjects().forEach(obj => {
    // Polylineと除外オブジェクトは無視
    if (obj.type === 'polyline' || obj.type === 'line' || obj.type === 'circle' && (obj as fabric.Circle).radius === 5) return
    if (excludeObject && obj === excludeObject) return

    const points = getConnectionPoints(obj)
    points.forEach(point => {
      const dist = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2)
      if (dist < minDist) {
        minDist = dist
        nearest = point
      }
    })
  })

  return nearest
}

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
  const highlightCircleRef = useRef<fabric.Circle | null>(null)
  const startConnectionRef = useRef<ConnectionPoint | null>(null)
  const previewLineRef = useRef<fabric.Polyline | null>(null)

  const isGridEnabledRef = useRef(isGridEnabled)
  isGridEnabledRef.current = isGridEnabled

  // 自動折れ曲がりの中間点を計算
  const calculateWirePoints = (start: ConnectionPoint, endX: number, endY: number): {x: number, y: number}[] => {
    const points: {x: number, y: number}[] = [{ x: start.x, y: start.y }]
    
    // 始点のsideによって折れ曲がり方を決定
    if (start.side === 'left' || start.side === 'right') {
      // 水平方向から出る場合: まず水平に進み、終点のY座標で垂直に曲がる
      const midX = (start.x + endX) / 2
      points.push({ x: midX, y: start.y })
      points.push({ x: midX, y: endY })
    } else {
      // 垂直方向から出る場合: まず垂直に進み、終点のX座標で水平に曲がる
      const midY = (start.y + endY) / 2
      points.push({ x: start.x, y: midY })
      points.push({ x: endX, y: midY })
    }
    
    points.push({ x: endX, y: endY })
    return points
  }

  const onCanvasLoaded = useCallback((canvasInstance: fabric.Canvas) => {
    setCanvas(canvasInstance)

    canvasInstance.on("object:moving", (options) => {
      if (!isGridEnabledRef.current) return

      const target = options.target!
      target.set({
        left: Math.round(target.left! / GRID_SIZE) * GRID_SIZE,
        top: Math.round(target.top! / GRID_SIZE) * GRID_SIZE
      })
    })

    canvasInstance.on('object:rotating', (options) => {
      if (!isGridEnabledRef.current) return
      const target = options.target!
      const angle = target.angle!
      target.set('angle', Math.round(angle / 15) * 15)
    })

    // ハイライト用の円を作成/更新するヘルパー
    const updateHighlightCircle = (point: ConnectionPoint | null) => {
      if (highlightCircleRef.current) {
        canvasInstance.remove(highlightCircleRef.current)
        highlightCircleRef.current = null
      }
      
      if (point) {
        const circle = new fabric.Circle({
          left: point.x,
          top: point.y,
          radius: 6,
          fill: '#3b82f6',
          stroke: '#1d4ed8',
          strokeWidth: 2,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
        })
        highlightCircleRef.current = circle
        canvasInstance.add(circle)
      }
    }

    // プレビュー線を更新
    const updatePreviewLine = (points: {x: number, y: number}[] | null) => {
      if (previewLineRef.current) {
        canvasInstance.remove(previewLineRef.current)
        previewLineRef.current = null
      }
      
      if (points && points.length >= 2) {
        const polyline = new fabric.Polyline(points, {
          stroke: '#3b82f6',
          strokeWidth: 2,
          strokeDashArray: [5, 5],
          fill: 'transparent',
          selectable: false,
          evented: false,
        })
        previewLineRef.current = polyline
        canvasInstance.add(polyline)
      }
    }

    // 導線をリセット
    const resetWireDrawing = () => {
      updatePreviewLine(null)
      updateHighlightCircle(null)
      startConnectionRef.current = null
      canvasInstance.defaultCursor = 'default'
      canvasInstance.selection = true
      canvasInstance.renderAll()
    }

    // mouse:move - 接続ポイントのハイライト表示 & 導線のプレビュー
    canvasInstance.on('mouse:move', (options) => {
      const pointer = canvasInstance.getPointer(options.e)
      
      // 接続待ち状態の場合（始点が選択済み）
      if (startConnectionRef.current) {
        const nearPoint = findNearestConnectionPoint(pointer.x, pointer.y, canvasInstance, startConnectionRef.current.object)
        
        let endX = pointer.x
        let endY = pointer.y
        
        if (nearPoint) {
          endX = nearPoint.x
          endY = nearPoint.y
          updateHighlightCircle(nearPoint)
        } else {
          updateHighlightCircle(null)
        }

        // プレビュー線を更新
        const previewPoints = calculateWirePoints(startConnectionRef.current, endX, endY)
        updatePreviewLine(previewPoints)
        
        canvasInstance.renderAll()
        return
      }

      // 接続ポイントをハイライト
      const nearPoint = findNearestConnectionPoint(pointer.x, pointer.y, canvasInstance)
      updateHighlightCircle(nearPoint)
      
      if (nearPoint) {
        canvasInstance.defaultCursor = 'crosshair'
      } else {
        canvasInstance.defaultCursor = 'default'
      }
      
      canvasInstance.renderAll()
    })

    // mouse:down - 接続ポイントからの導線開始/終了
    canvasInstance.on('mouse:down', (options) => {
      const pointer = canvasInstance.getPointer(options.e)
      
      // オブジェクト操作中は導線処理をスキップ
      const clickedObject = options.target
      const isClickOnActiveObject = clickedObject && canvasInstance.getActiveObject() === clickedObject
      if (isClickOnActiveObject) {
        return
      }
      
      const nearPoint = findNearestConnectionPoint(pointer.x, pointer.y, canvasInstance, startConnectionRef.current?.object)

      // 接続待ち状態の場合
      if (startConnectionRef.current) {
        if (nearPoint) {
          // 終点の接続ポイントをクリック → 導線を作成
          const wirePoints = calculateWirePoints(startConnectionRef.current, nearPoint.x, nearPoint.y)
          
          const polyline = new fabric.Polyline(wirePoints, {
            stroke: '#000',
            strokeWidth: 2,
            fill: 'transparent',
            selectable: true,
            evented: true,
            // カスタムプロパティで折れ点の編集を可能にする
            // @ts-expect-error custom property
            isWire: true,
          })
          
          canvasInstance.add(polyline)
          resetWireDrawing()
        }
        // 接続ポイント外でクリック → 何もしない（プレビュー継続）
        return
      }

      // 接続ポイント上でクリック → 接続開始
      if (nearPoint) {
        canvasInstance.discardActiveObject()
        startConnectionRef.current = nearPoint
        canvasInstance.selection = false
        canvasInstance.renderAll()
      }
    })

    // Escキーで導線描画をキャンセル
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && startConnectionRef.current) {
        resetWireDrawing()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
  }, [calculateWirePoints])

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
      originX: 'center',
      originY: 'center',
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
      originX: 'center',
      originY: 'center',
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
      originX: 'center',
      originY: 'center',
    })
    canvas.add(text)
    canvas.setActiveObject(text)
  }

  const handleCanvasDrop = (e: DragEvent<HTMLDivElement>, canvas: fabric.Canvas) => {
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
  }
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
  const exportToPDF = useCallback((format: "a4" | "b4" = "a4") => {
    if (!canvas) return
    toast.info("PDFを生成中...", { description: "高画質で処理しています。"})

    const dataUrl = canvas.toDataURL({
      format: "png",
      multiplier: 3,
    })

    const orientation = "p"
    const pdf = new jsPDF(orientation, "mm", format)

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    // キャンバスのアスペクト比を計算
    const canvasWidth = canvas.getWidth()
    const canvasHeight = canvas.getHeight()
    const canvasRatio = canvasWidth / canvasHeight

    // PDFに収まるサイズを計算（アスペクト比を維持）
    let imgWidth = pdfWidth
    let imgHeight = pdfWidth / canvasRatio

    // 高さがはみ出す場合は高さ基準で再計算
    if (imgHeight > pdfHeight) {
      imgHeight = pdfHeight
      imgWidth = pdfHeight * canvasRatio
    }

    // 中央に配置
    const x = (pdfWidth - imgWidth) / 2
    const y = (pdfHeight - imgHeight) / 2

    pdf.addImage(dataUrl, "PNG", x, y, imgWidth, imgHeight)

    const fileName = `${projectTitle || "science-material"}.pdf`
    pdf.save(fileName)

    toast.success("PDFを出力しました")
  }, [canvas, projectTitle])

  const exportToImage = useCallback(() => {
    if (!canvas) return

    toast.info("画像を生成中...", { description: "高画質で処理しています。"})

    const dataUrl = canvas.toDataURL({
      format: "png",
      multiplier: 3,
    })
    const link = document.createElement("a")
    link.href = dataUrl
    const fileName = `${projectTitle || `science-material`}.png`
    link.download = fileName

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("画像を出力しました", { description: fileName})
  }, [canvas, projectTitle])

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
        <h1 className="font-bold mr-4 text-lg">
          {projectTitle}
        </h1>
        
        <div className="flex items-center gap-1 border-r pr-4 mr-2">
          <Button variant="outline" size="icon" onClick={addRect} title="四角形"><Square className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={addCircle} title="円"><CircleIcon className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={addText} title="テキスト"><Type className="h-4 w-4" /></Button>
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
        <AssetSidebar />
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
