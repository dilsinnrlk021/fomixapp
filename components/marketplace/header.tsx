"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Search, User, MapPin } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  cartItemsCount?: number
  userLocation?: string
}

export default function MarketplaceHeader({ cartItemsCount = 0, userLocation = "São Paulo, SP" }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/marketplace" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-bold text-foreground">DeliveryApp</span>
          </Link>

          {/* Location */}
          <div className="hidden md:flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{userLocation}</span>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile">
                <User className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-4 w-4" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pb-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Busque por restaurantes ou pratos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-input border-border focus:ring-ring"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
