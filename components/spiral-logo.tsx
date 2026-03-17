export function SpiralLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Spiral logo - light blue/cyan color */}
      <defs>
        <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="50%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <path
        d="M50 10
           C70 10, 90 30, 90 50
           C90 70, 70 90, 50 90
           C30 90, 15 75, 15 55
           C15 40, 27 25, 45 25
           C58 25, 70 35, 70 50
           C70 62, 60 72, 48 72
           C38 72, 30 64, 30 54
           C30 46, 37 40, 47 40
           C54 40, 60 46, 60 53
           C60 58, 55 62, 50 62"
        stroke="url(#spiralGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner water drop accent */}
      <circle cx="50" cy="53" r="4" fill="url(#spiralGradient)" />
    </svg>
  )
}
