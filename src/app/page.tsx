import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Beaker, ArrowRight } from "lucide-react"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // ログイン済みならダッシュボードへ
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <main className="flex flex-col items-center gap-8 px-6 text-center">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3">
            <Beaker className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            理科教材エディター
          </h1>
        </div>
        
        <p className="max-w-md text-lg text-slate-600">
          電気回路や実験図を簡単に作成できるツールです。
          <br />
          テストやプリントの作成にご活用ください。
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/login">
            <Button size="lg" className="gap-2">
              ログインして始める
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
