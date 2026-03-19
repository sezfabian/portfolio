import type { CSSProperties, KeyboardEvent } from 'react'

interface MysteryGlyphProps {
  isDark: boolean
  onActivate: () => void
  size?: number
  style?: CSSProperties
  title?: string
}

export default function MysteryGlyph({
  isDark,
  onActivate,
  size = 72,
  style,
  title = 'Mystery'
}: MysteryGlyphProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onActivate()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Launch mystery game"
      onClick={onActivate}
      onKeyDown={handleKeyDown}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: isDark ? '#0f0' : '#00a',
        opacity: 0.9,
        transition: 'transform 0.2s ease, opacity 0.2s ease, filter 0.2s ease',
        filter: isDark
          ? 'drop-shadow(0 0 12px rgba(0, 255, 0, 0.25))'
          : 'drop-shadow(0 0 12px rgba(0, 0, 170, 0.15))',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.06) rotate(6deg)'
        e.currentTarget.style.opacity = '1'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
        e.currentTarget.style.opacity = '0.9'
      }}
      title={title}
    >
      <svg width={size} height={size} viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <circle cx="36" cy="36" r="26" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 5" opacity="0.45" />
        <circle cx="36" cy="36" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
        <path d="M36 18L41 31L54 36L41 41L36 54L31 41L18 36L31 31L36 18Z" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="36" cy="36" r="4" fill="currentColor" />
        <path d="M14 14L20 20M58 14L52 20M14 58L20 52M58 58L52 52" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      </svg>
    </div>
  )
}
