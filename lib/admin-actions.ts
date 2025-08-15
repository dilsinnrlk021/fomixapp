"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function approveStore(storeId: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") {
    return { error: "Access denied. Admin privileges required." }
  }

  try {
    const { error } = await supabase
      .from("stores")
      .update({
        status: "approved",
        updated_at: new Date().toISOString(),
      })
      .eq("id", storeId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin")
    return { success: "Store approved successfully!" }
  } catch (error) {
    console.error("Store approval error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function rejectStore(storeId: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") {
    return { error: "Access denied. Admin privileges required." }
  }

  try {
    const { error } = await supabase
      .from("stores")
      .update({
        status: "rejected",
        updated_at: new Date().toISOString(),
      })
      .eq("id", storeId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin")
    return { success: "Store rejected successfully!" }
  } catch (error) {
    console.error("Store rejection error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function suspendStore(storeId: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") {
    return { error: "Access denied. Admin privileges required." }
  }

  try {
    const { error } = await supabase
      .from("stores")
      .update({
        status: "suspended",
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", storeId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin")
    return { success: "Store suspended successfully!" }
  } catch (error) {
    console.error("Store suspension error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") {
    return { error: "Access denied. Admin privileges required." }
  }

  if (!["customer", "store_owner", "admin"].includes(newRole)) {
    return { error: "Invalid role specified" }
  }

  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin")
    return { success: "User role updated successfully!" }
  } catch (error) {
    console.error("User role update error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function createCategory(prevState: any, formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") {
    return { error: "Access denied. Admin privileges required." }
  }

  const name = formData.get("name")
  const description = formData.get("description")

  if (!name) {
    return { error: "Category name is required" }
  }

  try {
    const { error } = await supabase.from("categories").insert({
      name: name.toString(),
      description: description?.toString() || null,
      image_url: "/placeholder.svg?height=200&width=200",
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin")
    return { success: "Category created successfully!" }
  } catch (error) {
    console.error("Category creation error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function toggleCategoryStatus(categoryId: string, isActive: boolean) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") {
    return { error: "Access denied. Admin privileges required." }
  }

  try {
    const { error } = await supabase.from("categories").update({ is_active: isActive }).eq("id", categoryId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin")
    return { success: `Category ${isActive ? "activated" : "deactivated"} successfully!` }
  } catch (error) {
    console.error("Category status update error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}
