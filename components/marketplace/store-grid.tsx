import StoreCard from "./store-card"

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

interface StoreGridProps {
  stores: Store[]
  loading?: boolean
}

export default function StoreGrid({ stores, loading = false }: StoreGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg h-48 mb-4"></div>
            <div className="space-y-2">
              <div className="bg-muted h-4 rounded w-3/4"></div>
              <div className="bg-muted h-3 rounded w-full"></div>
              <div className="bg-muted h-3 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum restaurante encontrado</h3>
        <p className="text-muted-foreground">Tente ajustar os filtros ou buscar por outro termo.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stores.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))}
    </div>
  )
}
