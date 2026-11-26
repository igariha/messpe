import React, { useState } from 'react'
import type { WasteDayStat } from '../types/messpe'

export const WasteBarChart: React.FC<{
  data: WasteDayStat[]
  height?: number
}> = ({ data, height = 220 }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const maxWaste = Math.max(
    ...data.map((d) => d.plateWasteKg + d.prepWasteKg),
    35
  )

  const chartH = height - 42
  const colWidth = 100 / data.length

  return (
    <div className="relative select-none">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-[#5A5E54]">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#C87859]" />
            Plate Waste (kg)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#DCE5D9] border border-[#B5C6B0]" />
            Prep Trimmings (kg)
          </span>
        </div>
        <span className="text-[11px] text-[#7D8176]">
          Hover bars for daily breakdown
        </span>
      </div>

      <div className="relative w-full" style={{ height }}>
        <svg
          viewBox={`0 0 600 ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Horizontal hairlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((step) => {
            const y = 12 + chartH * (1 - step)
            return (
              <g key={step}>
                <line
                  x1={32}
                  x2={592}
                  y1={y}
                  y2={y}
                  stroke="#EBE8DE"
                  strokeWidth={1}
                />
                <text
                  x={26}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-[#8A8D82] text-[10px] tabular-nums"
                >
                  {Math.round(maxWaste * step)}
                </text>
              </g>
            )
          })}

          {/* Bars */}
          {data.map((item, idx) => {
            const slotW = (592 - 40) / data.length
            const xCenter = 40 + slotW * idx + slotW / 2
            const barW = Math.min(34, slotW * 0.52)

            const plateH = (item.plateWasteKg / maxWaste) * chartH
            const prepH = (item.prepWasteKg / maxWaste) * chartH
            const baseBottom = 12 + chartH

            const plateY = baseBottom - plateH
            const prepY = plateY - prepH
            const isHovered = hoveredIdx === idx

            return (
              <g
                key={item.shortDay}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Hover column highlight */}
                <rect
                  x={xCenter - slotW / 2 + 4}
                  y={8}
                  width={slotW - 8}
                  height={chartH + 8}
                  rx={4}
                  fill={isHovered ? '#F3F1EA' : 'transparent'}
                />

                {/* Prep waste (top segment) */}
                <rect
                  x={xCenter - barW / 2}
                  y={prepY}
                  width={barW}
                  height={Math.max(2, prepH)}
                  rx={2}
                  fill="#DCE5D9"
                  stroke="#B5C6B0"
                  strokeWidth={0.8}
                />

                {/* Plate waste (bottom segment) */}
                <rect
                  x={xCenter - barW / 2}
                  y={plateY}
                  width={barW}
                  height={Math.max(2, plateH)}
                  rx={2}
                  fill={isHovered ? '#B66343' : '#C87859'}
                />

                {/* Value label */}
                <text
                  x={xCenter}
                  y={prepY - 6}
                  textAnchor="middle"
                  className={`text-[10px] font-medium tabular-nums ${
                    isHovered ? 'fill-[#252822]' : 'fill-[#7D8176]'
                  }`}
                >
                  {(item.plateWasteKg + item.prepWasteKg).toFixed(1)}kg
                </text>

                {/* X-axis label */}
                <text
                  x={xCenter}
                  y={height - 8}
                  textAnchor="middle"
                  className={`text-[11px] ${
                    isHovered
                      ? 'fill-[#254C3A] font-semibold'
                      : 'fill-[#5A5E54] font-medium'
                  }`}
                >
                  {item.shortDay}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Interactive Tooltip */}
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div
            className="pointer-events-none absolute top-0 z-10 bg-[#252822] text-[#F7F5EF] px-3 py-2 rounded text-[11px] shadow-md border border-[#3E4239] min-w-[200px]"
            style={{
              left: `${Math.min(72, Math.max(4, hoveredIdx * colWidth))}%`,
            }}
          >
            <div className="font-semibold text-xs mb-1 flex items-center justify-between gap-3">
              <span>{data[hoveredIdx].day}</span>
              <span className="text-[#DCE5D9] tabular-nums">
                {data[hoveredIdx].expectedStudents} diners
              </span>
            </div>
            <div className="space-y-0.5 text-[#D8D5CA] tabular-nums">
              <div className="flex justify-between">
                <span>Consumed:</span>
                <span>{data[hoveredIdx].consumedKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Plate Waste:</span>
                <span className="text-[#E7A389]">
                  {data[hoveredIdx].plateWasteKg} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span>Prep Waste:</span>
                <span>{data[hoveredIdx].prepWasteKg} kg</span>
              </div>
              <div className="pt-1 mt-1 border-t border-[#3E4239] text-[10px] text-[#DCE5D9]">
                Top driver: {data[hoveredIdx].topWastedDish}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const WeeklyRatingStrip: React.FC<{
  items: { day: string; short: string; avgRating: number; highlight: string }[]
  activeDay?: string
  onSelectDay?: (day: string) => void
}> = ({ items, activeDay, onSelectDay }) => {
  return (
    <div className="grid grid-cols-7 gap-2">
      {items.map((item) => {
        const isToday = item.day === activeDay
        const barPct = Math.round((item.avgRating / 5) * 100)
        return (
          <button
            key={item.day}
            type="button"
            onClick={() => onSelectDay && onSelectDay(item.day)}
            className={`group text-left p-2.5 border rounded transition-colors cursor-pointer ${
              isToday
                ? 'bg-[#ECF1EA] border-[#254C3A]'
                : 'bg-[#FAF9F5] border-[#E2DFD5] hover:border-[#254C3A]/50 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-semibold ${
                  isToday ? 'text-[#254C3A]' : 'text-[#5A5E54]'
                }`}
              >
                {item.short}
              </span>
              <span className="text-[11px] font-medium tabular-nums text-[#252822]">
                {item.avgRating.toFixed(1)}
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#E8E5DC] rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full ${
                  item.avgRating >= 4.5
                    ? 'bg-[#254C3A]'
                    : item.avgRating >= 4.0
                      ? 'bg-[#5A7D6B]'
                      : 'bg-[#C87859]'
                }`}
                style={{ width: `${barPct}%` }}
              />
            </div>
            <p className="text-[10px] text-[#6B6F64] truncate">
              {item.highlight}
            </p>
          </button>
        )
      })}
    </div>
  )
}
