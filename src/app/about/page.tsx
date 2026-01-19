import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FlaskConical, ArrowLeft, ExternalLink, User, Code2, Heart } from "lucide-react"
import { FaGithub, FaXTwitter } from "react-icons/fa6"
import { SiQiita } from "react-icons/si"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-50/50 via-background to-background" />
      <div className="fixed inset-0 -z-10 opacity-[0.04]" 
           style={{
             backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
             backgroundSize: '30px 30px'
           }}
      />

      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <FlaskConical className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tighter italic text-primary">ScienceEditor</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              トップに戻る
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-sm border border-blue-100">
              <User className="w-4 h-4" />
              <span>About Me</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">開発者について</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              「理科の先生を、もっと自由に。」<br />
              そんな想いから、このアプリケーションを開発しています。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {/* Profile Sidebar */}
            <div className="md:col-span-4 space-y-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-emerald-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white border border-border p-6 rounded-3xl flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 overflow-hidden relative">
                    <Image 
                      src="/abouts/profile-image.png" 
                      alt="Shoya Ueno"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold mb-1">Shoya Ueno</h2>
                  <p className="text-sm text-muted-foreground mb-4">Software Developer / Educator</p>
                  <div className="flex gap-4">
                    <Link href="https://github.com/karake-shoya" target="_blank" className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-900 transition-colors" title="GitHub">
                      <FaGithub className="w-5 h-5" />
                    </Link>
                    <Link href="https://x.com/naiawa1026" target="_blank" className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-900 transition-colors" title="X (Twitter)">
                      <FaXTwitter className="w-5 h-5" />
                    </Link>
                    <Link href="https://qiita.com/shoya_u" target="_blank" className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-[#55C500] transition-colors" title="Qiita">
                      <SiQiita className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-8 space-y-10">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Code2 className="w-5 h-5" />
                  <h2>ScienceEditor について</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  かつて理科の教員として教壇に立っていた際、一番苦労したのが「質の高い図解やプリントを素早く作ること」でした。
                  WordやPowerPointでの作図は時間がかかり、一度作った教材の微調整も一苦労です。
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  ScienceEditorは、そんな現場の先生方の負担を少しでも減らし、授業準備の時間を「授業の質を上げるための思索」に充てられるようにという願いを込めて作っています。
                  エンジニアとしての技術を、教育の現場に還元することを目指しています。
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Heart className="w-5 h-5" />
                  <h2>リンク集</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link 
                    href="https://github.com/karake-shoya" 
                    target="_blank"
                    className="flex items-center justify-between p-4 rounded-2xl border border-border bg-white hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-900 text-white">
                        <FaGithub className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">GitHub</p>
                        <p className="text-xs text-muted-foreground">OSS project & code</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>

                  <Link 
                    href="https://x.com/naiawa1026" 
                    target="_blank"
                    className="flex items-center justify-between p-4 rounded-2xl border border-border bg-white hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-900 text-white">
                        <FaXTwitter className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">X (Twitter)</p>
                        <p className="text-xs text-muted-foreground">Daily updates</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>

                  <Link 
                    href="https://qiita.com/shoya_u" 
                    target="_blank"
                    className="flex items-center justify-between p-4 rounded-2xl border border-border bg-white hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-[#55C500] text-white">
                        <SiQiita className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Qiita</p>
                        <p className="text-xs text-muted-foreground">Technical articles</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-border/40 bg-slate-50/50 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Science Editor. All rights reserved.
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
