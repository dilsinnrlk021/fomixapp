"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Tag } from "lucide-react"
import { createCategory, toggleCategoryStatus } from "@/lib/admin-actions"
import { useTransition } from "react"
import { toast } from "@/hooks/use-toast"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="bg-orange-500 hover:bg-orange-600">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Criando...
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Criar categoria
        </>
      )}
    </Button>
  )
}

interface Category {
  id: string
  name: string
  description: string
  is_active: boolean
  created_at: string
}

interface CategoryManagementProps {
  categories: Category[]
}

export default function CategoryManagement({ categories }: CategoryManagementProps) {
  const [state, formAction] = useActionState(createCategory, null)
  const [isPending, startTransition] = useTransition()

  const handleToggleStatus = (categoryId: string, isActive: boolean) => {
    startTransition(async () => {
      const result = await toggleCategoryStatus(categoryId, !isActive)
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

  return (
    <div className="space-y-6">
      {/* Create Category Form */}
      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Categoria</CardTitle>
          <CardDescription>Adicione uma nova categoria de comida à plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{state.error}</div>
            )}

            {state?.success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {state.success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome da categoria *
                </label>
                <Input id="name" name="name" placeholder="Ex: Pizza, Hambúrguer" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <Textarea id="description" name="description" placeholder="Descrição da categoria" rows={3} />
              </div>
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias Existentes</CardTitle>
          <CardDescription>{categories.length} categoria(s) cadastrada(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                    <Tag className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{category.name}</h4>
                    {category.description && <p className="text-sm text-gray-600">{category.description}</p>}
                    <p className="text-xs text-gray-500">
                      Criada em {new Date(category.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={category.is_active ? "default" : "secondary"}>
                    {category.is_active ? "Ativa" : "Inativa"}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <label htmlFor={`toggle-${category.id}`} className="text-sm">
                      {category.is_active ? "Desativar" : "Ativar"}
                    </label>
                    <Switch
                      id={`toggle-${category.id}`}
                      checked={category.is_active}
                      onCheckedChange={() => handleToggleStatus(category.id, category.is_active)}
                      disabled={isPending}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
