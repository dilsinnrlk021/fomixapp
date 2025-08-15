import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import StoreRegistrationForm from "@/components/store/store-registration-form"

export default async function StoreRegisterPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is a store owner
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "store_owner") {
    redirect("/")
  }

  // Check if user already has a store
  const { data: existingStore } = await supabase.from("stores").select("id").eq("owner_id", user.id).single()
  if (existingStore) {
    redirect("/store/manage")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="container mx-auto">
        <StoreRegistrationForm />
      </div>
    </div>
  )
}
