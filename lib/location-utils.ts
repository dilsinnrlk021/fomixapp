// Utility functions for location-based calculations

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Address {
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  latitude?: number
  longitude?: number
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(coord2.latitude - coord1.latitude)
  const dLon = toRadians(coord2.longitude - coord1.longitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) *
      Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Mock geocoding function (in production, use Google Maps API or similar)
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  // This is a mock implementation
  // In production, you would use a real geocoding service
  const mockCoordinates: Record<string, Coordinates> = {
    "São Paulo, SP": { latitude: -23.5505, longitude: -46.6333 },
    "Rio de Janeiro, RJ": { latitude: -22.9068, longitude: -43.1729 },
    "Belo Horizonte, MG": { latitude: -19.9167, longitude: -43.9345 },
    "Salvador, BA": { latitude: -12.9714, longitude: -38.5014 },
    "Brasília, DF": { latitude: -15.7942, longitude: -47.8822 },
  }

  return mockCoordinates[address] || { latitude: -23.5505, longitude: -46.6333 }
}

// Get user's current location
export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        // Fallback to São Paulo coordinates
        resolve({ latitude: -23.5505, longitude: -46.6333 })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  })
}
