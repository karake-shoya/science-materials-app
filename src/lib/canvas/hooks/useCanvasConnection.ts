import { useCallback, useEffect, useRef } from "react"
import { fabric } from "fabric"
import { SNAP_DISTANCE } from "../constants"

type ConnectionPoint = {
  x: number
  y: number
  side: 'top' | 'bottom' | 'left' | 'right'
  object: fabric.Object
}

export const useCanvasConnection = (
    canvas: fabric.Canvas | null,
    selectedSymbol: string | null
) => {
  const highlightCircleRef = useRef<fabric.Circle | null>(null)
  const startConnectionRef = useRef<ConnectionPoint | null>(null)
  const previewLineRef = useRef<fabric.Polyline | null>(null)
  
  const selectedSymbolRef = useRef(selectedSymbol)
  useEffect(() => {
      selectedSymbolRef.current = selectedSymbol
  }, [selectedSymbol])

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
  const findNearestConnectionPoint = useCallback((
    x: number,
    y: number,
    canvasInstance: fabric.Canvas,
    excludeObject?: fabric.Object | null
  ): ConnectionPoint | null => {
    let nearest: ConnectionPoint | null = null
    let minDist = SNAP_DISTANCE

    canvasInstance.getObjects().forEach(obj => {
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
  }, [])

  // 自動折れ曲がりの中間点を計算
  const calculateWirePoints = useCallback((start: ConnectionPoint, endX: number, endY: number): {x: number, y: number}[] => {
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
  }, [])

  // ハイライト用の円を作成/更新するヘルパー
  const updateHighlightCircle = useCallback((point: ConnectionPoint | null) => {
    if (!canvas) return
    if (highlightCircleRef.current) {
      canvas.remove(highlightCircleRef.current)
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
      canvas.add(circle)
    }
  }, [canvas])

  // プレビュー線を更新
  const updatePreviewLine = useCallback((points: {x: number, y: number}[] | null) => {
    if (!canvas) return
    if (previewLineRef.current) {
      canvas.remove(previewLineRef.current)
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
      canvas.add(polyline)
    }
  }, [canvas])

  // 導線をリセット
  const resetWireDrawing = useCallback(() => {
    if (!canvas) return
    updatePreviewLine(null)
    updateHighlightCircle(null)
    startConnectionRef.current = null
    canvas.defaultCursor = 'default'
    canvas.selection = true
    canvas.renderAll()
  }, [canvas, updatePreviewLine, updateHighlightCircle])


  // Set up event listeners
  useEffect(() => {
    if (!canvas) return

    const handleMouseMove = (options: fabric.IEvent) => {
      // 記号配置モード中は導線処理をスキップ
      if (selectedSymbolRef.current) {
        updateHighlightCircle(null)
        return
      }

      const pointer = canvas.getPointer(options.e)
      
      // 接続待ち状態の場合（始点が選択済み）
      if (startConnectionRef.current) {
        const nearPoint = findNearestConnectionPoint(pointer.x, pointer.y, canvas, startConnectionRef.current.object)
        
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
        
        canvas.renderAll()
        return
      }

      // 接続ポイントをハイライト
      const nearPoint = findNearestConnectionPoint(pointer.x, pointer.y, canvas)
      updateHighlightCircle(nearPoint)
      
      if (nearPoint) {
        canvas.defaultCursor = 'crosshair'
      } else {
        canvas.defaultCursor = 'default'
      }
      
      canvas.renderAll()
    }

    const handleMouseDown = (options: fabric.IEvent) => {
      // 記号配置モード中は導線処理をスキップ
      if (selectedSymbolRef.current) {
        return
      }

      const pointer = canvas.getPointer(options.e)
      
      // オブジェクト操作中は導線処理をスキップ
      const clickedObject = options.target
      const isClickOnActiveObject = clickedObject && canvas.getActiveObject() === clickedObject
      if (isClickOnActiveObject) {
        return
      }
      
      const nearPoint = findNearestConnectionPoint(pointer.x, pointer.y, canvas, startConnectionRef.current?.object)

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
          
          canvas.add(polyline)
          resetWireDrawing()
        }
        // 接続ポイント外でクリック → 何もしない（プレビュー継続）
        return
      }

      // 接続ポイント上でクリック → 接続開始
      if (nearPoint) {
        canvas.discardActiveObject()
        startConnectionRef.current = nearPoint
        canvas.selection = false
        canvas.renderAll()
      }
    }

    canvas.on('mouse:move', handleMouseMove)
    canvas.on('mouse:down', handleMouseDown)

    return () => {
        canvas.off('mouse:move', handleMouseMove)
        canvas.off('mouse:down', handleMouseDown)
        resetWireDrawing()
    }

  }, [canvas, findNearestConnectionPoint, calculateWirePoints, updateHighlightCircle, updatePreviewLine, resetWireDrawing])

  return {
    resetWireDrawing,
    getConnectionPoints
  }
}
