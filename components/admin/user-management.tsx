"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Calendar } from "lucide-react"
import { updateUserRole } from "@/lib/admin-actions"
import { useTransition } from "react"
import { toast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

interface UserManagementProps {
  users: UserProfile[]
}

export default function UserManagement({ users }: UserManagementProps) {
  const [isPending, startTransition] = useTransition()

  const handleRoleChange = (userId: string, newRole: string) => {
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole)
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "store_owner":
        return "bg-blue-100 text-blue-800"
      case "customer":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador"
      case "store_owner":
        return "Dono de loja"
      case "customer":
        return "Cliente"
      default:
        return role
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Usuários</CardTitle>
        <CardDescription>{users.length} usuário(s) registrado(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium">{user.full_name || "Nome não informado"}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>Cadastrado em {new Date(user.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge className={getRoleBadgeColor(user.role)}>{getRoleText(user.role)}</Badge>
                <Select
                  defaultValue={user.role}
                  onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Cliente</SelectItem>
                    <SelectItem value="store_owner">Dono de loja</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
