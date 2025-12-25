"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SCIENCE_ASSETS, ScienceAsset } from "@/data/science-assets"

export function AssetSiderbar() {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, asset: ScienceAsset) => {
    e.dataTransfer.setData("assetId", asset.id)
    e.dataTransfer.effectAllowed = "copy"
  }

  return (
    <div className="w-64 border-r bg-white flex flex-col h-full">
      <div className="p-4 border-b font-semibold">実験器具素材</div>
      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4">
          {SCIENCE_ASSETS.map((asset) => (
            <Card
              key={asset.id}
              className="cursor-grab hover:bg-slate-50 hover:shadow-md transition-all flex flex-col items-center"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, asset)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={asset.viewBox}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10 text-slate-700"
              >
                <path d={asset.svgPath} />
              </svg>
              <span className="text-xs mt-2 text-slate-600">{asset.name}</span>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}