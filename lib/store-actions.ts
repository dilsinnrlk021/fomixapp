"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createStore(prevState: any, formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if user is a store owner
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "store_owner") {
    return { error: "Only store owners can create stores" }
  }

  // Check if user already has a store
  const { data: existingStore } = await supabase.from("stores").select("id").eq("owner_id", user.id).single()
  if (existingStore) {
    return { error: "You already have a store registered" }
  }

  const name = formData.get("name")
  const description = formData.get("description")
  const phone = formData.get("phone")
  const email = formData.get("email")
  const street = formData.get("street")
  const number = formData.get("number")
  const complement = formData.get("complement")
  const neighborhood = formData.get("neighborhood")
  const city = formData.get("city")
  const state = formData.get("state")
  const zipCode = formData.get("zipCode")
  const deliveryFee = formData.get("deliveryFee")
  const minimumOrder = formData.get("minimumOrder")
  const deliveryTimeMin = formData.get("deliveryTimeMin")
  const deliveryTimeMax = formData.get("deliveryTimeMax")
  const deliveryRadius = formData.get("deliveryRadius")

  if (!name || !description || !phone || !street || !number || !neighborhood || !city || !state || !zipCode) {
    return { error: "All required fields must be filled" }
  }

  try {
    const { error } = await supabase.from("stores").insert({
      owner_id: user.id,
      name: name.toString(),
      description: description.toString(),
      phone: phone.toString(),
      email: email?.toString() || null,
      street: street.toString(),
      number: number.toString(),
      complement: complement?.toString() || null,
      neighborhood: neighborhood.toString(),
      city: city.toString(),
      state: state.toString(),
      zip_code: zipCode.toString(),
      delivery_fee: Number.parseFloat(deliveryFee?.toString() || "0"),
      minimum_order: Number.parseFloat(minimumOrder?.toString() || "0"),
      delivery_time_min: Number.parseInt(deliveryTimeMin?.toString() || "30"),
      delivery_time_max: Number.parseInt(deliveryTimeMax?.toString() || "60"),
      delivery_radius_km: Number.parseFloat(deliveryRadius?.toString() || "5"),
      status: "pending",
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/store")
    return { success: "Store registered successfully! It will be reviewed by our team." }
  } catch (error) {
    console.error("Store creation error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function updateStore(prevState: any, formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const storeId = formData.get("storeId")
  if (!storeId) {
    return { error: "Store ID is required" }
  }

  // Verify ownership
  const { data: store } = await supabase.from("stores").select("owner_id").eq("id", storeId).single()
  if (!store || store.owner_id !== user.id) {
    return { error: "You don't have permission to update this store" }
  }

  const name = formData.get("name")
  const description = formData.get("description")
  const phone = formData.get("phone")
  const email = formData.get("email")
  const deliveryFee = formData.get("deliveryFee")
  const minimumOrder = formData.get("minimumOrder")
  const deliveryTimeMin = formData.get("deliveryTimeMin")
  const deliveryTimeMax = formData.get("deliveryTimeMax")
  const deliveryRadius = formData.get("deliveryRadius")

  try {
    const { error } = await supabase
      .from("stores")
      .update({
        name: name?.toString(),
        description: description?.toString(),
        phone: phone?.toString(),
        email: email?.toString() || null,
        delivery_fee: Number.parseFloat(deliveryFee?.toString() || "0"),
        minimum_order: Number.parseFloat(minimumOrder?.toString() || "0"),
        delivery_time_min: Number.parseInt(deliveryTimeMin?.toString() || "30"),
        delivery_time_max: Number.parseInt(deliveryTimeMax?.toString() || "60"),
        delivery_radius_km: Number.parseFloat(deliveryRadius?.toString() || "5"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", storeId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/store")
    return { success: "Store updated successfully!" }
  } catch (error) {
    console.error("Store update error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function updateStoreHours(prevState: any, formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const storeId = formData.get("storeId")
  if (!storeId) {
    return { error: "Store ID is required" }
  }

  // Verify ownership
  const { data: store } = await supabase.from("stores").select("owner_id").eq("id", storeId).single()
  if (!store || store.owner_id !== user.id) {
    return { error: "You don't have permission to update this store" }
  }

  // Build operating hours object
  const operatingHours = {
    monday: {
      open: formData.get("mondayOpen")?.toString() || null,
      close: formData.get("mondayClose")?.toString() || null,
      closed: formData.get("mondayClosed") === "on",
    },
    tuesday: {
      open: formData.get("tuesdayOpen")?.toString() || null,
      close: formData.get("tuesdayClose")?.toString() || null,
      closed: formData.get("tuesdayClosed") === "on",
    },
    wednesday: {
      open: formData.get("wednesdayOpen")?.toString() || null,
      close: formData.get("wednesdayClose")?.toString() || null,
      closed: formData.get("wednesdayClosed") === "on",
    },
    thursday: {
      open: formData.get("thursdayOpen")?.toString() || null,
      close: formData.get("thursdayClose")?.toString() || null,
      closed: formData.get("thursdayClosed") === "on",
    },
    friday: {
      open: formData.get("fridayOpen")?.toString() || null,
      close: formData.get("fridayClose")?.toString() || null,
      closed: formData.get("fridayClosed") === "on",
    },
    saturday: {
      open: formData.get("saturdayOpen")?.toString() || null,
      close: formData.get("saturdayClose")?.toString() || null,
      closed: formData.get("saturdayClosed") === "on",
    },
    sunday: {
      open: formData.get("sundayOpen")?.toString() || null,
      close: formData.get("sundayClose")?.toString() || null,
      closed: formData.get("sundayClosed") === "on",
    },
  }

  try {
    const { error } = await supabase
      .from("stores")
      .update({
        operating_hours: operatingHours,
        updated_at: new Date().toISOString(),
      })
      .eq("id", storeId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/store")
    return { success: "Operating hours updated successfully!" }
  } catch (error) {
    console.error("Store hours update error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}
