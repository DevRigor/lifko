"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ThemeToggleProps = {
  className?: string
  iconClassName?: string
}

export function ThemeToggle({ className, iconClassName }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={cn("w-9 h-9", className)}>
        <Sun className={cn("w-4 h-4", iconClassName)} />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn("w-9 h-9", className)}
      aria-label={theme === "dark" ? "Cambiar a modo dia" : "Cambiar a modo noche"}
    >
      {theme === "dark" ? (
        <Sun className={cn("w-4 h-4", iconClassName)} />
      ) : (
        <Moon className={cn("w-4 h-4", iconClassName)} />
      )}
    </Button>
  )
}
