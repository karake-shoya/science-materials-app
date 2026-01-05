import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MailCheck } from "lucide-react"
import Link from "next/link"

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Card className="border-border/60">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MailCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">メールを確認してください</CardTitle>
            <CardDescription className="pt-2">
              登録確認メールを送信しました。
              <br />
              メール内のリンクをクリックして、登録を完了してください。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground text-center">
              ※メールが届かない場合は、迷惑メールフォルダもご確認ください。
            </div>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full">
                ログイン画面に戻る
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
