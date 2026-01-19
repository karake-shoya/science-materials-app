"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FlaskConical, ArrowLeft, Mail, Send, Loader2, CheckCircle2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { submitContact } from "./actions"

const formSchema = z.object({
  name: z.string().min(2, "お名前は2文字以上で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  subject: z.string().min(2, "件名を入力してください"),
  message: z.string().min(10, "お問い合わせ内容は10文字以上で入力してください"),
})

type FormData = z.infer<typeof formSchema>

export default function ContactPage() {
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsPending(true)
    try {
      const result = await submitContact(data)
      if (result.success) {
        setIsSuccess(true)
        toast.success("お問い合わせを送信しました")
        reset()
      } else {
        toast.error(result.error || "送信に失敗しました")
      }
    } catch (error) {
      toast.error("予期せぬエラーが発生しました")
    } finally {
      setIsPending(false)
    }
  }

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

      <main className="flex-1 container mx-auto px-6 py-12 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm border border-primary/20">
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">お問い合わせ</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              製品に関するご質問やご相談など、<br className="hidden md:block" />
              お気軽にお問い合わせください。
            </p>
          </div>

          <Card className="border-border/60 shadow-2xl shadow-primary/5 overflow-hidden">
            {isSuccess ? (
              <div className="p-12 text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">送信完了</h3>
                  <p className="text-muted-foreground">
                    お問い合わせありがとうございます。内容を確認次第、順次返信させていただきます。
                  </p>
                </div>
                <Button onClick={() => setIsSuccess(false)} variant="outline">
                  別のメッセージを送る
                </Button>
              </div>
            ) : (
              <>
                <CardHeader className="bg-slate-50/50 border-b border-border/40">
                  <CardTitle>メッセージを送る</CardTitle>
                  <CardDescription>
                    以下のフォームにご入力ください。通常2〜3営業日以内に返信いたします。
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">お名前</Label>
                        <Input
                          id="name"
                          placeholder="山田 太郎"
                          {...register("name")}
                          className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">メールアドレス</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="teacher@school.ed.jp"
                          {...register("email")}
                          className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">件名</Label>
                      <Input
                        id="subject"
                        placeholder="機能追加のご要望について"
                        {...register("subject")}
                        className={errors.subject ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {errors.subject && (
                        <p className="text-xs text-destructive font-medium">{errors.subject.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">お問い合わせ内容</Label>
                      <Textarea
                        id="message"
                        placeholder="こちらに内容を入力してください（10文字以上）"
                        className={`min-h-[150px] resize-none ${errors.message ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className="text-xs text-destructive font-medium">{errors.message.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg font-bold gap-2 shadow-lg shadow-primary/20" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          送信中...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          メッセージを送信する
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </>
            )}
          </Card>

          <div className="text-center">
             <p className="text-sm text-muted-foreground">
               プライバシーポリシーに基づいて、お問い合わせ内容を適切に管理いたします。
             </p>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-border/40 bg-slate-50/50 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Science Editor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
