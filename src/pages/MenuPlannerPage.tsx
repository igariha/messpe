import React, { useState } from 'react'
import {
  Check,
  Clock,
  RotateCcw,
  Sparkles,
  Utensils,
} from 'lucide-react'
import {
  Badge,
  Card,
  SectionHeader,
  SimulationNotice,
  StarRatingInput,
} from '../components/ui'
import { useMesspe } from '../context/MesspeContext'
import { DAYS_OF_WEEK, TODAY_DAY } from '../data/mockData'
import type { DietaryTag, MealSlot } from '../types/messpe'

const MEAL_SLOTS: MealSlot[] = ['Breakfast', 'Lunch', 'Snacks', 'Dinner']

const DIETARY_FILTERS: ('All' | DietaryTag)[] = [
  'All',
  'Vegetarian',
  'Vegan-Friendly',
  'High-Protein',
  'Jain Option',
]

export const MenuPlannerPage: React.FC = () => {
  const {
    weeklyMenu,
    selectedPlannerDay,
    setSelectedPlannerDay,
    menuSuggestions,
    rateMeal,
    applyMenuSuggestion,
    generateImprovedWeeklyMenu,
    resetWeeklyMenuToDefault,
  } = useMesspe()

  const [dietFilter, setDietFilter] = useState<'All' | DietaryTag>('All')
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day')
  const [optimizationBanner, setOptimizationBanner] = useState<string | null>(
    null
  )

  const handleGenerateImproved = () => {
    const count = generateImprovedWeeklyMenu()
    if (count > 0) {
      setOptimizationBanner(
        `Menu Planning Agent applied ${count} AI-recommended meal upgrades (boosting predicted ratings on Friday & Tuesday while cutting low-uptake leftovers).`
      )
    } else {
      setOptimizationBanner(
        'All simulated AI menu recommendations are already active on the current weekly schedule.'
      )
    }
  }

  const pendingSuggestions = menuSuggestions.filter((s) => !s.applied).length
  const dayMenu = weeklyMenu[selectedPlannerDay]

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Smart Menu Planner"
        title="Weekly Mess Menu & AI Optimization"
        subtitle="Browse breakfast, lunch, evening snacks, and dinner schedules with dietary tags, portion nutrition, and simulated AI menu recommendations."
        right={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                resetWeeklyMenuToDefault()
                setOptimizationBanner('Restored baseline weekly hostel menu.')
              }}
              className="px-3 py-2 text-xs font-medium bg-white border border-[#E2DFD5] hover:border-[#252822] text-[#5A5E54] rounded inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Menu
            </button>
            <button
              type="button"
              onClick={handleGenerateImproved}
              className="px-3.5 py-2 text-xs font-medium bg-[#254C3A] hover:bg-[#1D3D2E] text-[#F7F5EF] rounded inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Improved Weekly Menu
              {pendingSuggestions > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-[#F7F5EF]/20 rounded text-[10px] tabular-nums">
                  {pendingSuggestions}
                </span>
              )}
            </button>
          </div>
        }
      />

      {optimizationBanner && (
        <SimulationNotice label="Menu Agent Output" tone="sage">
          <div className="flex items-center justify-between gap-4 w-full">
            <span>{optimizationBanner}</span>
            <button
              type="button"
              onClick={() => setOptimizationBanner(null)}
              className="text-[11px] font-semibold underline shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </SimulationNotice>
      )}

      {/* Controls Bar: Day Selector + Dietary Filter + View Switch */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-[#E2DFD5] rounded-md p-3">
        <div className="flex flex-wrap items-center gap-1">
          {DAYS_OF_WEEK.map((day) => {
            const active = viewMode === 'day' && selectedPlannerDay === day
            const isToday = day === TODAY_DAY
            return (
              <button
                key={day}
                type="button"
                onClick={() => {
                  setViewMode('day')
                  setSelectedPlannerDay(day)
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#254C3A] text-[#F7F5EF]'
                    : 'text-[#5A5E54] hover:bg-[#F3F1EA] hover:text-[#252822]'
                }`}
              >
                {day.slice(0, 3)}
                {isToday && (
                  <span
                    className={`ml-1 text-[10px] ${
                      active ? 'text-[#DCE5D9]' : 'text-[#254C3A]'
                    }`}
                  >
                    · Today
                  </span>
                )}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'week' ? 'day' : 'week')}
            className={`ml-1 px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
              viewMode === 'week'
                ? 'bg-[#DCE5D9] text-[#254C3A] border-[#B5C6B0]'
                : 'bg-[#FAF9F5] text-[#5A5E54] border-[#E2DFD5] hover:text-[#252822]'
            }`}
          >
            {viewMode === 'week' ? 'Back to Day Cards' : 'Full Week Table'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-[#7D8176] mr-1">Diet filter:</span>
          {DIETARY_FILTERS.map((tag) => {
            const active = dietFilter === tag
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setDietFilter(tag)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#DCE5D9] text-[#254C3A] border-[#254C3A]/40'
                    : 'bg-white text-[#5A5E54] border-[#E2DFD5] hover:border-[#254C3A]/30'
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Schedule View */}
      {viewMode === 'day' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MEAL_SLOTS.map((slot) => {
            const meal = dayMenu[slot]
            const matchesDiet =
              dietFilter === 'All' || meal.tags.includes(dietFilter)

            return (
              <Card
                key={meal.id}
                padding="none"
                className={`overflow-hidden flex flex-col transition-opacity ${
                  matchesDiet ? 'opacity-100' : 'opacity-45'
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 flex-1">
                  {/* Photo Column */}
                  <div className="sm:col-span-5 relative h-44 sm:h-auto bg-[#EFECE3] border-b sm:border-b-0 sm:border-r border-[#E2DFD5]">
                    <img
                      src={meal.image}
                      alt={meal.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[11px] font-semibold bg-[#F7F5EF]/95 text-[#252822] border border-[#E2DFD5] rounded">
                      {slot}
                    </span>
                  </div>

                  {/* Details Column */}
                  <div className="sm:col-span-7 p-4 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] text-[#6B6F64] mb-1">
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Clock className="w-3 h-3" />
                          {meal.timing}
                        </span>
                        <span className="tabular-nums">
                          Est. {meal.predictedServings} plates
                        </span>
                      </div>
                      <h3 className="text-[15px] font-semibold text-[#252822] leading-snug">
                        {meal.title}
                      </h3>

                      <ul className="mt-2.5 space-y-1">
                        {meal.items.map((item) => (
                          <li
                            key={item}
                            className="text-xs text-[#5A5E54] flex items-start gap-1.5"
                          >
                            <Utensils className="w-3 h-3 text-[#7D8176] mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2.5 pt-2.5 border-t border-[#EFECE3]">
                      {/* Nutrition micro-grid */}
                      <div className="grid grid-cols-4 gap-1.5 text-center bg-[#FAF9F5] border border-[#E2DFD5] rounded p-1.5 tabular-nums">
                        <div>
                          <div className="text-[10px] text-[#7D8176]">Cal</div>
                          <div className="text-xs font-semibold text-[#252822]">
                            {meal.nutrition.calories}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#7D8176]">Prot</div>
                          <div className="text-xs font-semibold text-[#254C3A]">
                            {meal.nutrition.protein}g
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#7D8176]">Carb</div>
                          <div className="text-xs font-semibold text-[#252822]">
                            {meal.nutrition.carbs}g
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#7D8176]">Fat</div>
                          <div className="text-xs font-semibold text-[#252822]">
                            {meal.nutrition.fats}g
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <StarRatingInput
                          value={meal.rating}
                          userRating={meal.userRating}
                          count={meal.ratingCount}
                          onRate={(s) => rateMeal(selectedPlannerDay, slot, s)}
                        />
                        <Badge
                          tone={
                            meal.wasteRatePercent >= 15 ? 'terracotta' : 'sage'
                          }
                        >
                          {meal.wasteRatePercent}% avg waste
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {meal.tags.map((tag) => (
                          <Badge
                            key={tag}
                            tone={
                              dietFilter === tag
                                ? 'forest'
                                : tag === 'High-Protein'
                                  ? 'sage'
                                  : 'neutral'
                            }
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        /* Full Week Clean Data Table */
        <Card padding="none" className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[780px]">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E2DFD5] text-[11px] font-semibold uppercase tracking-wider text-[#5A5E54]">
                <th className="py-3 px-4 w-28">Day</th>
                {MEAL_SLOTS.map((slot) => (
                  <th key={slot} className="py-3 px-4">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE3] text-xs">
              {DAYS_OF_WEEK.map((day) => (
                <tr
                  key={day}
                  className={day === TODAY_DAY ? 'bg-[#ECF1EA]/40' : 'bg-white'}
                >
                  <td className="py-3.5 px-4 font-semibold text-[#252822] align-top">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlannerDay(day)
                        setViewMode('day')
                      }}
                      className="hover:text-[#254C3A] hover:underline cursor-pointer text-left"
                    >
                      {day}
                      {day === TODAY_DAY && (
                        <span className="block text-[10px] font-normal text-[#254C3A]">
                          Today
                        </span>
                      )}
                    </button>
                  </td>
                  {MEAL_SLOTS.map((slot) => {
                    const meal = weeklyMenu[day][slot]
                    const matches =
                      dietFilter === 'All' || meal.tags.includes(dietFilter)
                    return (
                      <td
                        key={meal.id}
                        className={`py-3.5 px-4 align-top ${
                          matches ? '' : 'opacity-35'
                        }`}
                      >
                        <div className="font-medium text-[#252822]">
                          {meal.title}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-[#6B6F64] tabular-nums">
                          <span>{meal.rating.toFixed(1)} ★</span>
                          <span>·</span>
                          <span>{meal.nutrition.calories} kcal</span>
                          <span>·</span>
                          <span>{meal.nutrition.protein}g P</span>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* AI-Powered Meal Suggestions */}
      <section className="space-y-3 pt-2">
        <div>
          <h2 className="font-serif text-xl font-medium text-[#252822]">
            Simulated AI Meal Recommendations
          </h2>
          <p className="text-xs text-[#5A5E54]">
            Generated by combining student meal ratings, protein targets, and
            plate-waste history. Apply individual swaps or optimize the full
            week above.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {menuSuggestions.map((sug) => (
            <Card key={sug.id} className="flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <Badge tone="neutral">
                    {sug.day} · {sug.slot}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#254C3A]">
                    <span>{sug.projectedRatingLift}</span>
                    <span>·</span>
                    <span>{sug.projectedWasteDrop}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-[#7D8176] line-through">
                    {sug.currentTitle}
                  </div>
                  <div className="text-sm font-semibold text-[#252822]">
                    {sug.suggestedTitle}
                  </div>
                </div>

                <p className="text-xs text-[#5A5E54] leading-relaxed">
                  {sug.reason}
                </p>
              </div>

              <button
                type="button"
                disabled={sug.applied}
                onClick={() => applyMenuSuggestion(sug.id)}
                className={`w-full py-2 text-xs font-medium rounded border transition-colors inline-flex items-center justify-center gap-1.5 ${
                  sug.applied
                    ? 'bg-[#DCE5D9] text-[#254C3A] border-[#C7D5C3] cursor-default'
                    : 'bg-white hover:bg-[#254C3A] text-[#252822] hover:text-[#F7F5EF] border-[#E2DFD5] hover:border-[#254C3A] cursor-pointer'
                }`}
              >
                {sug.applied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Applied to Weekly Menu
                  </>
                ) : (
                  'Apply AI Suggestion'
                )}
              </button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
