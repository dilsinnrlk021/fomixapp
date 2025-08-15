"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Store, MapPin, Phone, Mail, Clock, DollarSign } from "lucide-react"
import { createStore } from "@/lib/store-actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg font-medium rounded-lg h-[60px]"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cadastrando loja...
        </>
      ) : (
        "Cadastrar loja"
      )}
    </Button>
  )
}

export default function StoreRegistrationForm() {
  const [state, formAction] = useActionState(createStore, null)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cadastre sua loja</h1>
        <p className="text-xl text-gray-600">
          Preencha as informações abaixo para começar a vender na nossa plataforma
        </p>
      </div>

      <form action={formAction} className="space-y-8">
        {state?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{state.error}</div>
        )}

        {state?.success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{state.success}</div>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Informações básicas
            </CardTitle>
            <CardDescription>Dados principais da sua loja</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome da loja *
                </label>
                <Input id="name" name="name" placeholder="Ex: Pizzaria do João" required className="h-12" />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Telefone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    required
                    className="pl-10 h-12"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email da loja
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contato@pizzariadojoao.com"
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição da loja *
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descreva sua loja, especialidades, diferenciais..."
                required
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço
            </CardTitle>
            <CardDescription>Localização da sua loja</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  Rua *
                </label>
                <Input id="street" name="street" placeholder="Rua das Flores" required className="h-12" />
              </div>
              <div className="space-y-2">
                <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                  Número *
                </label>
                <Input id="number" name="number" placeholder="123" required className="h-12" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="complement" className="block text-sm font-medium text-gray-700">
                  Complemento
                </label>
                <Input id="complement" name="complement" placeholder="Apto 45, Bloco B" className="h-12" />
              </div>
              <div className="space-y-2">
                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
                  Bairro *
                </label>
                <Input id="neighborhood" name="neighborhood" placeholder="Centro" required className="h-12" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Cidade *
                </label>
                <Input id="city" name="city" placeholder="São Paulo" required className="h-12" />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  Estado *
                </label>
                <Input id="state" name="state" placeholder="SP" required className="h-12" />
              </div>
              <div className="space-y-2">
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  CEP *
                </label>
                <Input id="zipCode" name="zipCode" placeholder="01234-567" required className="h-12" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Configurações de negócio
            </CardTitle>
            <CardDescription>Defina taxas, tempo de entrega e área de cobertura</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="deliveryFee" className="block text-sm font-medium text-gray-700">
                  Taxa de entrega (R$)
                </label>
                <Input
                  id="deliveryFee"
                  name="deliveryFee"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="5.00"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="minimumOrder" className="block text-sm font-medium text-gray-700">
                  Pedido mínimo (R$)
                </label>
                <Input
                  id="minimumOrder"
                  name="minimumOrder"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="20.00"
                  className="h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="deliveryTimeMin" className="block text-sm font-medium text-gray-700">
                  Tempo mínimo (min)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="deliveryTimeMin"
                    name="deliveryTimeMin"
                    type="number"
                    min="1"
                    placeholder="30"
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="deliveryTimeMax" className="block text-sm font-medium text-gray-700">
                  Tempo máximo (min)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="deliveryTimeMax"
                    name="deliveryTimeMax"
                    type="number"
                    min="1"
                    placeholder="60"
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="deliveryRadius" className="block text-sm font-medium text-gray-700">
                  Raio de entrega (km)
                </label>
                <Input
                  id="deliveryRadius"
                  name="deliveryRadius"
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="5.0"
                  className="h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <SubmitButton />
      </form>
    </div>
  )
}
