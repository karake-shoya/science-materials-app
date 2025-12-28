import { useEffect } from "react"
import { fabric } from "fabric"

type KeyHandler = {
  deleteSelected: () => void
  copySelected: () => void
  pasteFromClipboard: () => void
  undo: () => void
  redo: () => void
  resetWireDrawing: () => void
}

/**
 * キャンバスのキーボードイベント（ショートカットキー）を管理するフック
 * 削除、コピー＆ペースト、Undo/Redoなどのキー操作を処理します
 * 
 * @param canvas - Fabric.jsのCanvasインスタンス
 * @param handlers - 各アクションに対応するハンドラー関数群
 */
export const useCanvasEvents = (
  canvas: fabric.Canvas | null,
  handlers: KeyHandler
) => {
  const {
      deleteSelected,
      copySelected,
      pasteFromClipboard,
      undo,
      redo,
      resetWireDrawing
  } = handlers;

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // テキスト入力中は無視
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Esc - Cancel wire
      if (e.key === 'Escape') {
          resetWireDrawing()
      }

      // Delete or Backspace - 削除
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault()
        deleteSelected()
      }

      // Ctrl+C or Cmd+C - コピー
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        e.preventDefault()
        copySelected()
      }

      // Ctrl+V or Cmd+V - ペースト
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        e.preventDefault()
        pasteFromClipboard()
      }

      // Ctrl+D or Cmd+D - 複製（コピー＆即ペースト）
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault()
        copySelected()
        setTimeout(() => pasteFromClipboard(), 50)
      }

      // Ctrl+Z or Cmd+Z - 元に戻す（Undo）
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      // Ctrl+Shift+Z or Cmd+Shift+Z - やり直し（Redo）
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault()
        redo()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [deleteSelected, copySelected, pasteFromClipboard, undo, redo, resetWireDrawing])
}
