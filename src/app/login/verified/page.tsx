'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2 } from "lucide-react"

function VerifiedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // 遷移先URLを取得、デフォルトはダッシュボード
  const next = searchParams.get('next') || '/dashboard'

  useEffect(() => {
    // ユーザーにメッセージを見せるために少し待機してから遷移
    const timer = setTimeout(() => {
      router.push(next)
      router.refresh() // ログイン状態を反映させるためにリフレッシュ
    }, 2000)

    return () => clearTimeout(timer)
  }, [next, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-border/60">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl">認証完了</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground text-sm">
            メールアドレスの確認が完了しました。<br />
            自動的にログインします...
          </p>
          <div className="flex justify-center pt-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifiedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}>
      <VerifiedContent />
    </Suspense>
  )
}
