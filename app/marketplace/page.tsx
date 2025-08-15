"use client"

import { useState, useEffect } from "react"
import MarketplaceHeader from "@/components/marketplace/header"
import CategoryFilter from "@/components/marketplace/category-filter"
import StoreGrid from "@/components/marketplace/store-grid"
import AdvancedFilters, { type FilterState } from "@/components/marketplace/advanced-filters"
import LocationSelector from "@/components/marketplace/location-selector"
import { getFilteredStores } from "@/lib/marketplace-actions"
import type { Coordinates } from "@/lib/location-utils"

export default function MarketplacePage() {
  const [stores, setStores] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<Coordinates | undefined>()
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    categoryId: "",
    minRating: 0,
    maxDistance: 10,
    maxDeliveryTime: 60,
    freeDelivery: false,
    sortBy: "distance",
  })

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  // Apply filters when they change
  useEffect(() => {
    applyFilters()
  }, [filters, userLocation])

  const loadInitialData = async () => {
    try {
      // This would be replaced with actual API calls
      const mockCategories = [
        { id: "1", name: "Pizza", icon: "🍕" },
        { id: "2", name: "Hambúrguer", icon: "🍔" },
        { id: "3", name: "Japonesa", icon: "🍣" },
        { id: "4", name: "Italiana", icon: "🍝" },
        { id: "5", name: "Brasileira", icon: "🇧🇷" },
      ]
      setCategories(mockCategories)

      // Load user addresses (would need user context)
      // const addresses = await getUserAddresses(userId)
      // setSavedAddresses(addresses)
    } catch (error) {
      console.error("Error loading initial data:", error)
    }
  }

  const applyFilters = async () => {
    setLoading(true)
    try {
      const filteredStores = await getFilteredStores({
        ...filters,
        userLocation,
      })
      setStores(filteredStores)
    } catch (error) {
      console.error("Error applying filters:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLocationChange = (location: Coordinates, address?: any) => {
    setUserLocation(location)
    // If no location-based sorting is set, default to distance
    if (!filters.sortBy || filters.sortBy === "rating") {
      setFilters((prev) => ({ ...prev, sortBy: "distance" }))
    }
  }

  const handleCategoryChange = (categoryId: string | null) => {
    setFilters((prev) => ({ ...prev, categoryId: categoryId || "" }))
  }

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader cartItemsCount={0} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <LocationSelector
              currentLocation={userLocation}
              savedAddresses={savedAddresses}
              onLocationChange={handleLocationChange}
              onAddressAdd={() => {
                // Handle add address - could open a modal or navigate to address form
                console.log("Add address clicked")
              }}
            />

            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
              userLocation={userLocation}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {userLocation ? "Restaurantes próximos" : "Restaurantes disponíveis"}
              </h1>
              <p className="text-muted-foreground">
                {userLocation
                  ? "Descubra sabores incríveis na sua região"
                  : "Defina sua localização para ver opções de entrega"}
              </p>
            </div>

            <CategoryFilter
              categories={categories}
              selectedCategory={filters.categoryId}
              onCategoryChange={handleCategoryChange}
            />

            <StoreGrid stores={stores} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  )
}

// Helper function for category icons
function getCategoryIcon(categoryName: string): string {
  const icons: Record<string, string> = {
    Pizza: "🍕",
    Hambúrguer: "🍔",
    Japonesa: "🍣",
    Italiana: "🍝",
    Brasileira: "🇧🇷",
    Mexicana: "🌮",
    Chinesa: "🥡",
    Doces: "🍰",
    Bebidas: "🥤",
    Saudável: "🥗",
  }
  return icons[categoryName] || "🍽️"
}
