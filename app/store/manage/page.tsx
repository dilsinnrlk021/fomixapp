import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Store, MapPin, Phone, Mail, Clock, DollarSign, Star, Package } from "lucide-react"
import Link from "next/link"
import OperatingHoursForm from "@/components/store/operating-hours-form"

export default async function StoreManagePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's store
  const { data: store } = await supabase.from("stores").select("*").eq("owner_id", user.id).single()

  if (!store) {
    redirect("/store/register")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "suspended":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprovada"
      case "pending":
        return "Pendente"
      case "rejected":
        return "Rejeitada"
      case "suspended":
        return "Suspensa"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gerenciar loja</h1>
          <p className="text-xl text-gray-600">Administre sua loja e configurações</p>
        </div>

        {/* Store Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Store className="h-6 w-6" />
                <div>
                  <CardTitle>{store.name}</CardTitle>
                  <CardDescription>Status da loja</CardDescription>
                </div>
              </div>
              <Badge className={getStatusColor(store.status)}>{getStatusText(store.status)}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {store.status === "pending" && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                Sua loja está sendo analisada pela nossa equipe. Você será notificado quando for aprovada.
              </div>
            )}
            {store.status === "rejected" && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                Sua loja foi rejeitada. Entre em contato com o suporte para mais informações.
              </div>
            )}
            {store.status === "approved" && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                Parabéns! Sua loja está aprovada e ativa na plataforma.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Store Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Informações da loja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{store.name}</h3>
                <p className="text-gray-600 mt-1">{store.description}</p>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {store.street}, {store.number} - {store.neighborhood}, {store.city}/{store.state}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{store.phone}</span>
              </div>

              {store.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{store.email}</span>
                </div>
              )}

              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{store.rating || "0.0"}</span>
                  <span className="text-gray-500">({store.total_reviews || 0} avaliações)</span>
                </div>
              </div>

              <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                <Link href="/store/edit">Editar informações</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Business Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Configurações de negócio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Taxa de entrega</label>
                  <p className="text-lg font-semibold">R$ {store.delivery_fee?.toFixed(2) || "0.00"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Pedido mínimo</label>
                  <p className="text-lg font-semibold">R$ {store.minimum_order?.toFixed(2) || "0.00"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Tempo de entrega</label>
                  <p className="text-lg font-semibold">
                    {store.delivery_time_min}-{store.delivery_time_max} min
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Raio de entrega</label>
                  <p className="text-lg font-semibold">{store.delivery_radius_km} km</p>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/store/edit">Editar configurações</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Operating Hours */}
        <OperatingHoursForm storeId={store.id} operatingHours={store.operating_hours} />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Produtos</h3>
              <p className="text-gray-600 mb-4">Gerencie seu cardápio</p>
              <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                <Link href="/store/products">Ver produtos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Pedidos</h3>
              <p className="text-gray-600 mb-4">Acompanhe seus pedidos</p>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/store/orders">Ver pedidos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Avaliações</h3>
              <p className="text-gray-600 mb-4">Veja o feedback dos clientes</p>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/store/reviews">Ver avaliações</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
