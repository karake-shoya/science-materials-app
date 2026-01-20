import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Zap, 
  FlaskConical, 
  FileText, 
  Share2, 
  CircuitBoard, 
  LineChart, 
  Calculator,
  ArrowRight,
  CheckCircle2,
  Play
} from "lucide-react"
import { CircuitDemo } from "@/components/landing/CircuitDemo"
import Image from "next/image"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-background text-foreground">
      {/* 背景デザイン: 方眼紙 + グラデーション */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-50/50 via-background to-background" />
      <div className="fixed inset-0 -z-10 opacity-[0.04]" 
           style={{
             backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
             backgroundSize: '30px 30px'
           }}
      />

      {/* Floating Elements (Decorative) */}
      <div className="fixed top-[-5%] right-[-5%] w-[30vw] h-[30vw] rounded-full bg-blue-500/5 blur-3xl animate-pulse" />
      <div className="fixed bottom-[10%] left-[-5%] w-[25vw] h-[25vw] rounded-full bg-green-500/5 blur-3xl animate-pulse delay-700" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <FlaskConical className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tighter italic text-primary">ScienceEditor</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/about" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/login" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              ログイン
            </Link>
            <Link href="/login">
              <Button className="font-bold rounded-full px-6 bg-primary hover:bg-primary/90">
                無料で始める
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-16 md:pt-32 pb-20 relative group">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side: Content */}
            <div className="text-left space-y-10 relative z-10 animate-in fade-in slide-in-from-left-10 duration-1000">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-slate-900">
                  クリック一つで、<br />
                  <span className="relative inline-block mt-2">
                    <span className="relative z-10 text-primary">理想のプリント</span>が
                    <span className="absolute bottom-2 left-0 w-full h-4 bg-primary/10 -z-10 rounded-sm"></span>
                  </span>
                  <br />
                  完成する。
                </h1>
                <div className="h-1 w-24 bg-primary rounded-full"></div>
              </div>
              
              <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed font-medium">
                「本当はこういうプリントが欲しかった。」<br className="hidden md:block"/>
                日本の教科書に準拠した図解と、一瞬で生成される計算問題。<br />
                理科室のワクワクを、そのまま教材に。
              </p>
              
              <div className="flex flex-wrap items-center justify-start gap-4 pt-4">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all font-bold bg-primary text-primary-foreground border-none">
                    無料で体験する
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Link href="/samples/sample-material.pdf" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-6 rounded-2xl border-slate-200 bg-white/50 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all font-bold text-slate-700">
                    サンプルPDFを見る
                  </Button>
                </Link>

                <Link href="/about" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-6 rounded-2xl border-slate-200 bg-white/50 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all font-bold text-slate-700">
                    私たちの想い
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side: Interactive App Preview Window */}
            <div className="hidden lg:block relative h-[500px] animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent rounded-[3rem] blur-2xl -z-10"></div>
              
              <div className="relative h-full w-full perspective-1000">
                <div className="relative bg-white rounded-4xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-200/60 overflow-hidden group/window hover:-translate-y-4 hover:rotate-x-2 transition-all duration-500 ease-out">
                  {/* Window Header */}
                  <div className="h-10 border-b border-slate-100 bg-slate-50/50 flex items-center px-6 justify-between">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400/20" />
                      <div className="w-3 h-3 rounded-full bg-amber-400/20" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400/20" />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">ScienceEditor Project</div>
                    <div className="w-10" />
                  </div>
                  
                  {/* Window Content: App Screenshot */}
                  <div className="relative aspect-4/3 overflow-hidden">
                    <Image 
                      src="/landing/editor-preview.png" 
                      alt="ScienceEditor Interface Preview"
                      width={800}
                      height={600}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>

              {/* Decorative Blur Accents */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            </div>
          </div>
        </section>
        
        {/* Interactive Demo Section */}
        <section className="bg-slate-50/50 py-24 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-sm mb-6 border border-blue-100">
                <Play className="w-4 h-4" />
                <span>インタラクティブ体験</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                その場で試せる、回路図作成
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                インストール不要。パーツを置いて、線をつなぐだけ。<br className="hidden md:block" />
                理想の教材が、ブラウザ上で直感的に作成できます。
              </p>
            </div>
            
            <CircuitDemo />
          </div>
        </section>

        {/* Bento Grid: 先生の悩みにフォーカス */}
        <section id="features" className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Feature 1: Circuit Editor (Big) */}
            <div className="md:col-span-8 group relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-10 shadow-2xl">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/30">
                    <CircuitBoard className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">日本の理科教育に準拠した<br/>回路図エディタ</h3>
                  <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
                    豆電球、スイッチ、電流計・電圧計。日本の教科書でおなじみの記号を網羅。配線は自動で直角に。
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 mt-10">
                  {['直列・並列', '検流計', '抵抗の記号', '自由な配置'].map(tag => (
                    <span key={tag} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* 装飾的な回路図イメージ */}
              <div className="absolute top-10 right-[-10%] opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                <CircuitBoard size={400} />
              </div>
            </div>

            {/* Feature 2: Generator (Detailed) */}
            <div className="md:col-span-4 group relative overflow-hidden rounded-[2.5rem] bg-emerald-50 border border-emerald-100 p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-emerald-200">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-emerald-900 text-pretty">
                計算問題プリント、<br/>一瞬で無限に。
              </h3>
              <ul className="space-y-4 text-emerald-800/80 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 密度の計算
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 飽和水蒸気量グラフ
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 複雑な仕事の原理
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-emerald-200">
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Auto-Generation</p>
              </div>
            </div>

            {/* Feature 3: Output */}
            <div className="md:col-span-4 group rounded-[2.5rem] bg-card border border-border p-8 hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-6 text-slate-600">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">高画質PDF出力</h3>
              <p className="text-muted-foreground leading-relaxed">
                Wordに貼り付けてもボケない、ベクター形式の美しい図解。そのまま印刷して配布可能です。
              </p>
            </div>

            {/* Feature 4: Humidity Curve Spotlight */}
            <div className="md:col-span-8 group relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-indigo-50 to-white border border-indigo-100 p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
                    <LineChart className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-indigo-900">湿度の曲線も、正確に描画。</h3>
                  <p className="text-indigo-800/70 leading-relaxed mb-4">
                    温度と水蒸気量の関係を動的にグラフ化。補助線の有無や目盛り間隔も、クリックだけでカスタマイズ。
                  </p>
                  <Button variant="link" className="text-indigo-600 p-0 h-auto font-bold">
                    対応単元一覧を見る <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-indigo-200 shadow-xl p-4 aspect-4/3 flex flex-col gap-2">
                   {/* 簡易的なグラフのビジュアル */}
                   <div className="flex-1 border-l-2 border-b-2 border-slate-300 relative overflow-hidden">
                      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                         <path d="M-30,95 C20,95 50,80 100,20" fill="none" stroke="#4f46e5" strokeWidth="3" />
                         <line x1="60" y1="100" x2="60" y2="60" stroke="#4f46e5" strokeDasharray="4" />
                         <line x1="-40" y1="60" x2="60" y2="60" stroke="#4f46e5" strokeDasharray="4" />
                      </svg>
                   </div>
                   <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Closing CTA */}
        <section className="container mx-auto px-6 py-24">
          <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center text-primary-foreground relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <h2 className="text-4xl md:text-6xl font-bold mb-8 relative z-10">
              放課後の時間を、<br className="md:hidden"/>自分のために。
            </h2>
            <p className="text-xl opacity-90 mb-12 max-w-xl mx-auto relative z-10 leading-relaxed">
              放課後の職員室で、<br/>
              もう一度「授業を練る」楽しさを取り戻しましょう。
            </p>
            <div className="relative z-10">
              <Link href="/login">
                <Button size="lg" variant="secondary" className="h-16 px-12 rounded-2xl text-xl font-bold hover:scale-105 transition-all">
                  まずは無料で使ってみる
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/40 bg-slate-50/50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <FlaskConical className="h-5 w-5" />
            <span className="font-bold tracking-tighter">ScienceEditor</span>
          </div>
          <p className="text-sm text-muted-foreground tracking-tight">
            © {new Date().getFullYear()} Science Materials Project. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">利用規約</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">お問い合わせ</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}