import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminStats from "@/components/admin/admin-stats"
import PendingStores from "@/components/admin/pending-stores"
import UserManagement from "@/components/admin/user-management"
import CategoryManagement from "@/components/admin/category-management"
import { Shield, Store, Users, Tag, BarChart3 } from "lucide-react"

export default async function AdminPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") {
    redirect("/")
  }

  // Get statistics
  const [
    { count: totalStores },
    { count: pendingStores },
    { count: totalUsers },
    { count: totalOrders },
    { data: avgRating },
  ] = await Promise.all([
    supabase.from("stores").select("*", { count: "exact", head: true }),
    supabase.from("stores").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("stores").select("rating").not("rating", "is", null),
  ])

  const averageRating = avgRating?.length
    ? avgRating.reduce((sum, store) => sum + (store.rating || 0), 0) / avgRating.length
    : 0

  const stats = {
    totalStores: totalStores || 0,
    pendingStores: pendingStores || 0,
    totalUsers: totalUsers || 0,
    totalOrders: totalOrders || 0,
    averageRating,
  }

  // Get pending stores
  const { data: pendingStoresData } = await supabase
    .from("stores")
    .select(
      `
      *,
      profiles!stores_owner_id_fkey (
        full_name,
        email
      )
    `,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  // Get all users
  const { data: usersData } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  // Get categories
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-gray-600 mt-1">Gerencie a plataforma de delivery</p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <AdminStats stats={stats} />

          {/* Admin Tabs */}
          <Tabs defaultValue="stores" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="stores" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Lojas
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Categorias
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Relatórios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stores">
              <PendingStores stores={pendingStoresData || []} />
            </TabsContent>

            <TabsContent value="users">
              <UserManagement users={usersData || []} />
            </TabsContent>

            <TabsContent value="categories">
              <CategoryManagement categories={categoriesData || []} />
            </TabsContent>

            <TabsContent value="analytics">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Relatórios e Analytics</h3>
                <p className="text-gray-600">Funcionalidade de relatórios em desenvolvimento...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
