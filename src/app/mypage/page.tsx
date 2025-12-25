"use client"

import { useState, useEffect } from "react"
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
import { ArrowLeft, User, Mail, Lock, Trash2, Zap } from "lucide-react"
import { toast } from "sonner"
import { getUser, updateDisplayName, updatePassword, deleteAccount } from "./actions"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function MyPage() {
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>読み込み中...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-2xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">アカウント設定</span>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-2xl px-6 py-8 space-y-6">
        {/* 表示名設定 */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              表示名
            </CardTitle>
            <CardDescription className="ml-10">
              ダッシュボードに表示される名前を設定できます
            </CardDescription>
          </CardHeader>
          <CardContent className="ml-10">
            <form onSubmit={handleUpdateDisplayName} className="flex gap-3">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="表示名を入力"
                className="flex-1"
              />
              <Button type="submit" disabled={isUpdatingName} size="sm">
                {isUpdatingName ? "更新中..." : "更新"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* メールアドレス */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              メールアドレス
            </CardTitle>
            <CardDescription className="ml-10">
              ログインに使用しているメールアドレス
            </CardDescription>
          </CardHeader>
          <CardContent className="ml-10">
            <p className="text-sm font-mono bg-muted/50 px-3 py-2 rounded-md inline-block">
              {user.email}
            </p>
          </CardContent>
        </Card>

        {/* パスワード変更 */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="h-4 w-4 text-primary" />
              </div>
              パスワード変更
            </CardTitle>
            <CardDescription className="ml-10">
              新しいパスワードを設定できます（6文字以上）
            </CardDescription>
          </CardHeader>
          <CardContent className="ml-10">
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm">新しいパスワード</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm">パスワード確認</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" disabled={isUpdatingPassword || !newPassword || !confirmPassword} size="sm">
                {isUpdatingPassword ? "更新中..." : "パスワードを変更"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* アカウント削除 */}
        <Card className="border-destructive/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Trash2 className="h-4 w-4 text-destructive" />
              </div>
              <span className="text-destructive">アカウント削除</span>
            </CardTitle>
            <CardDescription className="ml-10">
              アカウントを削除すると、すべてのプロジェクトが削除されます。
              この操作は取り消せません。
            </CardDescription>
          </CardHeader>
          <CardContent className="ml-10">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              アカウントを削除
            </Button>
          </CardContent>
        </Card>
      </main>

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
