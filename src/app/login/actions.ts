"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// 定数定義
const MIN_PASSWORD_LENGTH = 6
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ERRORS = {
  INVALID_EMAIL: "無効なメールアドレス形式です。",
  PASSWORD_TOO_SHORT: `パスワードは${MIN_PASSWORD_LENGTH}文字以上である必要があります。`,
  AUTH_FAILED: "メールアドレスまたはパスワードが正しくありません。",
  EMAIL_ALREADY_REGISTERED: "そのメールアドレスは既に登録されています。",
  GENERIC: "認証エラーが発生しました。",
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  // 安全な値の取得
  const email = String(formData.get("email") || "")
  const password = String(formData.get("password") || "")

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // セキュリティのため、具体的なエラー内容は伏せて一般的なメッセージを返す
    console.error("Login error:", error.message)
    redirect(`/login?error=${encodeURIComponent(ERRORS.AUTH_FAILED)}`)
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = String(formData.get("email") || "")
  const password = String(formData.get("password") || "")

  // バリデーション
  const validationError = validateSignupInput(email, password)
  if (validationError) {
    redirect(`/login?error=${encodeURIComponent(validationError)}`)
  }

  // 環境変数が読み込めない場合のためのフォールバック
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  console.log("Using App URL:", appUrl)
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
    },
  })

  if (error) {
    console.error("Signup error:", error)
    
    // 重複登録エラーのハンドリング
    if (error.message.includes("already registered")) {
      return redirect(`/login?error=${encodeURIComponent(ERRORS.EMAIL_ALREADY_REGISTERED)}`)
    }

    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // 既存ユーザーの場合、identitiesが空になることがある（Supabaseの設定による）
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return redirect(`/login?error=${encodeURIComponent(ERRORS.EMAIL_ALREADY_REGISTERED)}`)
  }

  revalidatePath("/", "layout")
  redirect("/login/verify")
}

// ヘルパー関数: 入力バリデーション
function validateSignupInput(email: string, password: string): string | null {
  if (!email || !EMAIL_REGEX.test(email)) {
    return ERRORS.INVALID_EMAIL
  }
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return ERRORS.PASSWORD_TOO_SHORT
  }
  return null
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  })

  if (error) {
    redirect("/login?error=Could not sign in with Google")
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}