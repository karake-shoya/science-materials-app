"use client"

import { useState, useCallback, DragEvent } from "react"
import dynamic from "next/dynamic"
import { fabric } from "fabric"
import { Button } from "@/components/ui/button"
import { Square, Circle as CircleIcon, Type, Save, ChevronDown, Download, FileImage, Printer } from "lucide-react"
import { AssetSiderbar } from "@/components/editor/AssetSiderbar"
import { SCIENCE_ASSETS } from "@/data/science-assets"

import { saveCanvas } from "@/app/editor/actions"
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
import { useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { getCanvasById } from "@/app/editor/actions"
import { jsPDF } from "jspdf"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const FabricCanvas = dynamic(() => import("@/components/canvas/FabricCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-ful flex items-center justify-center">Loading Editor...</div>,
})

export default function EditorPage() {
  const params = useParams()
  const idParam = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : null

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [canvasId, setCanvasId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [projectTitle, setProjectTitle] = useState("無題のプロジェクト")
  const [isSaving, setIsSaving] = useState(false)
  const isLoadedRef = useRef(false)

  const onCanvasLoaded = useCallback((canvasInstance: fabric.Canvas) => {
    setCanvas(canvasInstance)
  }, [])

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
        </div>
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
