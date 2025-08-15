"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter, X, MapPin, Star, Clock, DollarSign } from "lucide-react"

export interface FilterState {
  searchQuery: string
  categoryId: string
  minRating: number
  maxDistance: number
  maxDeliveryTime: number
  freeDelivery: boolean
  sortBy: string
}

interface AdvancedFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  categories: Array<{ id: string; name: string }>
  userLocation?: { latitude: number; longitude: number }
}

export default function AdvancedFilters({ filters, onFiltersChange, categories, userLocation }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: "",
      categoryId: "",
      minRating: 0,
      maxDistance: 10,
      maxDeliveryTime: 60,
      freeDelivery: false,
      sortBy: "distance",
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.searchQuery) count++
    if (filters.categoryId) count++
    if (filters.minRating > 0) count++
    if (filters.maxDistance < 10) count++
    if (filters.maxDeliveryTime < 60) count++
    if (filters.freeDelivery) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 bg-background">
          <Filter className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            {userLocation && <SelectItem value="distance">Mais próximo</SelectItem>}
            <SelectItem value="rating">Melhor avaliado</SelectItem>
            <SelectItem value="delivery_time">Entrega mais rápida</SelectItem>
            <SelectItem value="delivery_fee">Menor taxa de entrega</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Busca: {filters.searchQuery}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("searchQuery", "")} />
            </Badge>
          )}
          {filters.categoryId && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {categories.find((c) => c.id === filters.categoryId)?.name}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("categoryId", "")} />
            </Badge>
          )}
          {filters.minRating > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {filters.minRating}+ estrelas
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("minRating", 0)} />
            </Badge>
          )}
          {filters.maxDistance < 10 && userLocation && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Até {filters.maxDistance}km
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("maxDistance", 10)} />
            </Badge>
          )}
          {filters.maxDeliveryTime < 60 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Até {filters.maxDeliveryTime}min
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("maxDeliveryTime", 60)} />
            </Badge>
          )}
          {filters.freeDelivery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Entrega grátis
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("freeDelivery", false)} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
            Limpar todos
          </Button>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros Avançados</CardTitle>
            <CardDescription>Refine sua busca para encontrar exatamente o que procura</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Buscar restaurantes ou pratos</Label>
              <Input
                id="search"
                placeholder="Digite o nome do restaurante ou prato..."
                value={filters.searchQuery}
                onChange={(e) => updateFilter("searchQuery", e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={filters.categoryId} onValueChange={(value) => updateFilter("categoryId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <Label>Avaliação mínima: {filters.minRating} estrelas</Label>
              <Slider
                value={[filters.minRating]}
                onValueChange={([value]) => updateFilter("minRating", value)}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Distance */}
            {userLocation && (
              <div className="space-y-3">
                <Label>Distância máxima: {filters.maxDistance}km</Label>
                <Slider
                  value={[filters.maxDistance]}
                  onValueChange={([value]) => updateFilter("maxDistance", value)}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {/* Delivery Time */}
            <div className="space-y-3">
              <Label>Tempo de entrega máximo: {filters.maxDeliveryTime} minutos</Label>
              <Slider
                value={[filters.maxDeliveryTime]}
                onValueChange={([value]) => updateFilter("maxDeliveryTime", value)}
                max={120}
                min={15}
                step={5}
                className="w-full"
              />
            </div>

            {/* Free Delivery */}
            <div className="flex items-center space-x-2">
              <Switch
                id="free-delivery"
                checked={filters.freeDelivery}
                onCheckedChange={(checked) => updateFilter("freeDelivery", checked)}
              />
              <Label htmlFor="free-delivery">Apenas entrega grátis</Label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button onClick={() => setIsOpen(false)} className="flex-1 bg-primary hover:bg-primary/90">
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
