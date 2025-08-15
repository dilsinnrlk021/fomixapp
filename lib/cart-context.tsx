"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  store_id: string
  store_name: string
  image_url?: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
        return calculateTotals({ ...state, items: updatedItems })
      }

      const newItems = [...state.items, { ...action.payload, quantity: 1 }]
      return calculateTotals({ ...state, items: newItems })
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      return calculateTotals({ ...state, items: newItems })
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity === 0) {
        const newItems = state.items.filter((item) => item.id !== action.payload.id)
        return calculateTotals({ ...state, items: newItems })
      }

      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )
      return calculateTotals({ ...state, items: updatedItems })
    }

    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0 }

    default:
      return state
  }
}

function calculateTotals(state: CartState): CartState {
  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
  return { ...state, total, itemCount }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  })

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
