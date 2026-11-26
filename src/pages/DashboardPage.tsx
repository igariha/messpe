import React, { useMemo, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquarePlus,
  Pin,
  ShieldCheck,
  Sparkles,
  TrendingDown,
} from 'lucide-react'
import { WasteBarChart, WeeklyRatingStrip } from '../components/Charts'
import { Badge, Card, StarRatingInput } from '../components/ui'
import { DAYS_OF_WEEK, TODAY_DAY } from '../data/mockData'
import { useMesspe } from '../context/MesspeContext'
import type { DayOfWeek, MealSlot } from '../types/messpe'

export const DashboardPage: React.FC = () => {
  const {
    weeklyMenu,
    announcements,
    hygieneChecks,
    qualityUpdates,
    feedbackList,
    wasteStats,
    rateMeal,
    setActivePage,
    setSelectedPlannerDay,
  } = useMesspe()

  const [includeSnacks, setIncludeSnacks] = useState(false)

  const todayMeals = weeklyMenu[TODAY_DAY]
  const visibleSlots: MealSlot[] = includeSnacks
    ? ['Breakfast', 'Lunch', 'Snacks', 'Dinner']
    : ['Breakfast', 'Lunch', 'Dinner']

  const hygienePassed = hygieneChecks.filter((h) => h.verified).length
  const hygienePct = Math.round((hygienePassed / hygieneChecks.length) * 100)

  const avgSatisfaction = useMemo(() => {
    const ratings: number[] = []
    DAYS_OF_WEEK.forEach((day) => {
      ;(['Breakfast', 'Lunch', 'Snacks', 'Dinner'] as MealSlot[]).forEach(
        (slot) => ratings.push(weeklyMenu[day][slot].rating)
      )
    })
    const sum = ratings.reduce((acc, r) => acc + r, 0)
    return (sum / ratings.length).toFixed(2)
  }, [weeklyMenu])

  const weeklyOverview = useMemo(
    () =>
      DAYS_OF_WEEK.map((day) => {
        const dayObj = weeklyMenu[day]
        const avg =
          (dayObj.Breakfast.rating +
            dayObj.Lunch.rating +
            dayObj.Snacks.rating +
            dayObj.Dinner.rating) /
          4
        return {
          day,
          short: day.slice(0, 3),
          avgRating: avg,
          highlight: dayObj.Dinner.title.split(',')[0],
        }
      }),
    [weeklyMenu]
  )

  const todayWaste = wasteStats[wasteStats.length - 1]
  const totalTodayWaste = (
    todayWaste.plateWasteKg + todayWaste.prepWasteKg
  ).toFixed(1)
  const openFeedback = feedbackList.filter((f) => f.status !== 'Resolved').length

  return (
    <div className="space-y-8">
      {/* Hero / Welcome Section */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E2DFD5]">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#254C3A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#254C3A]" />
            <span>Good morning! Here&apos;s what&apos;s happening at your mess.</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-[36px] font-medium tracking-tight text-[#252822] leading-[1.15]">
            Your mess, made better.
          </h1>
          <p className="text-[15px] text-[#5A5E54] leading-relaxed">
            Everything you need for better meals, healthier choices and a smarter
            hostel dining experience.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActivePage('menu')}
            className="px-3.5 py-2 text-xs font-medium bg-[#254C3A] text-[#F7F5EF] hover:bg-[#1D3D2E] rounded transition-colors cursor-pointer"
          >
            Explore Weekly Menu
          </button>
          <button
            type="button"
            onClick={() => setActivePage('feedback')}
            className="px-3.5 py-2 text-xs font-medium bg-white border border-[#E2DFD5] hover:border-[#254C3A] text-[#252822] rounded transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-[#254C3A]" />
            Share Feedback
          </button>
          <button
            type="button"
            onClick={() => setActivePage('quality')}
            className="px-3.5 py-2 text-xs font-medium bg-white border border-[#E2DFD5] hover:border-[#C87859] text-[#252822] rounded transition-colors cursor-pointer"
          >
            Report Quality Issue
          </button>
        </div>
      </section>

      {/* Top 4 KPI Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm" className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#5A5E54]">
            <span>Student Satisfaction</span>
            <Badge tone="sage">+0.2 vs last wk</Badge>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-[#252822] tabular-nums">
              {avgSatisfaction}
            </span>
            <span className="text-xs text-[#7D8176]">/ 5.0 weekly avg</span>
          </div>
          <p className="text-[11px] text-[#6B6F64] mt-1.5">
            Based on 1,400+ verified meal ratings
          </p>
        </Card>

        <Card padding="sm" className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#5A5E54]">
            <span>Daily Hygiene Status</span>
            <ShieldCheck className="w-4 h-4 text-[#254C3A]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-[#252822] tabular-nums">
              {hygienePct}%
            </span>
            <span className="text-xs text-[#254C3A] font-medium">
              {hygienePassed}/{hygieneChecks.length} checks verified
            </span>
          </div>
          <p className="text-[11px] text-[#6B6F64] mt-1.5">
            RO TDS 44 ppm · Chiller 3.4°C
          </p>
        </Card>

        <Card padding="sm" className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#5A5E54]">
            <span>Est. Food Wastage</span>
            <TrendingDown className="w-4 h-4 text-[#254C3A]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-[#252822] tabular-nums">
              {totalTodayWaste} kg
            </span>
            <span className="text-xs text-[#254C3A] font-medium">
              -18% vs 30-day avg
            </span>
          </div>
          <p className="text-[11px] text-[#6B6F64] mt-1.5">
            {todayWaste.expectedStudents} diners forecasted today
          </p>
        </Card>

        <Card padding="sm" className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#5A5E54]">
            <span>Complaints & Feedback</span>
            <Badge tone={openFeedback > 2 ? 'terracotta' : 'neutral'}>
              {openFeedback} Open
            </Badge>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-[#252822] tabular-nums">
              {feedbackList.length}
            </span>
            <span className="text-xs text-[#7D8176]">recent submissions</span>
          </div>
          <button
            type="button"
            onClick={() => setActivePage('feedback')}
            className="mt-1.5 text-[11px] font-medium text-[#254C3A] hover:underline inline-flex items-center gap-1 cursor-pointer self-start"
          >
            Review AI sentiment &amp; responses
            <ArrowRight className="w-3 h-3" />
          </button>
        </Card>
      </section>

      {/* Today's Menu */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-xl font-medium text-[#252822]">
              Today&apos;s Menu · {TODAY_DAY}
            </h2>
            <p className="text-xs text-[#5A5E54]">
              Click stars on any meal card to submit your live rating.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-1.5 text-xs text-[#5A5E54] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeSnacks}
                onChange={(e) => setIncludeSnacks(e.target.checked)}
                className="accent-[#254C3A] rounded"
              />
              Show Evening Snacks
            </label>
            <button
              type="button"
              onClick={() => setActivePage('menu')}
              className="text-xs font-medium text-[#254C3A] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              Full Planner <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            includeSnacks ? 'xl:grid-cols-4' : 'xl:grid-cols-3'
          } gap-4`}
        >
          {visibleSlots.map((slot) => {
            const meal = todayMeals[slot]
            return (
              <Card
                key={meal.id}
                padding="none"
                className="overflow-hidden flex flex-col"
              >
                <div className="relative h-40 bg-[#EFECE3] overflow-hidden border-b border-[#E2DFD5]">
                  <img
                    src={meal.image}
                    alt={meal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[11px] font-semibold bg-[#F7F5EF]/95 text-[#252822] border border-[#E2DFD5] rounded">
                      {slot}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[10px] font-medium bg-[#252822]/85 text-[#F7F5EF] rounded inline-flex items-center gap-1 tabular-nums">
                    <Clock className="w-3 h-3" />
                    {meal.timing}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#252822] leading-snug">
                      {meal.title}
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {meal.items.map((item) => (
                        <li
                          key={item}
                          className="text-xs text-[#5A5E54] flex items-start gap-1.5"
                        >
                          <span className="text-[#254C3A] mt-0.5">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-[#EFECE3] space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {meal.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          tone={tag === 'High-Protein' ? 'sage' : 'neutral'}
                        >
                          {tag}
                        </Badge>
                      ))}
                      <Badge tone="neutral" className="tabular-nums">
                        ~{meal.nutrition.calories} kcal
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <StarRatingInput
                        value={meal.rating}
                        userRating={meal.userRating}
                        count={meal.ratingCount}
                        onRate={(stars) => rateMeal(TODAY_DAY, slot, stars)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Announcements + Hygiene Snapshot */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Announcements */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-medium text-[#252822]">
                Today&apos;s Announcements
              </h2>
              <button
                type="button"
                onClick={() => setActivePage('admin')}
                className="text-xs font-medium text-[#254C3A] hover:underline cursor-pointer"
              >
                Manage in Admin
              </button>
            </div>
            <div className="divide-y divide-[#EFECE3]">
              {announcements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {ann.pinned && (
                        <Pin className="w-3 h-3 text-[#C87859] shrink-0" />
                      )}
                      <h3 className="text-[13px] font-semibold text-[#252822]">
                        {ann.title}
                      </h3>
                    </div>
                    <Badge
                      tone={
                        ann.category === 'Quality'
                          ? 'sage'
                          : ann.category === 'Menu Update'
                            ? 'terracotta'
                            : 'neutral'
                      }
                    >
                      {ann.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#5A5E54] leading-relaxed">
                    {ann.body}
                  </p>
                  <p className="text-[11px] text-[#8A8D82] mt-1">
                    {ann.author} · {ann.timestamp}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Daily Food Quality & Hygiene Status */}
        <Card className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-medium text-[#252822]">
                Quality &amp; Hygiene Log
              </h2>
              <button
                type="button"
                onClick={() => setActivePage('quality')}
                className="text-xs font-medium text-[#254C3A] hover:underline cursor-pointer"
              >
                Full Report
              </button>
            </div>

            <div className="space-y-2.5">
              {qualityUpdates.map((qu) => (
                <div
                  key={qu.id}
                  className="flex items-center justify-between p-2.5 rounded bg-[#FAF9F5] border border-[#E2DFD5]"
                >
                  <div>
                    <div className="text-xs font-medium text-[#252822]">
                      {qu.parameter}
                    </div>
                    <div className="text-[11px] text-[#7D8176]">
                      Benchmark: {qu.benchmark}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold tabular-nums text-[#252822]">
                      {qu.reading}
                    </div>
                    <Badge
                      tone={qu.status === 'Verified' ? 'sage' : 'terracotta'}
                      className="mt-0.5"
                    >
                      {qu.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EFECE3] flex items-center justify-between text-xs text-[#5A5E54]">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#254C3A]" />
              Morning Kitchen Audit Passed
            </span>
            <button
              type="button"
              onClick={() => setActivePage('quality')}
              className="text-[#254C3A] font-medium hover:underline cursor-pointer"
            >
              Upload Food Photo
            </button>
          </div>
        </Card>
      </section>

      {/* Weekly Meal Overview */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-medium text-[#252822]">
              Weekly Meal Overview
            </h2>
            <p className="text-xs text-[#5A5E54]">
              Select any day to inspect full schedule, nutrition, or AI menu
              suggestions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActivePage('agents')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#254C3A] hover:underline cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />5 AI Agents Active
          </button>
        </div>

        <Card padding="sm">
          <WeeklyRatingStrip
            items={weeklyOverview}
            activeDay={TODAY_DAY}
            onSelectDay={(day) => {
              setSelectedPlannerDay(day as DayOfWeek)
              setActivePage('menu')
            }}
          />
        </Card>
      </section>

      {/* Food Wastage & Quick Feedback */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Card className="lg:col-span-7">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-serif text-lg font-medium text-[#252822]">
                Weekly Food Wastage Statistics
              </h2>
              <p className="text-xs text-[#5A5E54]">
                Combined plate &amp; kitchen prep waste tracked across 7 days
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActivePage('waste')}
              className="text-xs font-medium text-[#254C3A] hover:underline cursor-pointer"
            >
              Waste Analytics
            </button>
          </div>
          <WasteBarChart data={wasteStats} height={210} />
        </Card>

        <Card className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-lg font-medium text-[#252822]">
                Recent Student Feedback
              </h2>
              <button
                type="button"
                onClick={() => setActivePage('feedback')}
                className="text-xs font-medium text-[#254C3A] hover:underline cursor-pointer"
              >
                Open Feedback
              </button>
            </div>

            <div className="space-y-3">
              {feedbackList.slice(0, 3).map((fb) => (
                <div
                  key={fb.id}
                  className="p-3 rounded bg-[#FAF9F5] border border-[#E2DFD5] space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-[#252822]">
                      {fb.studentName} · {fb.mealSlot}
                    </span>
                    <Badge
                      tone={
                        fb.status === 'Resolved'
                          ? 'sage'
                          : fb.status === 'In Review'
                            ? 'terracotta'
                            : 'neutral'
                      }
                    >
                      {fb.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#5A5E54] line-clamp-2">
                    &ldquo;{fb.comment}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#7D8176]">
                    <span>AI Tag: {fb.category}</span>
                    <span>{fb.sentiment} Sentiment</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActivePage('feedback')}
            className="mt-4 w-full py-2 text-xs font-medium text-[#254C3A] bg-[#ECF1EA] hover:bg-[#DCE5D9] border border-[#C7D5C3] rounded transition-colors cursor-pointer"
          >
            Submit Complaint or Suggestion
          </button>
        </Card>
      </section>
    </div>
  )
}
