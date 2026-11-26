import React, { useMemo, useState } from 'react'
import { Lock, MessageSquare, Sparkles } from 'lucide-react'
import {
  Badge,
  Card,
  SectionHeader,
  StarRatingInput,
} from '../components/ui'
import { useMesspe } from '../context/MesspeContext'
import { TODAY_DAY } from '../data/mockData'
import type { FeedbackCategory, FeedbackItem, MealSlot } from '../types/messpe'
import { analyzeStudentFeedback } from '../utils/aiSimulator'

const MEAL_SLOTS: MealSlot[] = ['Breakfast', 'Lunch', 'Snacks', 'Dinner']
const CATEGORIES: ('All' | FeedbackCategory)[] = [
  'All',
  'Food Quality',
  'Taste',
  'Hygiene',
  'Menu Variety',
  'Service',
]

export const StudentFeedbackPage: React.FC = () => {
  const { weeklyMenu, feedbackList, rateMeal, submitFeedback } = useMesspe()

  const [mealSlot, setMealSlot] = useState<MealSlot>('Lunch')
  const [rating, setRating] = useState<number>(4)
  const [studentName, setStudentName] = useState('Aarav Sharma')
  const [anonymous, setAnonymous] = useState(false)
  const [comment, setComment] = useState('')

  const [categoryFilter, setCategoryFilter] = useState<'All' | FeedbackCategory>(
    'All'
  )
  const [statusFilter, setStatusFilter] = useState<
    'All' | FeedbackItem['status']
  >('All')
  const [justSubmittedId, setJustSubmittedId] = useState<string | null>(null)

  const livePreview = useMemo(() => {
    if (!comment.trim()) return null
    return analyzeStudentFeedback(comment, rating, mealSlot)
  }, [comment, rating, mealSlot])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    const item = submitFeedback({
      studentName,
      anonymous,
      mealSlot,
      rating,
      comment,
    })
    setComment('')
    setJustSubmittedId(item.id)
  }

  const filteredFeedback = useMemo(
    () =>
      feedbackList.filter((item) => {
        const catMatch =
          categoryFilter === 'All' || item.category === categoryFilter
        const statusMatch =
          statusFilter === 'All' || item.status === statusFilter
        return catMatch && statusMatch
      }),
    [feedbackList, categoryFilter, statusFilter]
  )

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Student Feedback"
        title="Meal Ratings, Complaints & AI Sentiment Routing"
        subtitle="Rate today’s four meal services or submit complaints anonymously. Our simulated Student Feedback Agent categorizes submissions and tracks management resolution."
      />

      {/* Quick Meal Rating Bar */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A5E54]">
            Rate Today&apos;s Meals ({TODAY_DAY})
          </h2>
          <span className="text-[11px] text-[#7D8176]">
            Instant live update across Dashboard &amp; Menu Planner
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MEAL_SLOTS.map((slot) => {
            const meal = weeklyMenu[TODAY_DAY][slot]
            return (
              <div
                key={slot}
                className="p-3 rounded bg-[#FAF9F5] border border-[#E2DFD5] flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="text-[11px] font-semibold text-[#254C3A]">
                    {slot}
                  </div>
                  <div className="text-xs font-medium text-[#252822] truncate">
                    {meal.title}
                  </div>
                </div>
                <StarRatingInput
                  value={meal.rating}
                  userRating={meal.userRating}
                  count={meal.ratingCount}
                  onRate={(stars) => rateMeal(TODAY_DAY, slot, stars)}
                />
              </div>
            )
          })}
        </div>
      </Card>

      {/* Main Split: Submission Form + Previous Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Submission Form */}
        <Card className="lg:col-span-5 space-y-4">
          <div>
            <h2 className="font-serif text-lg font-medium text-[#252822]">
              Submit Complaint or Suggestion
            </h2>
            <p className="text-xs text-[#5A5E54] mt-0.5">
              Automatically tagged into Food Quality, Taste, Hygiene, Menu
              Variety, or Service.
            </p>
          </div>

          {justSubmittedId && (
            <div className="p-3 rounded bg-[#ECF1EA] border border-[#C7D5C3] text-xs text-[#254C3A]">
              Feedback submitted! Simulated AI sentiment analysis applied and
              added to the live queue.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#5A5E54] mb-1">
                  Meal Service
                </label>
                <select
                  value={mealSlot}
                  onChange={(e) => setMealSlot(e.target.value as MealSlot)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E2DFD5] rounded focus:outline-none focus:border-[#254C3A]"
                >
                  {MEAL_SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#5A5E54] mb-1">
                  Experience Rating
                </label>
                <div className="h-[30px] px-2.5 flex items-center bg-white border border-[#E2DFD5] rounded">
                  <StarRatingInput
                    value={rating}
                    userRating={rating}
                    onRate={setRating}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 p-2.5 rounded bg-[#FAF9F5] border border-[#E2DFD5]">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#254C3A]" />
                <div>
                  <div className="text-xs font-medium text-[#252822]">
                    Anonymous Feedback
                  </div>
                  <div className="text-[11px] text-[#7D8176]">
                    Hide your name &amp; room from mess staff
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="w-4 h-4 accent-[#254C3A] cursor-pointer"
              />
            </div>

            {!anonymous && (
              <div>
                <label className="block text-[11px] font-medium text-[#5A5E54] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E2DFD5] rounded focus:outline-none focus:border-[#254C3A]"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-[#5A5E54] mb-1">
                Feedback Details
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Example: Dal was watery at dinner or please add a vegan protein option on Fridays..."
                className="w-full px-2.5 py-2 text-xs bg-white border border-[#E2DFD5] rounded focus:outline-none focus:border-[#254C3A]"
              />
            </div>

            {/* Live AI Classification Preview */}
            {livePreview && (
              <div className="p-3 rounded bg-[#ECF1EA]/70 border border-[#C7D5C3] space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#254C3A]">
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Live Simulated AI Analysis
                  </span>
                  <span className="tabular-nums">
                    {livePreview.confidence}% conf.
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone="forest">{livePreview.category}</Badge>
                  <Badge
                    tone={
                      livePreview.sentiment === 'Positive'
                        ? 'sage'
                        : livePreview.sentiment === 'Negative'
                          ? 'terracotta'
                          : 'neutral'
                    }
                  >
                    {livePreview.sentiment} Sentiment
                  </Badge>
                </div>
                <p className="text-[11px] text-[#454940]">
                  {livePreview.aiSummary}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 text-xs font-medium bg-[#254C3A] hover:bg-[#1D3D2E] text-[#F7F5EF] rounded transition-colors cursor-pointer"
            >
              Submit Feedback
            </button>
          </form>
        </Card>

        {/* Previous Feedback & Complaint Status */}
        <Card className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-lg font-medium text-[#252822]">
                Feedback History &amp; Complaint Status
              </h2>
              <p className="text-xs text-[#5A5E54]">
                Showing {filteredFeedback.length} of {feedbackList.length}{' '}
                entries
              </p>
            </div>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as 'All' | FeedbackItem['status']
                )
              }
              className="px-2.5 py-1.5 text-xs bg-white border border-[#E2DFD5] rounded focus:outline-none focus:border-[#254C3A]"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded border transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#254C3A] text-[#F7F5EF] border-[#254C3A]'
                    : 'bg-[#FAF9F5] text-[#5A5E54] border-[#E2DFD5] hover:border-[#254C3A]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredFeedback.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#7D8176] border border-dashed border-[#E2DFD5] rounded">
                No feedback entries match the current filters.
              </div>
            ) : (
              filteredFeedback.map((fb) => (
                <div
                  key={fb.id}
                  className="p-3.5 rounded-md border border-[#E2DFD5] bg-[#FAF9F5] space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-[#252822]">
                        {fb.studentName}
                      </span>
                      <span className="text-[#8A8D82]">·</span>
                      <span className="text-[#5A5E54]">{fb.mealSlot}</span>
                      <span className="text-[#8A8D82]">·</span>
                      <span className="text-[#5A5E54] tabular-nums">
                        {fb.rating} ★
                      </span>
                    </div>
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

                  <p className="text-xs text-[#252822] leading-relaxed">
                    {fb.comment}
                  </p>

                  {/* AI Tagging Strip */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <Badge tone="neutral">Category: {fb.category}</Badge>
                    <Badge
                      tone={
                        fb.sentiment === 'Positive'
                          ? 'sage'
                          : fb.sentiment === 'Negative'
                            ? 'terracotta'
                            : 'neutral'
                      }
                    >
                      {fb.sentiment} ({fb.sentimentConfidence}%)
                    </Badge>
                    <span className="text-[#7D8176] ml-auto">
                      {fb.submittedAt}
                    </span>
                  </div>

                  {/* Management Response */}
                  {fb.managementResponse && (
                    <div className="p-2.5 rounded bg-white border border-[#E2DFD5] text-xs text-[#454940] flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-[#254C3A] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-[#254C3A]">
                          Mess Management Response:{' '}
                        </span>
                        {fb.managementResponse}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
