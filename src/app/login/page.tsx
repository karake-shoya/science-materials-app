import { login, signup } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleLoginButton } from "@/components/feature/GoogleLoginButton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Zap, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* ロゴ */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="text-xl font-semibold">ScienceEditor</h1>
        </div>

        <Card className="border-border/60">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg">ログイン</CardTitle>
            <CardDescription>
              アカウントを作成するか、ログインしてください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              {message && (
                <div className="p-3 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {message}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm">メールアドレス</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="teacher@school.ed.jp"
                  className="h-10"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm">パスワード</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required
                  className="h-10"
                />
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Button formAction={login} className="h-10">
                  ログイン
                </Button>
                <Button formAction={signup} variant="outline" className="h-10">
                  新規登録
                </Button>
              </div>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">または</span>
                </div>
              </div>

              <GoogleLoginButton />
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            ← トップページに戻る
          </Link>
        </p>
      </div>
    </div>
  )
}
