import React, { useState } from 'react'
import { Star } from 'lucide-react'

export const Card: React.FC<{
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}> = ({ children, className = '', padding = 'md' }) => {
  const pad =
    padding === 'none'
      ? ''
      : padding === 'sm'
        ? 'p-4'
        : padding === 'lg'
          ? 'p-6'
          : 'p-5'
  return (
    <div
      className={`bg-white border border-[#E2DFD5] rounded-md shadow-[0_1px_2px_rgba(37,40,34,0.03)] ${pad} ${className}`}
    >
      {children}
    </div>
  )
}

export type BadgeTone = 'neutral' | 'sage' | 'forest' | 'terracotta'

export const Badge: React.FC<{
  children: React.ReactNode
  tone?: BadgeTone
  className?: string
}> = ({ children, tone = 'neutral', className = '' }) => {
  const styles: Record<BadgeTone, string> = {
    neutral: 'bg-[#F3F1EA] text-[#5A5E54] border-[#E2DFD5]',
    sage: 'bg-[#DCE5D9] text-[#254C3A] border-[#C7D5C3]',
    forest: 'bg-[#254C3A] text-[#F7F5EF] border-[#254C3A]',
    terracotta: 'bg-[#F7EAE4] text-[#9A4E33] border-[#E9C9BC]',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium tracking-tight border rounded ${styles[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export const SectionHeader: React.FC<{
  eyebrow?: string
  title: string
  subtitle?: string
  right?: React.ReactNode
}> = ({ eyebrow, title, subtitle, right }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#E2DFD5]">
    <div>
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#254C3A] mb-1.5">
          {eyebrow}
        </p>
      )}
      <h1 className="font-serif text-2xl sm:text-[28px] font-medium tracking-tight text-[#252822] leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-[#5A5E54] mt-1 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
    {right && <div className="shrink-0 flex items-center gap-2">{right}</div>}
  </div>
)

export const StarRatingInput: React.FC<{
  value: number
  userRating?: number
  count?: number
  onRate?: (stars: number) => void
  size?: 'sm' | 'md'
}> = ({ value, userRating, count, onRate, size = 'sm' }) => {
  const [hovered, setHovered] = useState<number | null>(null)
  const displayValue = hovered ?? userRating ?? Math.round(value)
  const iconClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'

  return (
    <div className="inline-flex items-center gap-1.5">
      <div
        className="inline-flex items-center gap-0.5"
        onMouseLeave={() => setHovered(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= displayValue
          return (
            <button
              key={star}
              type="button"
              disabled={!onRate}
              onMouseEnter={() => onRate && setHovered(star)}
              onClick={() => onRate && onRate(star)}
              title={onRate ? `Rate ${star} out of 5` : undefined}
              className={`p-0.5 transition-colors ${
                onRate ? 'cursor-pointer hover:scale-110' : 'cursor-default'
              }`}
            >
              <Star
                className={`${iconClass} ${
                  filled
                    ? userRating && !hovered
                      ? 'fill-[#254C3A] text-[#254C3A]'
                      : 'fill-[#C87859] text-[#C87859]'
                    : 'text-[#D3CFC3]'
                }`}
              />
            </button>
          )
        })}
      </div>
      <span className="text-xs font-medium text-[#252822] tabular-nums">
        {value.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-[11px] text-[#7D8176] tabular-nums">
          ({count})
        </span>
      )}
      {userRating && (
        <span className="text-[11px] text-[#254C3A] font-medium ml-0.5">
          · Rated {userRating}★
        </span>
      )}
    </div>
  )
}

export const SimulationNotice: React.FC<{
  label: string
  children: React.ReactNode
  tone?: 'sage' | 'terracotta'
}> = ({ label, children, tone = 'sage' }) => {
  const box =
    tone === 'sage'
      ? 'bg-[#ECF1EA] border-[#C7D5C3] text-[#254C3A]'
      : 'bg-[#F7EAE4] border-[#E9C9BC] text-[#8E4329]'
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-2 px-3.5 py-2.5 border rounded-md text-xs leading-relaxed ${box}`}
    >
      <span className="font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 bg-white/75 border border-current/15 rounded shrink-0 self-start sm:self-center">
        {label}
      </span>
      <span>{children}</span>
    </div>
  )
}
