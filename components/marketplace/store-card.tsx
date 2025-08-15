import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, DollarSign } from "lucide-react"
import Link from "next/link"

interface Store {
  id: string
  name: string
  description: string
  image_url?: string
  rating: number
  total_reviews: number
  delivery_time_min: number
  delivery_time_max: number
  delivery_fee: number
  minimum_order: number
}

interface StoreCardProps {
  store: Store
}

export default function StoreCard({ store }: StoreCardProps) {
  return (
    <Link href={`/marketplace/store/${store.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-card border-border">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={store.image_url || "/placeholder.svg?height=200&width=400&query=restaurant food"}
            alt={store.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {store.delivery_fee === 0 && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">Entrega grátis</Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              {store.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{store.description}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{store.rating.toFixed(1)}</span>
                <span>({store.total_reviews})</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {store.delivery_time_min}-{store.delivery_time_max} min
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {store.delivery_fee === 0 ? "Grátis" : `R$ ${store.delivery_fee.toFixed(2)}`}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Mín. R$ {store.minimum_order.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
