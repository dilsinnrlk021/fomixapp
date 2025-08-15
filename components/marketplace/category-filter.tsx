"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface Category {
  id: string
  name: string
  icon: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory?: string
  onCategoryChange?: (categoryId: string | null) => void
}

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(selectedCategory || null)

  const handleCategoryClick = (categoryId: string) => {
    const newCategory = activeCategory === categoryId ? null : categoryId
    setActiveCategory(newCategory)
    onCategoryChange?.(newCategory)
  }

  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick("")}
              className={
                activeCategory === null
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-background hover:bg-accent hover:text-accent-foreground"
              }
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(category.id)}
                className={
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-background hover:bg-accent hover:text-accent-foreground"
                }
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}
