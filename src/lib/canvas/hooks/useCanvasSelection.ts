import { useCallback } from "react"
import { fabric } from "fabric"
import { toast } from "sonner"

/**
 * 選択中のオブジェクト操作（主に削除）を管理するフック
 * 
 * @param canvas - Fabric.jsのCanvasインスタンス
 * @param saveHistory - 操作後に履歴を保存するための関数
 * @returns 削除関数
 */
export const useCanvasSelection = (canvas: fabric.Canvas | null, saveHistory: () => void) => {
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
    saveHistory()
    toast.success("削除しました")
  }, [canvas, saveHistory])

  return {
    deleteSelected
  }
}
