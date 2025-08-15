"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, DollarSign, Check, X } from "lucide-react"
import { approveStore, rejectStore } from "@/lib/admin-actions"
import { useTransition } from "react"
import { toast } from "@/hooks/use-toast"

interface Store {
  id: string
  name: string
  description: string
  phone: string
  email: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  delivery_fee: number
  minimum_order: number
  delivery_time_min: number
  delivery_time_max: number
  created_at: string
  profiles: {
    full_name: string
    email: string
  }
}

interface PendingStoresProps {
  stores: Store[]
}

export default function PendingStores({ stores }: PendingStoresProps) {
  const [isPending, startTransition] = useTransition()

  const handleApprove = (storeId: string) => {
    startTransition(async () => {
      const result = await approveStore(storeId)
      if (result.success) {
        toast({
          title: "Sucesso",
          description: result.success,
        })
      } else {
        toast({
          title: "Erro",
          description: result.error,
          variant: "destructive",
        })
      }
    })
  }

  const handleReject = (storeId: string) => {
    startTransition(async () => {
      const result = await rejectStore(storeId)
      if (result.success) {
        toast({
          title: "Sucesso",
          description: result.success,
        })
      } else {
        toast({
          title: "Erro",
          description: result.error,
          variant: "destructive",
        })
      }
    })
  }

  if (stores.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lojas Pendentes</CardTitle>
          <CardDescription>Nenhuma loja aguardando aprovação</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lojas Pendentes</CardTitle>
        <CardDescription>{stores.length} loja(s) aguardando aprovação</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stores.map((store) => (
            <div key={store.id} className="border rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{store.name}</h3>
                  <p className="text-gray-600 mt-1">{store.description}</p>
                  <Badge variant="secondary" className="mt-2">
                    Proprietário: {store.profiles.full_name}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(store.id)}
                    disabled={isPending}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(store.id)} disabled={isPending}>
                    <X className="h-4 w-4 mr-1" />
                    Rejeitar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
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
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      Taxa: R$ {store.delivery_fee.toFixed(2)} | Mínimo: R$ {store.minimum_order.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      Entrega: {store.delivery_time_min}-{store.delivery_time_max} min
                    </span>
                  </div>
                  <div className="text-gray-500">
                    Cadastrado em: {new Date(store.created_at).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
