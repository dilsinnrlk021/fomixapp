import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createOrder } from "@/lib/order-actions"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function CheckoutPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user addresses
  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Finalizar Pedido</h1>
        </div>

        <form action={createOrder} className="space-y-6">
          {/* Address Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Endereço de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              {addresses && addresses.length > 0 ? (
                <Select name="address_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um endereço" />
                  </SelectTrigger>
                  <SelectContent>
                    {addresses.map((address) => (
                      <SelectItem key={address.id} value={address.id}>
                        <div>
                          <div className="font-medium">
                            {address.street}, {address.number}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {address.neighborhood}, {address.city} - {address.state}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">Você não tem endereços cadastrados</p>
                  <Link href="/profile/addresses">
                    <Button variant="outline">Cadastrar Endereço</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Forma de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup name="payment_method" defaultValue="pix" required>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix">PIX</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card">Cartão de Crédito</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="debit_card" id="debit_card" />
                  <Label htmlFor="debit_card">Cartão de Débito</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Dinheiro</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div id="order-summary" className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ 0,00</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de entrega:</span>
                  <span>R$ 0,00</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>R$ 0,00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" size="lg">
            Confirmar Pedido
          </Button>
        </form>
      </div>
    </div>
  )
}
