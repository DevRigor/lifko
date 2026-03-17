"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ScrollLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: `#${string}`
  offset?: number
}

export const ScrollLink = React.forwardRef<HTMLAnchorElement, ScrollLinkProps>(
  ({ href, offset = 80, className, onClick, ...props }, ref) => {
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return

      const target = document.getElementById(href.slice(1))
      if (!target) return

      event.preventDefault()

      const nextUrl = `${window.location.pathname}${window.location.search}${href}`
      window.history.replaceState(null, "", nextUrl)

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: "smooth",
      })
    }

    return (
      <a
        ref={ref}
        href={href}
        onClick={handleClick}
        className={cn(className)}
        {...props}
      />
    )
  }
)

ScrollLink.displayName = "ScrollLink"
