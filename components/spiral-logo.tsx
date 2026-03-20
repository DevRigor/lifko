import Image from "next/image"
import { assetUrl } from "@/lib/assets"

export function SpiralLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={assetUrl("/Logo.svg")}
        alt="Logo de LIFKO SPA"
        fill
        sizes="64px"
        className="object-contain"
        priority
      />
    </div>
  )
}
