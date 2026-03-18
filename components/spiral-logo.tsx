import Image from "next/image"

export function SpiralLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src="/Logo.svg"
        alt="Logo de LIFKO SPA"
        fill
        sizes="64px"
        className="object-contain"
        priority
      />
    </div>
  )
}
