import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Package } from "lucide-react"
import Link from "next/link"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  ready: "bg-purple-100 text-purple-800",
  delivering: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusLabels = {
  pending: "Pendente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  ready: "Pronto",
  delivering: "Saiu para entrega",
  delivered: "Entregue",
  cancelled: "Cancelado",
}

export default async function OrdersPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user orders with store and address info
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      stores (name, logo_url),
      addresses (street, number, neighborhood, city, state),
      order_items (
        quantity,
        price,
        products (name, image_url)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Meus Pedidos</h1>
          <Link href="/marketplace">
            <Button variant="outline">Fazer Novo Pedido</Button>
          </Link>
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.stores?.logo_url || "/placeholder.svg?height=40&width=40&query=restaurant logo"}
                        alt={order.stores?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <CardTitle className="text-lg">{order.stores?.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">Pedido #{order.id.slice(-8)}</p>
                      </div>
                    </div>
                    <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                      {statusLabels[order.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.order_items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <img
                          src={item.products?.image_url || "/placeholder.svg?height=32&width=32&query=food"}
                          alt={item.products?.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <span className="flex-1">
                          {item.quantity}x {item.products?.name}
                        </span>
                        <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Info */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(order.created_at).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {order.addresses?.neighborhood}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {order.payment_method === "pix"
                          ? "PIX"
                          : order.payment_method === "credit_card"
                            ? "Cartão de Crédito"
                            : order.payment_method === "debit_card"
                              ? "Cartão de Débito"
                              : "Dinheiro"}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-primary">R$ {order.total_amount.toFixed(2)}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h3>
            <p className="text-muted-foreground mb-6">
              Você ainda não fez nenhum pedido. Que tal explorar nossos restaurantes?
            </p>
            <Link href="/marketplace">
              <Button>Explorar Restaurantes</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
