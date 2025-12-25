'use client'

import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

// 記号のリストを定義
const CIRCUIT_SYMBOLS = [
  { id: 'lamp', name: '豆電球', icon: '⊗' },
  { id: 'resistor', name: '抵抗', icon: '▭' },
  { id: 'source', name: '直流電源', icon: '‖' },
  { id: 'meter_a', name: '電流計', icon: 'A' },
  { id: 'meter_v', name: '電圧計', icon: 'V' },
  { id: 'switch', name: 'スイッチ', icon: '／' },
]

export function AssetSidebar() {
  const handleDragStart = (e: React.DragEvent, symbolId: string) => {
    e.dataTransfer.setData('symbolId', symbolId)
  }

  return (
    <div className="w-64 border-r bg-white flex flex-col h-full shrink-0">
      <div className="p-4 border-b font-semibold bg-slate-50">回路図記号 (JIS)</div>
      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-3">
          {CIRCUIT_SYMBOLS.map((symbol) => (
            <Card
              key={symbol.id}
              className="p-4 cursor-grab hover:bg-blue-50 hover:border-blue-200 transition-all flex flex-col items-center justify-center border-2"
              draggable
              onDragStart={(e) => handleDragStart(e, symbol.id)}
            >
              <div className="text-2xl mb-2 font-serif">{symbol.icon}</div>
              <span className="text-[10px] font-medium text-slate-500">{symbol.name}</span>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}