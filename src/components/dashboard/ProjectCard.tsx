"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { FileText, MoreVertical, Trash2 } from "lucide-react"
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
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col group">
        <Link href={`/editor/${project.id}`} className="flex-1">
          <div className="aspect-video w-full bg-slate-200 relative flex items-center justify-center">
            <FileText className="h-12 w-12 text-slate-400" />
          </div>
          <CardHeader className="p-4">
            <CardTitle className="text-base line-clamp-1">{project.title}</CardTitle>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </CardHeader>
        </Link>
        <CardFooter className="p-4 pt-0 mt-auto flex justify-between items-center">
          <Link href={`/editor/${project.id}`} className="flex-1">
            <Button variant="ghost" size="sm" className="w-full text-slate-500">
              編集を開く
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                削除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
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

