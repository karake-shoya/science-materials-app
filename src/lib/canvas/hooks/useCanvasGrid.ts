import { useEffect, useRef } from "react"
import { fabric } from "fabric"
import { GRID_SIZE } from "../constants"

/**
 * キャンバスのグリッドスナップ機能を管理するフック
 * オブジェクトの移動、回転、拡大縮小時にグリッドに合わせてスナップさせます
 * 
 * @param canvas - Fabric.jsのCanvasインスタンス
 * @param isGridEnabled - グリッドスナップが有効かどうか
 */
export const useCanvasGrid = (canvas: fabric.Canvas | null, isGridEnabled: boolean) => {
  const isGridEnabledRef = useRef(isGridEnabled)
  
  useEffect(() => {
    isGridEnabledRef.current = isGridEnabled
  }, [isGridEnabled])

  useEffect(() => {
    if (!canvas) return

    const handleObjectMoving = (options: fabric.IEvent) => {
      if (!isGridEnabledRef.current) return

      const target = options.target!
      target.set({
        left: Math.round(target.left! / GRID_SIZE) * GRID_SIZE,
        top: Math.round(target.top! / GRID_SIZE) * GRID_SIZE
      })
    }

    const handleObjectRotating = (options: fabric.IEvent) => {
      if (!isGridEnabledRef.current) return
      const target = options.target!
      const angle = target.angle!
      target.set('angle', Math.round(angle / 15) * 15)
    }

    const handleObjectScaling = (options: fabric.IEvent) => {
      if (!isGridEnabledRef.current) return
      const target = options.target!
      const baseWidth = target.width || 1
      const baseHeight = target.height || 1
      
      // 現在のサイズを計算
      const currentWidth = baseWidth * (target.scaleX || 1)
      const currentHeight = baseHeight * (target.scaleY || 1)
      
      // グリッドサイズにスナップ
      const snappedWidth = Math.round(currentWidth / GRID_SIZE) * GRID_SIZE
      const snappedHeight = Math.round(currentHeight / GRID_SIZE) * GRID_SIZE
      
      // 最小サイズを確保（グリッドサイズ以上）
      const finalWidth = Math.max(snappedWidth, GRID_SIZE)
      const finalHeight = Math.max(snappedHeight, GRID_SIZE)
      
      // スケールを再計算
      target.set({
        scaleX: finalWidth / baseWidth,
        scaleY: finalHeight / baseHeight,
      })
    }

    canvas.on("object:moving", handleObjectMoving)
    canvas.on('object:rotating', handleObjectRotating)
    canvas.on('object:scaling', handleObjectScaling)

    return () => {
      canvas.off("object:moving", handleObjectMoving)
      canvas.off('object:rotating', handleObjectRotating)
      canvas.off('object:scaling', handleObjectScaling)
    }
  }, [canvas])
}
