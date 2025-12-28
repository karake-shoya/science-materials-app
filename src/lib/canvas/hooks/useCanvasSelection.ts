import { useCallback } from "react"
import { fabric } from "fabric"
import { toast } from "sonner"

export const useCanvasSelection = (canvas: fabric.Canvas | null) => {
  const deleteSelected = useCallback(() => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (!activeObject) return

    // 複数選択の場合
    if (activeObject.type === 'activeSelection') {
      const activeSelection = activeObject as fabric.ActiveSelection
      activeSelection.forEachObject((obj) => {
        canvas.remove(obj)
      })
    } else {
      // 単一選択の場合
      canvas.remove(activeObject)
    }
    
    canvas.discardActiveObject()
    canvas.renderAll()
    toast.success("削除しました")
  }, [canvas])

  return {
    deleteSelected
  }
}
