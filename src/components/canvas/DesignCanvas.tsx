"use client"

import { useEffect, useRef } from "react"

export default function DesignCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    console.log("Fabric initialized")
  }, [])

  return <canvas ref={canvasRef} />
}