import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FlaskConical, ArrowLeft, ShieldCheck, Scale, FileText, AlertCircle, Zap } from "lucide-react"

export default function TermsPage() {
  const lastUpdated = "2026年1月20日"

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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-sm border border-blue-100">
              <ShieldCheck className="w-4 h-4" />
              <span>Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">利用規約</h1>
            <p className="text-muted-foreground">最終更新日: {lastUpdated}</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">
            <section className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <FileText className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">第1条（適用）</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                本規約は、ScienceEditorの運営者（以下「当方」といいます）が提供する本サービス（以下「本サービス」といいます）の利用条件を定めるものです。本サービスを利用する全てのユーザー（以下「ユーザー」といいます）は、本規約に従って本サービスを利用するものとします。ユーザーは、本サービスを利用することにより、本規約の全ての記載内容に同意したものとみなされます。
              </p>
            </section>

            <section className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <Scale className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">第2条（知的財産権および利用許諾）</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  1. 本サービスを構成するプログラム、デザイン、ロゴ等の知的財産権は、全て当方または正当な権利者に帰属します。
                </p>
                <p>
                  2. ユーザーが本サービスを利用して作成した教材データ（以下「作成物」といいます）について、当方はユーザーに対し、教育現場（学校、塾、家庭学習、非営利目的の講習会等）における複製、配布、公衆送信、および改変を無償で許諾します。
                </p>
                <p>
                  3. ユーザーは、当方の事前の書面による承諾なく、作成物をそのまま、または軽微な改変のみで、第三者に有償で販売（デジタルコンテンツとしての販売、ストックフォトサイト等への登録を含む）してはなりません。ただし、教育サービス（月謝制の授業等）の付随資料として配布することはこの限りではありません。
                </p>
              </div>
            </section>

            <section className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-destructive">
                <AlertCircle className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">第3条（禁止事項）</h2>
              </div>
              <p className="mb-4 text-muted-foreground leading-relaxed">ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
                <li>法令または公序良俗に違反する行為。</li>
                <li>本サービスのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為、または過度な負荷をかける行為。</li>
                <li>本サービスの運営を妨害するおそれのある行為。</li>
                <li>本サービスを逆アセンブル、逆コンパイル、リバースエンジニアリングする行為。</li>
                <li>他のユーザーに関する個人情報などを収集または蓄積する行為。</li>
                <li>他のユーザーに成りすます行為。</li>
                <li>当方の許諾を得ない、本サービス自体の商標利用や二次配布、転売。</li>
              </ul>
            </section>

            <section className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <Zap className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">第4条（本サービスの停止等）</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  当方は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>本サービスに係るコンピュータシステムの保守点検または更新を行う場合。</li>
                  <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合。</li>
                  <li>その他、当方が本サービスの提供が困難と判断した場合。</li>
                </ul>
                <p>
                  当方は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、理由を問わず一切の責任を負わないものとします。
                </p>
              </div>
            </section>

            <section className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <Scale className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">第5条（免責事項）</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  1. 当方は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます）がないことを明示的にも黙示的にも保証しておりません。
                </p>
                <p>
                  2. 当方は、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。特に、本サービスを利用して作成された図解や計算問題の結果に誤りがあった場合、それによって生じた損害（テストの誤採点、学習の遅延等）について、当方は一切の責任を負いません。
                </p>
                <p>
                  3. 本サービスに関するユーザーと他のユーザーまたは第三者との間において生じた紛争等について、当方は一切責任を負いません。
                </p>
              </div>
            </section>

            <section className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <FileText className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">第6条（利用規約の変更）</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  1. 当方は、必要と判断した場合には、本規約を変更することができるものとします。
                </p>
                <p>
                  2. 本規約を変更する場合、変更後の規約の施行時期および内容を本サービス上での掲示その他の適切な方法により周知し、またはユーザーに通知します。
                </p>
                <p>
                  3. 変更後の規約の効力発生後にユーザーが本サービスを利用したときは、ユーザーは本規約の変更に同意したものとみなされます。
                </p>
              </div>
            </section>

            <section className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <Scale className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">第7条（準拠法・裁判管轄）</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  1. 本規約の解釈にあたっては、日本法を準拠法とします。
                </p>
                <p>
                  2. 本サービスに関して紛争が生じた場合には、当方の所在地を管轄する裁判所を専属的合意管轄とします。
                </p>
              </div>
            </section>
          </div>

          <div className="mt-20 pt-10 border-t border-border/40 text-center">
            <p className="text-sm text-muted-foreground">
              規約に関するご質問は、<Link href="/contact" className="text-primary font-bold hover:underline">お問い合わせページ</Link>よりご連絡ください。
            </p>
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
