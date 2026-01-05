import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, FlaskConical, Lightbulb, FileText, Share2, Settings } from "lucide-react"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-background text-foreground">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-green-50/50 via-background to-background" />
      <div className="fixed inset-0 -z-10 opacity-[0.03] animate-flow-x" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
           }}
      />

      {/* Shapes floating */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-3xl animate-float delay-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent/10 blur-3xl animate-float delay-1000" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
              <FlaskConical className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">ScienceEditor</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              ログイン
            </Link>
            <Link href="/login">
              <Button className="font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-full px-6">
                無料で始める
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-20 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-24 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium border border-border/50 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            理科教材作成の新しいスタンダード
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            <span className="block text-foreground">理科のプリントを、</span>
            <span className="bg-linear-to-r from-primary to-green-600 bg-clip-text text-transparent">
              直感的にデザイン。
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            もう、複雑な作図ソフトと格闘する必要はありません。<br className="hidden md:block"/>
            回路図も実験器具も、ブラウザ上でドラッグ＆ドロップするだけ。
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300">
                今すぐ作成を始める
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-2 hover:bg-secondary/50">
                機能を見る
              </Button>
            </Link>
          </div>
        </div>

        {/* Bento Grid Features */}
        <section id="features" className="w-full max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">選ばれる理由</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[280px]">
            {/* Main Feature - Large */}
            <div className="md:col-span-2 row-span-1 md:row-span-2 group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-8 shadow-sm hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-64 h-64 -mr-16 -mt-16 text-primary" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">電気回路図エディタ</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                    豆電球、電池、スイッチ...中学校で扱う全ての部品を網羅。<br/>
                    線をつなぐのも、部品を動かすのも、驚くほどスムーズです。
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4 mt-8 border border-border/50">
                  <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"/>直列回路</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"/>並列回路</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"/>オームの法則</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - PDF */}
            <div className="group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent/10 rounded-tl-full" />
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center mb-4 text-accent-foreground">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-2">PDF一発出力</h3>
              <p className="text-muted-foreground text-sm">
                作成した図は高解像度PDFとして出力。プリント作成の時間を大幅に短縮します。
              </p>
            </div>

            {/* Feature 3 - Experiment Tools */}
            <div className="group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 shadow-sm hover:shadow-md transition-all">
               <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/10 rounded-tl-full" />
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-600">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-2">実験器具モード</h3>
              <p className="text-muted-foreground text-sm">
                ビーカーやフラスコなど、実験の様子を描くのも簡単。スケッチ感覚で配置できます。
              </p>
            </div>

            {/* Feature 4 - Share */}
            <div className="md:col-span-1 group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 shadow-sm hover:shadow-md transition-all md:col-start-3 md:row-start-2">
               <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-500/10 rounded-tl-full" />
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4 text-orange-600">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-2">教材シェア</h3>
              <p className="text-muted-foreground text-sm">
                作った教材は先生同士でシェア。
                質の高い教材データベースをみんなで作りましょう。
              </p>
            </div>
          </div>
        </section>

      </main>

      <footer className="py-8 border-t border-border/40 bg-background/50">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Science Materials App. Designed for Teachers.</p>
        </div>
      </footer>
    </div>
  )
}
