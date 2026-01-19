"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"

const contactSchema = z.object({
  name: z.string().min(2, "お名前は2文字以上で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  subject: z.string().min(2, "件名を入力してください"),
  message: z.string().min(10, "お問い合わせ内容は10文字以上で入力してください"),
})

export type ContactFormData = z.infer<typeof contactSchema>

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitContact(data: ContactFormData) {
  // 1. バリデーション
  const validatedFields = contactSchema.safeParse(data)
  
  if (!validatedFields.success) {
    return { error: "入力内容に不備があります。" }
  }

  const { name, email, subject, message } = validatedFields.data
  const supabase = await createClient()

  try {
    // 2. Supabaseに保存
    // 注意: 事前に 'contacts' テーブルを作成しておく必要があります
    const { error: dbError } = await supabase
      .from("contacts")
      .insert([{ name, email, subject, message }])

    if (dbError) {
      console.error("Database Error:", dbError)
      return { error: "データの保存に失敗しました。時間をおいて再度お試しください。" }
    }

    // 3. メール通知 (Resendを使用)
    // RESEND_API_KEY が設定されている場合のみ送信
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "ScienceEditor Contact <onboarding@resend.dev>", // 本番運用時は独自ドメインに変更推奨
          to: [process.env.ADMIN_EMAIL || "admin@example.com"],
          subject: `【お問い合わせ】${subject}`,
          html: `
            <h3>新しいお問い合わせがありました</h3>
            <p><strong>お名前:</strong> ${name}</p>
            <p><strong>メールアドレス:</strong> ${email}</p>
            <p><strong>件名:</strong> ${subject}</p>
            <p><strong>内容:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          `,
        })
      } catch (mailError) {
        console.error("Mail Error:", mailError)
        // メール送信の失敗は、DB保存が成功していればユーザーには成功として返しても良いかもしれません
      }
    }

    return { success: true }
  } catch (err) {
    console.error("Submit Error:", err)
    return { error: "予期せぬエラーが発生しました。" }
  }
}
