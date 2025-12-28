"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, File, Zap } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CreateProjectButtonProps {
  variant?: "default" | "outline" | "card"
  className?: string
}

export function CreateProjectButton({ variant = "default", className }: CreateProjectButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSelectTemplate = (templateId?: string) => {
    setIsOpen(false)
    if (templateId) {
      router.push(`/editor?template=${templateId}`)
    } else {
      router.push("/editor")
    }
  }

  if (variant === "card") {
    return (
      <>
        <Card 
          onClick={() => setIsOpen(true)}
          className={cn(
            "flex h-full min-h-[200px] flex-col items-center justify-center border-dashed border-2 hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer",
            className
          )}
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <span className="font-medium text-sm">新しい図版を作成</span>
        </Card>
        <TemplateSelectionDialog open={isOpen} onOpenChange={setIsOpen} onSelect={handleSelectTemplate} />
      </>
    )
  }

  return (
    <>
      <Button 
        variant={variant === "outline" ? "outline" : "default"} 
        className={cn("gap-2", className)}
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-4 w-4" />
        新規作成
      </Button>
      <TemplateSelectionDialog open={isOpen} onOpenChange={setIsOpen} onSelect={handleSelectTemplate} />
    </>
  )
}

function TemplateSelectionDialog({ 
  open, 
  onOpenChange, 
  onSelect 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (templateId?: string) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>新しいプロジェクトを作成</DialogTitle>
          <DialogDescription>
            テンプレートを選択して開始するか、空白のキャンバスから始めます。
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <TemplateOption
            title="空白のプロジェクト"
            description="何もない状態から開始します"
            icon={<File className="h-6 w-6" />}
            onClick={() => onSelect()}
          />
          <TemplateOption
            title="直列回路"
            description="基本的な直列回路のテンプレート"
            icon={<Zap className="h-6 w-6 text-yellow-500" />}
            onClick={() => onSelect('series')}
          />
          <TemplateOption
            title="並列回路"
            description="基本的な並列回路のテンプレート"
            icon={<Zap className="h-6 w-6 text-blue-500" />}
            onClick={() => onSelect('parallel')}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TemplateOption({ 
  title, 
  description, 
  icon, 
  onClick 
}: { 
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center text-center p-4 rounded-lg border-2 border-transparent hover:border-primary/20 hover:bg-muted/50 cursor-pointer transition-all bg-card border-border/50"
    >
      <div className="w-12 h-12 rounded-full bg-background border flex items-center justify-center mb-3 shadow-sm">
        {icon}
      </div>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
