"use client"

import { useCallback, useEffect, useMemo, useState, forwardRef, useImperativeHandle } from "react"
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Handle,
  Position,
  ConnectionMode,
  MarkerType,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { fabric } from "fabric"

interface WireOverlayProps {
  fabricCanvas: fabric.Canvas | null
  onWiresChange?: (edges: Edge[]) => void
}

export interface WireOverlayHandle {
  getEdgesForExport: () => { sourceX: number; sourceY: number; targetX: number; targetY: number }[]
  addEdges: (edges: Edge[]) => void
  getEdges: () => Edge[]
  loadEdges: (edges: Edge[]) => void
}

// 接続ポイント付きノードコンポーネント
function ConnectionNode({ data }: { data: { label: string; width: number; height: number; angle: number } }) {
  const { width, height, angle } = data
  const handleSize = 14

  // 共通のハンドルスタイル
  const baseStyle = {
    width: handleSize,
    height: handleSize,
    background: '#3b82f6',
    borderColor: '#1d4ed8',
    borderWidth: 2,
    borderRadius: '50%',
  }

  // ハンドル位置の配列
  const handles = [
    { position: Position.Top, id: 'top', style: { top: -handleSize / 2 } },
    { position: Position.Bottom, id: 'bottom', style: { bottom: -handleSize / 2 } },
    { position: Position.Left, id: 'left', style: { left: -handleSize / 2 } },
    { position: Position.Right, id: 'right', style: { right: -handleSize / 2 } },
  ]

  return (
    <div 
      className="relative pointer-events-none"
      style={{ 
        width, 
        height, 
        marginLeft: -width / 2, 
        marginTop: -height / 2,
        transform: `rotate(${angle}deg)`,
      }}
    >
      {handles.map(({ position, id, style }) => (
        <div key={id}>
          {/* Target（下に配置、接続終了点として機能） */}
          <Handle
            type="target"
            position={position}
            id={`${id}-tgt`}
            className="!opacity-0 !pointer-events-auto"
            style={{ ...baseStyle, ...style, background: '#22c55e', borderColor: '#15803d', zIndex: 1 }}
          />
          {/* Source（上に配置、ドラッグ開始点） */}
          <Handle
            type="source"
            position={position}
            id={`${id}-src`}
            className="!opacity-50 hover:!opacity-100 hover:!scale-110 !transition-all !pointer-events-auto !cursor-crosshair"
            style={{ ...baseStyle, ...style, zIndex: 2 }}
          />
        </div>
      ))}
    </div>
  )
}

const nodeTypes = {
  connectionNode: ConnectionNode,
}

// Fabric.jsオブジェクトからReactFlowノードを生成
function fabricObjectToNode(obj: fabric.Object, index: number): Node | null {
  // 導線やハイライト用のオブジェクトは除外
  if (
    obj.type === "polyline" ||
    obj.type === "line" ||
    (obj.type === "circle" && (obj as fabric.Circle).radius! <= 6)
  ) {
    return null
  }

  // 元のサイズ（回転なし）を使用
  const width = (obj.width || 0) * (obj.scaleX || 1)
  const height = (obj.height || 0) * (obj.scaleY || 1)
  const angle = obj.angle || 0
  
  // getCenterPoint()で正確な中心座標を取得
  const center = obj.getCenterPoint()
  const centerX = center.x
  const centerY = center.y

  // @ts-expect-error - custom id property
  const objId = obj.id || `fabric-obj-${index}`

  return {
    id: objId,
    type: "connectionNode",
    position: { x: centerX, y: centerY },
    data: { 
      label: obj.type || "object", 
      fabricObject: obj,
      width: Math.max(width, 20),  // 最小サイズを確保
      height: Math.max(height, 20),
      angle,
    },
    draggable: false,
    selectable: false,
  }
}

const WireOverlay = forwardRef<WireOverlayHandle, WireOverlayProps>(({ fabricCanvas, onWiresChange }, ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [isConnecting, setIsConnecting] = useState(false)

  // ハンドルの位置を計算するヘルパー
  const getHandlePosition = useCallback((nodeId: string, handleId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return null

    const { x, y } = node.position
    const { width, height } = node.data as { width: number; height: number }
    const halfWidth = width / 2
    const halfHeight = height / 2

    // ハンドルIDから位置を計算
    if (handleId.startsWith('top')) return { x, y: y - halfHeight }
    if (handleId.startsWith('bottom')) return { x, y: y + halfHeight }
    if (handleId.startsWith('left')) return { x: x - halfWidth, y }
    if (handleId.startsWith('right')) return { x: x + halfWidth, y }

    return { x, y }
  }, [nodes])

  // エクスポート用にエッジの座標を取得
  useImperativeHandle(ref, () => ({
    getEdgesForExport: () => {
      return edges.map(edge => {
        const sourcePos = getHandlePosition(edge.source, edge.sourceHandle || '')
        const targetPos = getHandlePosition(edge.target, edge.targetHandle || '')
        
        return {
          sourceX: sourcePos?.x || 0,
          sourceY: sourcePos?.y || 0,
          targetX: targetPos?.x || 0,
          targetY: targetPos?.y || 0,
        }
      })
    },
    addEdges: (newEdges: Edge[]) => {
      setEdges((prev) => [...prev, ...newEdges])
    },
    getEdges: () => edges,
    loadEdges: (newEdges: Edge[]) => {
      setEdges(newEdges)
    }
  }), [edges, getHandlePosition, setEdges])

  // Fabric.jsのオブジェクトをReactFlowノードに同期
  const syncNodes = useCallback(() => {
    if (!fabricCanvas) return

    const fabricObjects = fabricCanvas.getObjects()
    const newNodes: Node[] = []

    fabricObjects.forEach((obj, index) => {
      const node = fabricObjectToNode(obj, index)
      if (node) {
        newNodes.push(node)
      }
    })

    setNodes(newNodes)
  }, [fabricCanvas, setNodes])

  // Fabric.jsのイベントを監視
  useEffect(() => {
    if (!fabricCanvas) return

    // 初期同期
    syncNodes()

    // 移動中の同期用（requestAnimationFrameで遅延）
    let rafId: number | null = null
    const handleObjectMoving = () => {
      // 既存のリクエストがあればキャンセル
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      // 次フレームで同期（Fabric.jsの内部処理完了後）
      rafId = requestAnimationFrame(() => {
        syncNodes()
        rafId = null
      })
    }

    // オブジェクトの追加・削除・変更を監視
    const handleObjectAdded = () => syncNodes()
    const handleObjectRemoved = () => syncNodes()
    const handleObjectModified = () => syncNodes()

    fabricCanvas.on("object:added", handleObjectAdded)
    fabricCanvas.on("object:removed", handleObjectRemoved)
    fabricCanvas.on("object:modified", handleObjectModified)
    fabricCanvas.on("object:moving", handleObjectMoving)
    fabricCanvas.on("object:rotating", handleObjectMoving)
    fabricCanvas.on("object:scaling", handleObjectMoving)

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      fabricCanvas.off("object:added", handleObjectAdded)
      fabricCanvas.off("object:removed", handleObjectRemoved)
      fabricCanvas.off("object:modified", handleObjectModified)
      fabricCanvas.off("object:moving", handleObjectMoving)
      fabricCanvas.off("object:rotating", handleObjectMoving)
      fabricCanvas.off("object:scaling", handleObjectMoving)
    }
  }, [fabricCanvas, syncNodes])

  // エッジが変更されたら親に通知
  useEffect(() => {
    onWiresChange?.(edges)
  }, [edges, onWiresChange])

  // 接続が作成されたとき
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `wire-${Date.now()}`,
        type: "smoothstep",
        style: { stroke: "#000", strokeWidth: 2 },
        markerEnd: undefined,
      } as Edge

      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges]
  )

  // 選択中のエッジID
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)

  // エッジをクリックで選択
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      // Fabric.jsの記号選択を解除
      if (fabricCanvas) {
        fabricCanvas.discardActiveObject()
        fabricCanvas.renderAll()
      }
      
      setSelectedEdgeId(edge.id)
      // 選択されたエッジのスタイルを変更
      setEdges((eds) => eds.map((e) => ({
        ...e,
        style: {
          ...e.style,
          stroke: e.id === edge.id ? '#3b82f6' : '#000',
          strokeWidth: e.id === edge.id ? 3 : 2,
        },
        selected: e.id === edge.id,
      })))
    },
    [setEdges, fabricCanvas]
  )

  // 空白クリックで選択解除＆記号があればクリックを伝播
  const onPaneClick = useCallback((event: React.MouseEvent) => {
    if (selectedEdgeId) {
      // 導線の選択を解除
      setSelectedEdgeId(null)
      setEdges((eds) => eds.map((edge) => ({
        ...edge,
        style: { ...edge.style, stroke: '#000', strokeWidth: 2 },
        selected: false,
      })))

      // クリック位置にFabric.jsのオブジェクトがあるかチェック
      if (fabricCanvas) {
        const target = fabricCanvas.findTarget(event.nativeEvent, false)
        
        if (target) {
          // オブジェクトがあれば選択する
          fabricCanvas.setActiveObject(target)
          fabricCanvas.renderAll()
        }
      }
    }
  }, [selectedEdgeId, setEdges, fabricCanvas])

  // 接続開始
  const onConnectStart = useCallback(() => {
    setIsConnecting(true)
  }, [])

  // 接続終了（成功・キャンセル両方）
  const onConnectEnd = useCallback(() => {
    setIsConnecting(false)
  }, [])

  // キーボードイベント（Delete/Backspace で削除、Escape でキャンセル）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escキーで接続キャンセルまたは選択解除
      if (e.key === "Escape") {
        if (isConnecting) {
          setIsConnecting(false)
        }
        if (selectedEdgeId) {
          setSelectedEdgeId(null)
          setEdges((eds) => eds.map((edge) => ({
            ...edge,
            style: { ...edge.style, stroke: '#000', strokeWidth: 2 },
            selected: false,
          })))
        }
      }

      // Delete/Backspace で選択中のエッジを削除（導線が選択されている場合のみ）
      if ((e.key === "Delete" || e.key === "Backspace") && selectedEdgeId) {
        // イベントの伝播を止めて、EditorPageの記号削除が発火しないようにする
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        
        setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdgeId))
        setSelectedEdgeId(null)
      }
    }
    // captureフェーズでイベントをキャッチして先に処理する
    document.addEventListener("keydown", handleKeyDown, true)
    return () => document.removeEventListener("keydown", handleKeyDown, true)
  }, [isConnecting, selectedEdgeId, setEdges])

  const defaultEdgeOptions = useMemo(
    () => ({
      type: "smoothstep",
      style: { stroke: "#000", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.Arrow,
        width: 0,
        height: 0,
      },
    }),
    []
  )

  // 接続中または導線選択中はクリックイベントを受け取る
  const shouldEnablePointerEvents = isConnecting || selectedEdgeId !== null

  return (
    <div 
      className="absolute inset-0" 
      style={{ zIndex: 10, pointerEvents: shouldEnablePointerEvents ? "auto" : "none" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        fitView={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        nodesDraggable={false}
        nodesConnectable={true}
        elementsSelectable={false}
        selectNodesOnDrag={false}
        proOptions={{ hideAttribution: true }}
        style={{ pointerEvents: shouldEnablePointerEvents ? "auto" : "none" }}
        className={`!bg-transparent [&_.react-flow__handle]:pointer-events-auto [&_.react-flow__edge]:pointer-events-auto [&_.react-flow__connection]:pointer-events-auto [&_.react-flow__renderer]:!bg-transparent [&_.react-flow__pane]:!bg-transparent ${isConnecting ? "cursor-crosshair" : ""}`}
      />
    </div>
  )
})

WireOverlay.displayName = 'WireOverlay'

export default WireOverlay

