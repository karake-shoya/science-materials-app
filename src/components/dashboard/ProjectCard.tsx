"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, MoreHorizontal, Trash2 } from "lucide-react"
import { deleteCanvas } from "@/app/editor/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type ProjectCardProps = {
  project: {
    id: string
    title: string
    updated_at: string
  }
  formattedDate: string
}

export function ProjectCard({ project, formattedDate }: ProjectCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteCanvas(project.id)
      if (result.error) {
        toast.error("削除エラー", { description: result.error })
      } else {
        toast.success("削除完了", { description: `${project.title} を削除しました。` })
        router.refresh()
      }
    } catch {
      toast.error("予期せぬエラーが発生しました")
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <Card className="group relative overflow-hidden hover:shadow-md transition-all duration-200 border-border/60">
        <Link href={`/editor/${project.id}`} className="block">
          <div className="aspect-[4/3] w-full bg-muted/50 flex items-center justify-center">
            <div className="w-14 h-14 rounded-xl bg-background border border-border/60 flex items-center justify-center">
              <FileText className="h-7 w-7 text-muted-foreground/60" />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-sm line-clamp-1 mb-1">{project.title}</h3>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </Link>
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 shadow-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive cursor-pointer focus:text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                削除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>プロジェクトを削除</DialogTitle>
            <DialogDescription>
              「{project.title}」を削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "削除中..." : "削除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
