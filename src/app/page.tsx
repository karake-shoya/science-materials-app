import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, FlaskConical, Lightbulb } from "lucide-react"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen">
      {/* 背景パターン */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* ベースグラデーション */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
        
        {/* グリッドパターン */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(100, 100, 100, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(100, 100, 100, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* 回路/分子パターン（SVG） */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* ノード（接点/分子） */}
              <circle cx="40" cy="40" r="3" fill="rgba(100, 100, 100, 0.15)" />
              <circle cx="160" cy="80" r="4" fill="rgba(100, 100, 100, 0.15)" />
              <circle cx="80" cy="160" r="3" fill="rgba(100, 100, 100, 0.15)" />
              <circle cx="180" cy="180" r="2" fill="rgba(100, 100, 100, 0.15)" />
              
              {/* 接続線（回路/結合） */}
              <path d="M40 40 L100 40 L100 80 L160 80" stroke="rgba(100, 100, 100, 0.12)" strokeWidth="1" fill="none" />
              <path d="M160 80 L160 140 L80 140 L80 160" stroke="rgba(100, 100, 100, 0.12)" strokeWidth="1" fill="none" />
              <path d="M80 160 L140 160 L140 180 L180 180" stroke="rgba(100, 100, 100, 0.12)" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
        
        {/* アクセントのぼかし */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      </div>

      {/* ヘッダー */}
      <header className="border-b border-border/5 bg-background/5 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">ScienceEditor</span>
          </div>
          <Link href="/login">
            <Button variant="outline" size="sm">
              ログイン
            </Button>
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-5xl px-6 bg-background/5 backdrop-blur-sm">
        {/* ヒーローセクション */}
        <section className="py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
              理科の図版作成を
              <br />
              <span className="text-primary">もっとシンプルに</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              電気回路図、実験器具の配置図など、理科の授業で使う図版を
              ブラウザ上で簡単に作成できます。テストやプリントの作成にどうぞ。
            </p>
            <div className="flex gap-4">
              <Link href="/login">
                <Button size="lg" className="px-8">
                  無料で始める
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 特徴セクション */}
        <section className="py-16 border-t border-border/50">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-accent/30 flex items-center justify-center">
                <Zap className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-lg">電気回路図</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                豆電球、電池、スイッチなどの部品をドラッグ&ドロップで配置。
                導線も簡単に接続できます。
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-accent/30 flex items-center justify-center">
                <FlaskConical className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-lg">実験器具</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                ビーカー、試験管、フラスコなど、よく使う実験器具を
                すぐに配置できます。
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-accent/30 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-lg">PDF出力</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                作成した図版はPDFや画像として出力可能。
                そのままプリントに貼り付けられます。
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="border-t border-border/5 mt-20 bg-background/80 backdrop-blur-sm sticky bottom-0 z-10">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} ScienceEditor. 教育現場で自由にご利用ください。
          </p>
        </div>
      </footer>
    </div>
  )
}
