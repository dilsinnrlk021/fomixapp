"use server"

import { createClient } from "@/lib/supabase/server"
import { calculateDistance } from "./location-utils"

export interface FilterOptions {
  categoryId?: string
  searchQuery?: string
  userLocation?: { latitude: number; longitude: number }
  maxDistance?: number
  minRating?: number
  maxDeliveryTime?: number
  freeDelivery?: boolean
  sortBy?: "distance" | "rating" | "delivery_time" | "delivery_fee"
}

export async function getFilteredStores(filters: FilterOptions = {}) {
  const supabase = createClient()

  let query = supabase
    .from("stores")
    .select(`
      *,
      store_categories!inner(category_id),
      products(count)
    `)
    .eq("status", "approved")
    .eq("is_active", true)

  // Filter by category
  if (filters.categoryId) {
    query = query.eq("store_categories.category_id", filters.categoryId)
  }

  // Filter by minimum rating
  if (filters.minRating) {
    query = query.gte("rating", filters.minRating)
  }

  // Filter by maximum delivery time
  if (filters.maxDeliveryTime) {
    query = query.lte("delivery_time_max", filters.maxDeliveryTime)
  }

  // Filter by free delivery
  if (filters.freeDelivery) {
    query = query.eq("delivery_fee", 0)
  }

  const { data: stores, error } = await query

  if (error) {
    console.error("Error fetching stores:", error)
    return []
  }

  let filteredStores = stores || []

  // Filter by search query
  if (filters.searchQuery) {
    const searchLower = filters.searchQuery.toLowerCase()
    filteredStores = filteredStores.filter(
      (store) =>
        store.name.toLowerCase().includes(searchLower) || store.description.toLowerCase().includes(searchLower),
    )
  }

  // Calculate distances and filter by location
  if (filters.userLocation) {
    filteredStores = filteredStores
      .map((store) => {
        if (store.latitude && store.longitude) {
          const distance = calculateDistance(filters.userLocation!, {
            latitude: store.latitude,
            longitude: store.longitude,
          })
          return { ...store, distance }
        }
        return { ...store, distance: 999 } // Unknown distance
      })
      .filter((store) => {
        // Filter by delivery radius
        if (store.distance <= (store.delivery_radius_km || 5)) {
          // Also filter by max distance if specified
          return !filters.maxDistance || store.distance <= filters.maxDistance
        }
        return false
      })
  }

  // Sort results
  if (filters.sortBy) {
    filteredStores.sort((a, b) => {
      switch (filters.sortBy) {
        case "distance":
          return (a.distance || 999) - (b.distance || 999)
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "delivery_time":
          return (a.delivery_time_min || 60) - (b.delivery_time_min || 60)
        case "delivery_fee":
          return (a.delivery_fee || 999) - (b.delivery_fee || 999)
        default:
          return 0
      }
    })
  } else if (filters.userLocation) {
    // Default sort by distance when location is available
    filteredStores.sort((a, b) => (a.distance || 999) - (b.distance || 999))
  } else {
    // Default sort by rating
    filteredStores.sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }

  return filteredStores
}

export async function searchProducts(query: string, storeId?: string) {
  const supabase = createClient()

  let productQuery = supabase
    .from("products")
    .select(`
      *,
      stores!inner(id, name, status, is_active)
    `)
    .eq("is_available", true)
    .eq("stores.status", "approved")
    .eq("stores.is_active", true)
    .ilike("name", `%${query}%`)

  if (storeId) {
    productQuery = productQuery.eq("store_id", storeId)
  }

  const { data: products, error } = await productQuery.limit(20)

  if (error) {
    console.error("Error searching products:", error)
    return []
  }

  return products || []
}

export async function getUserAddresses(userId: string) {
  const supabase = createClient()

  const { data: addresses, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching addresses:", error)
    return []
  }

  return addresses || []
}

export async function saveUserAddress(prevState: any, formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const street = formData.get("street")
  const number = formData.get("number")
  const complement = formData.get("complement")
  const neighborhood = formData.get("neighborhood")
  const city = formData.get("city")
  const state = formData.get("state")
  const zipCode = formData.get("zipCode")
  const isDefault = formData.get("isDefault") === "on"

  if (!street || !number || !neighborhood || !city || !state || !zipCode) {
    return { error: "All required fields must be filled" }
  }

  try {
    // If this is set as default, unset other default addresses
    if (isDefault) {
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id)
    }

    const { error } = await supabase.from("addresses").insert({
      user_id: user.id,
      street: street.toString(),
      number: number.toString(),
      complement: complement?.toString() || null,
      neighborhood: neighborhood.toString(),
      city: city.toString(),
      state: state.toString(),
      zip_code: zipCode.toString(),
      is_default: isDefault,
    })

    if (error) {
      return { error: error.message }
    }

    return { success: "Address saved successfully!" }
  } catch (error) {
    console.error("Address save error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}
