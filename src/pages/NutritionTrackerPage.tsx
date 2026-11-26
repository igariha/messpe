import React, { useMemo, useState } from 'react'
import { CheckCircle2, Circle, Plus, Sparkles } from 'lucide-react'
import {
  Badge,
  Card,
  SectionHeader,
  SimulationNotice,
} from '../components/ui'
import { useMesspe } from '../context/MesspeContext'
import { DAYS_OF_WEEK, TODAY_DAY } from '../data/mockData'
import type { DayOfWeek, MealSlot } from '../types/messpe'

type DietGoal =
  | 'Standard Veg'
  | 'High-Protein Veg'
  | 'Vegan-Friendly'
  | 'Balanced Light'

const GOAL_TARGETS: Record<
  DietGoal,
  { calories: number; protein: number; carbs: number; fats: number }
> = {
  'Standard Veg': { calories: 2150, protein: 62, carbs: 290, fats: 65 },
  'High-Protein Veg': { calories: 2300, protein: 82, carbs: 275, fats: 68 },
  'Vegan-Friendly': { calories: 2050, protein: 60, carbs: 285, fats: 58 },
  'Balanced Light': { calories: 1850, protein: 58, carbs: 235, fats: 54 },
}

const HEALTHY_ADDONS = [
  {
    id: 'addon-sprouts',
    name: 'Extra Bowl Moong Sprouts (100g)',
    calories: 105,
    protein: 8,
    carbs: 17,
    fats: 1,
    fiber: 5,
    vegan: true,
  },
  {
    id: 'addon-curd',
    name: 'Fresh Plain Curd Cup (150g)',
    calories: 98,
    protein: 6,
    carbs: 7,
    fats: 5,
    fiber: 0,
    vegan: false,
  },
  {
    id: 'addon-fruit',
    name: 'Seasonal Fruit Bowl / Banana',
    calories: 95,
    protein: 1,
    carbs: 23,
    fats: 0,
    fiber: 3,
    vegan: true,
  },
]

const MEAL_SLOTS: MealSlot[] = ['Breakfast', 'Lunch', 'Snacks', 'Dinner']

export const NutritionTrackerPage: React.FC = () => {
  const { weeklyMenu } = useMesspe()
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(TODAY_DAY)
  const [dietGoal, setDietGoal] = useState<DietGoal>('High-Protein Veg')
  const [consumedSlots, setConsumedSlots] = useState<Record<MealSlot, boolean>>({
    Breakfast: true,
    Lunch: true,
    Snacks: false,
    Dinner: true,
  })
  const [activeAddons, setActiveAddons] = useState<Record<string, boolean>>({
    'addon-sprouts': true,
    'addon-curd': false,
    'addon-fruit': false,
  })

  const dayMeals = weeklyMenu[selectedDay]
  const targets = GOAL_TARGETS[dietGoal]

  const totals = useMemo(() => {
    let calories = 0
    let protein = 0
    let carbs = 0
    let fats = 0
    let fiber = 0

    MEAL_SLOTS.forEach((slot) => {
      if (consumedSlots[slot]) {
        const n = dayMeals[slot].nutrition
        calories += n.calories
        protein += n.protein
        carbs += n.carbs
        fats += n.fats
        fiber += n.fiber
      }
    })

    HEALTHY_ADDONS.forEach((addon) => {
      if (activeAddons[addon.id]) {
        calories += addon.calories
        protein += addon.protein
        carbs += addon.carbs
        fats += addon.fats
        fiber += addon.fiber
      }
    })

    return { calories, protein, carbs, fats, fiber }
  }, [dayMeals, consumedSlots, activeAddons])

  const recommendations = useMemo(() => {
    const tips: { title: string; detail: string; tag: string }[] = []
    const proteinGap = targets.protein - totals.protein

    if (proteinGap > 8) {
      tips.push({
        title:
          dietGoal === 'Vegan-Friendly'
            ? 'Add Roasted Chana + Extra Dal Serving'
            : 'Pair Lunch with 150g Curd + Morning Sprouts',
        detail: `Your selected meals provide ~${totals.protein}g protein against a ${targets.protein}g ${dietGoal} target. Adding mess-available sprouts (+8g) and ${dietGoal === 'Vegan-Friendly' ? 'extra rajma/dal (+7g)' : 'curd (+6g)'} bridges the gap.`,
        tag: `+${Math.min(15, proteinGap)}g Protein`,
      })
    } else {
      tips.push({
        title: 'Daily Protein Target on Track',
        detail: `Your logged hostel meals reach ${totals.protein}g estimated protein, well aligned with your ${dietGoal} goal.`,
        tag: 'Balanced',
      })
    }

    if (dietGoal === 'Balanced Light' && totals.calories > targets.calories) {
      tips.push({
        title: 'Swap Second Rice Serving for 2 Phulkas + Salad',
        detail:
          'Choosing whole-wheat phulkas and cucumber kachumber trims ~140 kcal while increasing satiety and afternoon focus.',
        tag: '-140 kcal',
      })
    } else {
      tips.push({
        title: 'Moderate Evening Fried Snack Intake',
        detail:
          'When snacks include deep-fried samosa or pakora, pair with ginger chai (less sugar) and skip sweet condiments to keep daily fats within target.',
        tag: 'Smart Swap',
      })
    }

    if (dietGoal === 'Vegan-Friendly') {
      tips.push({
        title: 'Plant-Based Iron & Vitamin C Pairing',
        detail:
          'Squeeze fresh lemon over rajma, chana, or poha at the salad counter—vitamin C significantly improves plant iron absorption.',
        tag: 'Vegan Tip',
      })
    } else {
      tips.push({
        title: 'Hydration & Fiber Check',
        detail: `Estimated fiber intake is ${totals.fiber}g today. Include the raw cucumber/onion salad bowl at lunch and dinner to hit 28g+ daily fiber.`,
        tag: `${totals.fiber}g Fiber`,
      })
    }

    return tips
  }, [dietGoal, targets, totals])

  const macroCards = [
    {
      label: 'Estimated Calories',
      value: totals.calories,
      target: targets.calories,
      unit: 'kcal',
      barColor: 'bg-[#254C3A]',
    },
    {
      label: 'Protein',
      value: totals.protein,
      target: targets.protein,
      unit: 'g',
      barColor: 'bg-[#254C3A]',
    },
    {
      label: 'Carbohydrates',
      value: totals.carbs,
      target: targets.carbs,
      unit: 'g',
      barColor: 'bg-[#5A7D6B]',
    },
    {
      label: 'Fats',
      value: totals.fats,
      target: targets.fats,
      unit: 'g',
      barColor: 'bg-[#C87859]',
    },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Nutrition Tracker"
        title="Daily Meal Nutrition & Healthier Mess Choices"
        subtitle="Estimate daily calories and macronutrients across standard hostel mess portions and explore practical, mess-available nutrition upgrades."
        right={
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
            className="px-3 py-1.5 text-xs font-medium bg-white border border-[#E2DFD5] rounded focus:outline-none focus:border-[#254C3A]"
          >
            {DAYS_OF_WEEK.map((d) => (
              <option key={d} value={d}>
                {d} {d === TODAY_DAY ? '(Today)' : ''}
              </option>
            ))}
          </select>
        }
      />

      <SimulationNotice label="Estimate Disclaimer" tone="sage">
        All nutritional figures are <strong>standardized portion estimates</strong>{' '}
        calculated from standard hostel mess serving ladles (150g curry bowl,
        180g rice scoop, 2 medium phulkas) and recipe averages.
      </SimulationNotice>

      {/* Dietary Preference Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#E2DFD5] rounded-md p-3.5">
        <div>
          <div className="text-xs font-semibold text-[#252822]">
            Dietary Preference Profile
          </div>
          <div className="text-[11px] text-[#6B6F64]">
            Adjusts daily macro targets and Nutrition Agent suggestions
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(GOAL_TARGETS) as DietGoal[]).map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => setDietGoal(goal)}
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                dietGoal === goal
                  ? 'bg-[#254C3A] text-[#F7F5EF] border-[#254C3A]'
                  : 'bg-[#FAF9F5] text-[#5A5E54] border-[#E2DFD5] hover:border-[#254C3A]/40'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      {/* Macro Summary Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {macroCards.map((m) => {
          const pct = Math.min(100, Math.round((m.value / m.target) * 100))
          return (
            <Card key={m.label} padding="sm" className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-[#5A5E54]">
                <span>{m.label}</span>
                <span className="tabular-nums font-medium text-[#252822]">
                  {pct}% of goal
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 tabular-nums">
                <span className="text-2xl font-semibold text-[#252822]">
                  {m.value}
                </span>
                <span className="text-xs text-[#7D8176]">
                  / {m.target} {m.unit}
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#EBE8DE] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${m.barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Interactive Meal Selector + Add-ons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Card className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-medium text-[#252822]">
                {selectedDay} Meal Intake Log
              </h2>
              <p className="text-xs text-[#5A5E54]">
                Toggle meals you plan to eat today to calculate cumulative
                nutrition
              </p>
            </div>
            <Badge tone="neutral" className="tabular-nums">
              Fiber: ~{totals.fiber}g
            </Badge>
          </div>

          <div className="divide-y divide-[#EFECE3] border border-[#E2DFD5] rounded overflow-hidden">
            {MEAL_SLOTS.map((slot) => {
              const meal = dayMeals[slot]
              const checked = consumedSlots[slot]
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() =>
                    setConsumedSlots((prev) => ({
                      ...prev,
                      [slot]: !prev[slot],
                    }))
                  }
                  className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                    checked ? 'bg-white hover:bg-[#FAF9F5]' : 'bg-[#FAF9F5]/60 opacity-65'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {checked ? (
                      <CheckCircle2 className="w-4 h-4 text-[#254C3A] mt-0.5 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#B5B1A4] mt-0.5 shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#252822]">
                          {slot}
                        </span>
                        <span className="text-[11px] text-[#7D8176]">
                          · {meal.title}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-[#5A5E54] tabular-nums">
                        <span>~{meal.nutrition.calories} kcal</span>
                        <span>·</span>
                        <span className="text-[#254C3A] font-medium">
                          {meal.nutrition.protein}g P
                        </span>
                        <span>·</span>
                        <span>{meal.nutrition.carbs}g C</span>
                        <span>·</span>
                        <span>{meal.nutrition.fats}g F</span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Mess Counter Add-ons */}
          <div>
            <p className="text-xs font-semibold text-[#252822] mb-2">
              Optional Mess Counter Add-ons
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {HEALTHY_ADDONS.map((addon) => {
                const active = activeAddons[addon.id]
                const disabledForVegan =
                  dietGoal === 'Vegan-Friendly' && !addon.vegan
                return (
                  <button
                    key={addon.id}
                    type="button"
                    disabled={disabledForVegan}
                    onClick={() =>
                      setActiveAddons((prev) => ({
                        ...prev,
                        [addon.id]: !prev[addon.id],
                      }))
                    }
                    className={`p-2.5 rounded border text-left transition-colors ${
                      disabledForVegan
                        ? 'opacity-40 cursor-not-allowed bg-[#FAF9F5] border-[#E2DFD5]'
                        : active
                          ? 'bg-[#ECF1EA] border-[#254C3A] cursor-pointer'
                          : 'bg-white border-[#E2DFD5] hover:border-[#254C3A]/40 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 text-xs font-medium text-[#252822]">
                      <span className="truncate">{addon.name}</span>
                      <Plus
                        className={`w-3.5 h-3.5 shrink-0 ${
                          active ? 'rotate-45 text-[#254C3A]' : 'text-[#7D8176]'
                        }`}
                      />
                    </div>
                    <div className="text-[11px] text-[#5A5E54] mt-1 tabular-nums">
                      +{addon.calories} kcal · +{addon.protein}g protein
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Nutrition Agent Recommendations */}
        <Card className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-medium text-[#252822]">
                  Healthier Meal Recommendations
                </h2>
                <p className="text-xs text-[#5A5E54]">
                  Simulated Nutrition Agent guidance for {dietGoal}
                </p>
              </div>
              <Sparkles className="w-4 h-4 text-[#254C3A]" />
            </div>

            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.title}
                  className="p-3.5 rounded bg-[#FAF9F5] border border-[#E2DFD5] space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-semibold text-[#252822]">
                      {rec.title}
                    </h3>
                    <Badge tone="sage">{rec.tag}</Badge>
                  </div>
                  <p className="text-xs text-[#5A5E54] leading-relaxed">
                    {rec.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded bg-[#F3F1EA] border border-[#E2DFD5] text-[11px] text-[#5A5E54]">
            Note: Students with medical dietary conditions should consult the
            campus health clinic alongside mess nutrition estimates.
          </div>
        </Card>
      </div>
    </div>
  )
}
