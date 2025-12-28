import { useCallback, useRef, useState, useEffect } from "react"
import { fabric } from "fabric"
import { toast } from "sonner"

/**
 * クリップボード機能（コピー＆ペースト）を管理するフック
 * 
 * @param canvas - Fabric.jsのCanvasインスタンス
 * @returns コピー関数とペースト関数
 */
export const useCanvasClipboard = (canvas: fabric.Canvas | null) => {
  const clipboardRef = useRef<fabric.Object | null>(null)

  const copySelected = useCallback(() => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      activeObject.clone((cloned: fabric.Object) => {
        clipboardRef.current = cloned
        toast.success("コピーしました")
      })
    }
  }, [canvas])

  const pasteFromClipboard = useCallback(() => {
    if (!canvas || !clipboardRef.current) return
    
    clipboardRef.current.clone((cloned: fabric.Object) => {
      canvas.discardActiveObject()
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
        evented: true,
      })
      // @ts-expect-error - custom id property
      cloned.id = `${cloned.type || 'object'}-${Date.now()}`
      
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.renderAll()
      toast.success("ペーストしました")
    })
  }, [canvas])

  return {
    copySelected,
    pasteFromClipboard
  }
}
