"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function updateDisplayName(formData: FormData) {
  const supabase = await createClient()
  const displayName = formData.get("displayName") as string

  const { error } = await supabase.auth.updateUser({
    data: { display_name: displayName }
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/mypage")
  return { success: true }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const jobTitle = formData.get("jobTitle") as string
  const schoolType = formData.get("schoolType") as string
  const specialty = formData.get("specialty") as string
  const preferredPaperSize = formData.get("preferredPaperSize") as string

  const { error } = await supabase.auth.updateUser({
    data: { 
      job_title: jobTitle,
      school_type: schoolType,
      specialty: specialty,
      preferred_paper_size: preferredPaperSize
    }
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/mypage")
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (newPassword !== confirmPassword) {
    return { error: "パスワードが一致しません" }
  }

  if (newPassword.length < 6) {
    return { error: "パスワードは6文字以上にしてください" }
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function deleteAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "ユーザーが見つかりません" }
  }

  // ユーザーのキャンバスを削除
  await supabase
    .from("canvases")
    .delete()
    .eq("user_id", user.id)

  // Supabaseではクライアント側からの自己削除はAdmin APIが必要
  // 代わりにサインアウトしてユーザーに削除依頼を案内
  await supabase.auth.signOut()
  
  redirect("/?message=account_deleted")
}

