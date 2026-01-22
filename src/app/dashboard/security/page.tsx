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
import { ArrowLeft, Lock, Trash2, Shield, Smartphone, Globe } from "lucide-react"
import { toast } from "sonner"
import { getUser, updatePassword, deleteAccount } from "../../mypage/actions"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function SecurityPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
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
      }
    }
    fetchUser()
  }, [])

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

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto max-w-2xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold">セキュリティ設定</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8 space-y-6">
        {/* パスワード */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Lock className="h-4 w-4 text-primary" />
              パスワードの変更
            </CardTitle>
            <CardDescription>
              アカウントを安全に保つために、定期的なパスワード変更をお勧めします。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-sm">
              <div className="space-y-2">
                <Label htmlFor="newPassword">新しいパスワード</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">確認用パスワード</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" disabled={isUpdatingPassword || !newPassword} className="font-bold">
                {isUpdatingPassword ? "更新中..." : "パスワードを更新"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 2段階認証 (Placeholder) */}
        <Card className="border-border/60 shadow-sm opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Smartphone className="h-4 w-4 text-slate-400" />
              2段階認証（準備中）
            </CardTitle>
            <CardDescription>
              ログイン時にモバイルアプリやSMSでの認証を追加し、セキュリティを強化します。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" disabled className="font-bold">設定を開始する</Button>
          </CardContent>
        </Card>

        {/* ログイン履歴 (Placeholder) */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Globe className="h-4 w-4 text-primary" />
              最近のログイン履歴
            </CardTitle>
            <CardDescription>
              アカウントにアクセスしたデバイスと場所の履歴です。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <div className="flex items-center justify-between py-2 border-b border-slate-100 italic text-slate-400 text-sm">
                  準備中です...
               </div>
            </div>
          </CardContent>
        </Card>

        {/* 危険な操作 */}
        <div className="pt-8 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-500 mb-4 px-1">危険な操作</h3>
          <Card className="border-red-200 bg-red-50/30">
            <CardHeader>
              <CardTitle className="text-base font-bold text-red-600 flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                アカウントの削除
              </CardTitle>
              <CardDescription className="text-red-600/70">
                アカウントを削除すると、作成したすべてのプリントデータが完全に消去され、復元できなくなります。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="font-bold"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                アカウントを削除する
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">本当に削除しますか？</DialogTitle>
            <DialogDescription>
              この操作を元に戻すことはできません。すべてのデータが失われます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting} className="font-bold">
              {isDeleting ? "削除中..." : "削除する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
