interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 28, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <rect width="32" height="32" rx="7" fill="#0969da" />
      {/* Angle brackets: < > */}
      <path d="M13 10L8 16L13 22" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 10L24 16L19 22" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Center dot: the agent */}
      <circle cx="16" cy="16" r="2" fill="white" />
    </svg>
  )
}
