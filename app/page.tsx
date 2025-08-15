import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Store, ShoppingBag, Settings, Shield } from "lucide-react"
import { signOut } from "@/lib/actions"
import Link from "next/link"

export default async function Home() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-card rounded-lg shadow-sm p-6 mb-8 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Olá, {profile?.full_name || user.email}!</h1>
                <p className="text-muted-foreground mt-1">Bem-vindo ao seu marketplace de delivery</p>
                <span className="inline-block mt-2 px-3 py-1 bg-secondary text-secondary-foreground text-sm font-medium rounded-full">
                  {profile?.role === "customer"
                    ? "Cliente"
                    : profile?.role === "store_owner"
                      ? "Dono de loja"
                      : profile?.role === "admin"
                        ? "Administrador"
                        : "Usuário"}
                </span>
              </div>
              <form action={signOut}>
                <Button type="submit" variant="outline" className="flex items-center gap-2 bg-transparent">
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </form>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-semibold">Fazer pedido</h2>
              </div>
              <p className="text-muted-foreground mb-4">Explore restaurantes e faça seu pedido</p>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/marketplace">Ver restaurantes</Link>
              </Button>
            </div>

            {profile?.role === "store_owner" && (
              <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <Store className="h-8 w-8 text-accent" />
                  <h2 className="text-xl font-semibold">Minha loja</h2>
                </div>
                <p className="text-muted-foreground mb-4">Gerencie sua loja e produtos</p>
                <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/store/manage">Gerenciar loja</Link>
                </Button>
              </div>
            )}

            {profile?.role === "admin" && (
              <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-destructive" />
                  <h2 className="text-xl font-semibold">Painel Admin</h2>
                </div>
                <p className="text-muted-foreground mb-4">Gerencie a plataforma</p>
                <Button asChild className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                  <Link href="/admin">Acessar painel</Link>
                </Button>
              </div>
            )}

            <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="h-8 w-8 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Configurações</h2>
              </div>
              <p className="text-muted-foreground mb-4">Atualize seu perfil e preferências</p>
              <Button variant="outline" className="w-full bg-transparent">
                Configurar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
