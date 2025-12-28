import { useCallback, useRef, useState, useEffect } from "react"
import { fabric } from "fabric"
import { toast } from "sonner"

const MAX_HISTORY = 50
const DEBOUNCE_DELAY = 200

export const useCanvasHistory = (canvas: fabric.Canvas | null) => {
  const historyRef = useRef<string[]>([])
  const historyIndexRef = useRef(-1)
  const isUndoRedoRef = useRef(false)
  const saveHistoryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Need a ref to access current canvas in callbacks
  const canvasRef = useRef<fabric.Canvas | null>(null)
  
  useEffect(() => {
    canvasRef.current = canvas
  }, [canvas])

  const saveHistory = useCallback(() => {
    if (saveHistoryTimeoutRef.current) {
      clearTimeout(saveHistoryTimeoutRef.current)
    }
    
    saveHistoryTimeoutRef.current = setTimeout(() => {
      const currentCanvas = canvasRef.current
      if (!currentCanvas || isUndoRedoRef.current) return
      
      const json = JSON.stringify(currentCanvas.toJSON())
      
      if (historyRef.current[historyIndexRef.current] === json) {
        return
      }
      
      if (historyIndexRef.current < historyRef.current.length - 1) {
        historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)
      }
      
      historyRef.current.push(json)
      
      if (historyRef.current.length > MAX_HISTORY) {
        historyRef.current.shift()
      } else {
        historyIndexRef.current++
      }
    }, DEBOUNCE_DELAY)
  }, [])

  const undo = useCallback(() => {
    // 未保存の履歴がある場合は強制保存
    if (saveHistoryTimeoutRef.current) {
        clearTimeout(saveHistoryTimeoutRef.current)
        saveHistoryTimeoutRef.current = null
        
        const currentCanvas = canvasRef.current
        if (currentCanvas && !isUndoRedoRef.current) {
            const json = JSON.stringify(currentCanvas.toJSON())
            if (historyRef.current[historyIndexRef.current] !== json) {
                if (historyIndexRef.current < historyRef.current.length - 1) {
                    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)
                }
                historyRef.current.push(json)
                if (historyRef.current.length > MAX_HISTORY) {
                    historyRef.current.shift()
                } else {
                    historyIndexRef.current++
                }
            }
        }
    }

    const currentCanvas = canvasRef.current
    if (!currentCanvas || historyIndexRef.current <= 0) return
    
    isUndoRedoRef.current = true
    historyIndexRef.current--
    
    const json = historyRef.current[historyIndexRef.current]
    currentCanvas.loadFromJSON(JSON.parse(json), () => {
      currentCanvas.renderAll()
      isUndoRedoRef.current = false
      toast.success("元に戻しました")
    })
  }, [])

  const redo = useCallback(() => {
    // 未保存の履歴がある場合は強制保存
    if (saveHistoryTimeoutRef.current) {
        clearTimeout(saveHistoryTimeoutRef.current)
        saveHistoryTimeoutRef.current = null
        
        const currentCanvas = canvasRef.current
        if (currentCanvas && !isUndoRedoRef.current) {
            const json = JSON.stringify(currentCanvas.toJSON())
            if (historyRef.current[historyIndexRef.current] !== json) {
                if (historyIndexRef.current < historyRef.current.length - 1) {
                    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)
                }
                historyRef.current.push(json)
                if (historyRef.current.length > MAX_HISTORY) {
                    historyRef.current.shift()
                } else {
                    historyIndexRef.current++
                }
            }
        }
    }

    const currentCanvas = canvasRef.current
    if (!currentCanvas || historyIndexRef.current >= historyRef.current.length - 1) return
    
    isUndoRedoRef.current = true
    historyIndexRef.current++
    
    const json = historyRef.current[historyIndexRef.current]
    currentCanvas.loadFromJSON(JSON.parse(json), () => {
      currentCanvas.renderAll()
      isUndoRedoRef.current = false
      toast.success("やり直しました")
    })
  }, [])

  // Initialize history
  const initHistory = useCallback((initialCanvas: fabric.Canvas) => {
      const initialState = JSON.stringify(initialCanvas.toJSON())
      historyRef.current = [initialState]
      historyIndexRef.current = 0
  }, [])

  return {
    saveHistory,
    undo,
    redo,
    initHistory,
    historyIndexRef
  }
}
