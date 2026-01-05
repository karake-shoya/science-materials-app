import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  console.log("Auth callback triggered:", request.url)
  const code = searchParams.get("code")
  const error_description = searchParams.get("error_description")
  const next = searchParams.get("next") ?? "/dashboard"

  if (error_description) {
    console.error("OAuth error:", error_description)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error_description)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error("Exchange code error:", error.message)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }
    
    // 認証完了画面を経由してダッシュボードへ
    const verifiedUrl = new URL('/login/verified', origin)
    verifiedUrl.searchParams.set('next', next)
    
    return NextResponse.redirect(verifiedUrl)
  }

  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}