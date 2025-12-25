"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, User, Mail, Lock, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { getUser, updateDisplayName, updatePassword, deleteAccount } from "./actions"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function MyPage() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [isUpdatingName, setIsUpdatingName] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser()
      if (userData) {
        setUser(userData)
        setDisplayName(userData.user_metadata?.display_name || "")
      }
    }
    fetchUser()
  }, [])

  const handleUpdateDisplayName = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingName(true)
    
    const formData = new FormData()
    formData.append("displayName", displayName)
    
    const result = await updateDisplayName(formData)
    
    if (result.error) {
      toast.error("更新エラー", { description: result.error })
    } else {
      toast.success("表示名を更新しました")
    }
    setIsUpdatingName(false)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingPassword(true)
    
    const formData = new FormData()
    formData.append("newPassword", newPassword)
    formData.append("confirmPassword", confirmPassword)
    
    const result = await updatePassword(formData)
    
    if (result.error) {
      toast.error("更新エラー", { description: result.error })
    } else {
      toast.success("パスワードを更新しました")
      setNewPassword("")
      setConfirmPassword("")
    }
    setIsUpdatingPassword(false)
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await deleteAccount()
    } catch {
      toast.error("削除エラー", { description: "アカウントの削除に失敗しました" })
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">マイページ</h1>
        </div>

        {/* 表示名設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              表示名
            </CardTitle>
            <CardDescription>他のユーザーに表示される名前を設定できます</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateDisplayName} className="flex gap-4">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="表示名を入力"
                className="flex-1"
              />
              <Button type="submit" disabled={isUpdatingName}>
                {isUpdatingName ? "更新中..." : "更新"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* メールアドレス */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              メールアドレス
            </CardTitle>
            <CardDescription>ログインに使用しているメールアドレス</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{user.email}</p>
          </CardContent>
        </Card>

        {/* パスワード変更 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              パスワード変更
            </CardTitle>
            <CardDescription>新しいパスワードを設定できます（6文字以上）</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">新しいパスワード</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="新しいパスワード"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">パスワード確認</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="パスワードを再入力"
                />
              </div>
              <Button type="submit" disabled={isUpdatingPassword || !newPassword || !confirmPassword}>
                {isUpdatingPassword ? "更新中..." : "パスワードを変更"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* アカウント削除 */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              アカウント削除
            </CardTitle>
            <CardDescription>
              アカウントを削除すると、すべてのプロジェクトが削除されます。この操作は取り消せません。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              アカウントを削除
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>アカウントを削除しますか？</DialogTitle>
            <DialogDescription>
              アカウントを削除すると、すべてのプロジェクトが完全に削除されます。
              この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? "削除中..." : "削除する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

