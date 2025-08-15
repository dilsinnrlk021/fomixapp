import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, DollarSign, Plus } from "lucide-react"
import MarketplaceHeader from "@/components/marketplace/header"
import { useCart } from "@/lib/cart-context"

interface StorePageProps {
  params: {
    id: string
  }
}

function ProductCard({
  product,
  storeName,
  storeId,
}: {
  product: any
  storeName: string
  storeId: string
}) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.image_url || "/placeholder.svg?height=200&width=300&query=delicious food dish"}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {product.original_price && product.original_price > product.price && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">Promoção</Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-card-foreground">{product.name}</h3>
            {product.description && <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">R$ {product.price.toFixed(2)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  R$ {product.original_price.toFixed(2)}
                </span>
              )}
            </div>
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                store_id: storeId,
                store_name: storeName,
                image_url: product.image_url,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
;("use client")
function AddToCartButton({ product }: { product: any }) {
  const { dispatch } = useCart()

  const addToCart = () => {
    dispatch({ type: "ADD_ITEM", payload: product })
  }

  return (
    <Button size="sm" onClick={addToCart} className="bg-primary hover:bg-primary/90 text-primary-foreground">
      <Plus className="h-4 w-4 mr-1" />
      Adicionar
    </Button>
  )
}

export default async function StorePage({ params }: StorePageProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get store details
  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("id", params.id)
    .eq("status", "approved")
    .eq("is_active", true)
    .single()

  if (!store) {
    notFound()
  }

  // Get store products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", params.id)
    .eq("is_available", true)
    .order("name")

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader cartItemsCount={0} />

      <main className="container mx-auto px-4 py-8">
        {/* Store Header */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-lg mb-6">
            <img
              src={store.cover_url || "/placeholder.svg?height=300&width=1200&query=restaurant interior"}
              alt={store.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{store.name}</h1>
              <p className="text-lg opacity-90">{store.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{store.rating?.toFixed(1) || "0.0"}</span>
                  <span className="text-muted-foreground">({store.total_reviews || 0} avaliações)</span>
                </div>
                <p className="text-sm text-muted-foreground">Avaliação dos clientes</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">
                    {store.delivery_time_min}-{store.delivery_time_max} min
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Tempo de entrega</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">
                    {store.delivery_fee === 0 ? "Grátis" : `R$ ${store.delivery_fee?.toFixed(2)}`}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Taxa de entrega • Mín. R$ {store.minimum_order?.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Products */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Cardápio</h2>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} storeName={store.name} storeId={store.id} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Cardápio em breve</h3>
              <p className="text-muted-foreground">Este restaurante ainda está organizando seu cardápio.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
