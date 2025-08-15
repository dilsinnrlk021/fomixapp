"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation, Plus } from "lucide-react"
import { getCurrentLocation, geocodeAddress, type Coordinates } from "@/lib/location-utils"
import { toast } from "@/hooks/use-toast"

interface Address {
  id?: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  latitude?: number
  longitude?: number
  isDefault?: boolean
}

interface LocationSelectorProps {
  currentLocation?: Coordinates
  savedAddresses?: Address[]
  onLocationChange: (location: Coordinates, address?: Address) => void
  onAddressAdd?: () => void
}

export default function LocationSelector({
  currentLocation,
  savedAddresses = [],
  onLocationChange,
  onAddressAdd,
}: LocationSelectorProps) {
  const [isDetecting, setIsDetecting] = useState(false)
  const [searchAddress, setSearchAddress] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleDetectLocation = async () => {
    setIsDetecting(true)
    try {
      const location = await getCurrentLocation()
      onLocationChange(location)
      toast({
        title: "Localização detectada",
        description: "Sua localização foi atualizada com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro ao detectar localização",
        description: "Não foi possível acessar sua localização. Verifique as permissões do navegador.",
        variant: "destructive",
      })
    } finally {
      setIsDetecting(false)
    }
  }

  const handleSearchAddress = async () => {
    if (!searchAddress.trim()) return

    setIsSearching(true)
    try {
      const location = await geocodeAddress(searchAddress)
      if (location) {
        onLocationChange(location)
        toast({
          title: "Endereço encontrado",
          description: `Localização atualizada para: ${searchAddress}`,
        })
        setSearchAddress("")
      } else {
        toast({
          title: "Endereço não encontrado",
          description: "Não foi possível encontrar este endereço. Tente ser mais específico.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar o endereço. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleSavedAddressSelect = (address: Address) => {
    if (address.latitude && address.longitude) {
      onLocationChange({ latitude: address.latitude, longitude: address.longitude }, address)
      toast({
        title: "Endereço selecionado",
        description: `${address.street}, ${address.number} - ${address.neighborhood}`,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Sua Localização
        </CardTitle>
        <CardDescription>
          {currentLocation
            ? "Localização atual detectada. Mostrando restaurantes próximos."
            : "Defina sua localização para ver restaurantes que entregam na sua região."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Location Status */}
        {currentLocation && (
          <div className="p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-2 text-sm text-secondary-foreground">
              <Navigation className="h-4 w-4" />
              <span>
                Localização: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </span>
            </div>
          </div>
        )}

        {/* Detect Current Location */}
        <Button
          onClick={handleDetectLocation}
          disabled={isDetecting}
          variant="outline"
          className="w-full bg-background"
        >
          <Navigation className="h-4 w-4 mr-2" />
          {isDetecting ? "Detectando..." : "Usar minha localização atual"}
        </Button>

        {/* Search Address */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Digite um endereço ou cidade..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearchAddress()}
            />
            <Button onClick={handleSearchAddress} disabled={isSearching || !searchAddress.trim()}>
              {isSearching ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </div>

        {/* Saved Addresses */}
        {savedAddresses.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Endereços salvos:</h4>
            <div className="space-y-2">
              {savedAddresses.map((address) => (
                <Button
                  key={address.id}
                  variant="outline"
                  className="w-full justify-start h-auto p-3 bg-background"
                  onClick={() => handleSavedAddressSelect(address)}
                >
                  <div className="text-left">
                    <div className="font-medium">
                      {address.street}, {address.number}
                      {address.isDefault && <span className="ml-2 text-xs text-primary">(Padrão)</span>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {address.neighborhood}, {address.city} - {address.state}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Add New Address */}
        {onAddressAdd && (
          <Button variant="outline" onClick={onAddressAdd} className="w-full bg-background">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar novo endereço
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
