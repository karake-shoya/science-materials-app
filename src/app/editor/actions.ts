"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveCanvas(
  canvasId: string | null,
  title: string,
  canvasData: object
) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  console.log("Auth check:", { user: user?.id, error: authError })
  if (!user) {
    return { error: authError?.message || "Unauthorized" }
  }

  if (canvasId) {
    const { error } = await supabase
      .from("canvases")
      .update({
        title,
        data: canvasData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", canvasId)
      .eq("user_id", user.id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/dashboard")
    return { sccess: true, id: canvasId }
  } else {
    const { data, error } = await supabase
      .from("canvases")
      .insert({
        user_id: user.id,
        title,
        data: canvasData,
      })
      .select("id")
      .single()

    console.log("DB insert result:", { data, error })
    if (error) {
      return { error: error.message }
    }
    revalidatePath("/dashboard")
    return { success: true, id: data.id }
  }
}

export async function getUserCanvases() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from("canvases")
    .select("id, title, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  return data || []
}

export async function getCanvasById(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized"}

  const { data, error } = await supabase
    .from("canvases")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) return { error: error.message }
  return { data, error: null }
}