"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function createOrder(formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const addressId = formData.get("address_id") as string
  const paymentMethod = formData.get("payment_method") as string
  const items = JSON.parse(formData.get("items") as string)
  const total = Number.parseFloat(formData.get("total") as string)
  const storeId = formData.get("store_id") as string

  try {
    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        store_id: storeId,
        address_id: addressId,
        total_amount: total,
        payment_method: paymentMethod,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) throw itemsError

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, error: "Erro ao criar pedido" }
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)

  if (error) {
    console.error("Error updating order status:", error)
    return { success: false, error: "Erro ao atualizar pedido" }
  }

  return { success: true }
}
