"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Clock } from "lucide-react"
import { updateStoreHours } from "@/lib/store-actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-medium rounded-lg"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Salvando...
        </>
      ) : (
        "Salvar horários"
      )}
    </Button>
  )
}

interface OperatingHoursFormProps {
  storeId: string
  operatingHours?: any
}

export default function OperatingHoursForm({ storeId, operatingHours }: OperatingHoursFormProps) {
  const [state, formAction] = useActionState(updateStoreHours, null)

  const days = [
    { key: "monday", label: "Segunda-feira" },
    { key: "tuesday", label: "Terça-feira" },
    { key: "wednesday", label: "Quarta-feira" },
    { key: "thursday", label: "Quinta-feira" },
    { key: "friday", label: "Sexta-feira" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Horários de funcionamento
        </CardTitle>
        <CardDescription>Configure os horários de abertura e fechamento da sua loja</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="storeId" value={storeId} />

          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{state.error}</div>
          )}

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {state.success}
            </div>
          )}

          <div className="space-y-4">
            {days.map((day) => {
              const dayData = operatingHours?.[day.key] || {}
              return (
                <div key={day.key} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-32">
                    <label className="text-sm font-medium text-gray-700">{day.label}</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      name={`${day.key}Closed`}
                      defaultChecked={dayData.closed}
                      className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                    <label className="text-sm text-gray-600">Fechado</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Abre:</label>
                    <Input
                      name={`${day.key}Open`}
                      type="time"
                      defaultValue={dayData.open || "09:00"}
                      className="w-32"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Fecha:</label>
                    <Input
                      name={`${day.key}Close`}
                      type="time"
                      defaultValue={dayData.close || "22:00"}
                      className="w-32"
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
