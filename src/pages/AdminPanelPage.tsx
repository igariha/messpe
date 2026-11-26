import React, { useState } from 'react'
import {
  Check,
  CheckCircle2,
  Circle,
  Megaphone,
  Pin,
  Trash2,
  X,
} from 'lucide-react'
import { WasteBarChart } from '../components/Charts'
import { Badge, Card, SectionHeader } from '../components/ui'
import { useMesspe } from '../context/MesspeContext'
import { DAYS_OF_WEEK } from '../data/mockData'
import type { Announcement, DayOfWeek, MealSlot } from '../types/messpe'

type AdminTab =
  | 'overview'
  | 'complaints'
  | 'menu'
  | 'quality'
  | 'waste'
  | 'announcements'

const MEAL_SLOTS: MealSlot[] = ['Breakfast', 'Lunch', 'Snacks', 'Dinner']

export const AdminPanelPage: React.FC = () => {
  const {
    weeklyMenu,
    feedbackList,
    issueReports,
    hygieneChecks,
    wasteStats,
    wasteSuggestions,
    adminRecommendations,
    announcements,
    updateFeedbackStatus,
    updateIssueStatus,
    toggleHygieneCheck,
    updateMealItem,
    updateAdminRecommendation,
    toggleWasteSuggestion,
    addAnnouncement,
    toggleAnnouncementPin,
    deleteAnnouncement,
  } = useMesspe()

  const [tab, setTab] = useState<AdminTab>('overview')

  // Inline response drafts for feedback & quality issues
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})

  // Menu editor state
  const [editDay, setEditDay] = useState<DayOfWeek>('Thursday')
  const [editSlot, setEditSlot] = useState<MealSlot>('Lunch')
  const [menuSavedMsg, setMenuSavedMsg] = useState<string | null>(null)
  const currentEditingMeal = weeklyMenu[editDay][editSlot]
  const [editTitle, setEditTitle] = useState(currentEditingMeal.title)
  const [editItemsText, setEditItemsText] = useState(
    currentEditingMeal.items.join(', ')
  )

  // Announcement form state
  const [annTitle, setAnnTitle] = useState('')
  const [annBody, setAnnBody] = useState('')
  const [annCategory, setAnnCategory] =
    useState<Announcement['category']>('Notice')
  const [annPinned, setAnnPinned] = useState(true)

  const handleSelectMenuSlot = (d: DayOfWeek, s: MealSlot) => {
    setEditDay(d)
    setEditSlot(s)
    setEditTitle(weeklyMenu[d][s].title)
    setEditItemsText(weeklyMenu[d][s].items.join(', '))
    setMenuSavedMsg(null)
  }

  const handleSaveMenuEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTitle.trim()) return
    const items = editItemsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    updateMealItem(editDay, editSlot, {
      title: editTitle.trim(),
      items: items.length > 0 ? items : [editTitle.trim()],
    })
    setMenuSavedMsg(
      `Updated ${editDay} ${editSlot} across Dashboard, Menu Planner & Nutrition Tracker.`
    )
  }

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!annTitle.trim() || !annBody.trim()) return
    addAnnouncement({
      title: annTitle,
      body: annBody,
      category: annCategory,
      pinned: annPinned,
    })
    setAnnTitle('')
    setAnnBody('')
  }

  const pendingComplaints = feedbackList.filter((f) => f.status !== 'Resolved')
  const openIssues = issueReports.filter((i) => i.status !== 'Resolved')
  const pendingRecs = adminRecommendations.filter((r) => r.status === 'Pending')
  const verifiedHygiene = hygieneChecks.filter((h) => h.verified).length

  const tabs: { id: AdminTab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview & AI Recs', count: pendingRecs.length },
    {
      id: 'complaints',
      label: 'Feedback & Complaints',
      count: pendingComplaints.length,
    },
    { id: 'menu', label: 'Weekly Menu' },
    { id: 'quality', label: 'Quality & Hygiene', count: openIssues.length },
    { id: 'waste', label: 'Waste Analytics' },
    {
      id: 'announcements',
      label: 'Announcements',
      count: announcements.length,
    },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Mess Administration Console"
        title="Operations, Complaints & Menu Control"
        subtitle="Manage hostel mess operations in one workspace. All updates synchronize live with the Student Dashboard, Menu Planner, Quality & Feedback pages."
      />

      {/* Admin Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#E2DFD5] pb-3">
        {tabs.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                active
                  ? 'bg-[#254C3A] text-[#F7F5EF] border-[#254C3A]'
                  : 'bg-white text-[#5A5E54] border-[#E2DFD5] hover:border-[#254C3A]/40 hover:text-[#252822]'
              }`}
            >
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] tabular-nums ${
                    active
                      ? 'bg-[#F7F5EF]/20 text-[#F7F5EF]'
                      : 'bg-[#F3F1EA] text-[#252822]'
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* TAB 1: Overview & AI Recommendations */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card padding="sm">
              <div className="text-xs text-[#5A5E54]">Pending Complaints</div>
              <div className="text-2xl font-semibold text-[#252822] mt-2 tabular-nums">
                {pendingComplaints.length}
              </div>
              <p className="text-[11px] text-[#6B6F64] mt-1">
                {feedbackList.length - pendingComplaints.length} resolved this
                week
              </p>
            </Card>
            <Card padding="sm">
              <div className="text-xs text-[#5A5E54]">Food Quality Reports</div>
              <div className="text-2xl font-semibold text-[#252822] mt-2 tabular-nums">
                {openIssues.length} open
              </div>
              <p className="text-[11px] text-[#6B6F64] mt-1">
                {issueReports.length} total logged issues
              </p>
            </Card>
            <Card padding="sm">
              <div className="text-xs text-[#5A5E54]">Hygiene Checklist</div>
              <div className="text-2xl font-semibold text-[#254C3A] mt-2 tabular-nums">
                {verifiedHygiene} / {hygieneChecks.length}
              </div>
              <p className="text-[11px] text-[#6B6F64] mt-1">
                Today&apos;s sanitation protocols
              </p>
            </Card>
            <Card padding="sm">
              <div className="text-xs text-[#5A5E54]">
                AI Operational Recs
              </div>
              <div className="text-2xl font-semibold text-[#252822] mt-2 tabular-nums">
                {pendingRecs.length} pending
              </div>
              <p className="text-[11px] text-[#6B6F64] mt-1">
                From Waste, Feedback &amp; Quality Agents
              </p>
            </Card>
          </div>

          {/* AI Recommendations Queue */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-medium text-[#252822]">
                  AI-Generated Operational Recommendations
                </h2>
                <p className="text-xs text-[#5A5E54]">
                  Review simulated agent proposals and approve or dismiss for
                  today&apos;s service
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {adminRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded border border-[#E2DFD5] bg-[#FAF9F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        tone={
                          rec.priority === 'High' ? 'terracotta' : 'neutral'
                        }
                      >
                        {rec.priority} Priority
                      </Badge>
                      <span className="text-[11px] font-medium text-[#254C3A]">
                        {rec.agentName}
                      </span>
                      {rec.status !== 'Pending' && (
                        <Badge
                          tone={rec.status === 'Approved' ? 'sage' : 'neutral'}
                        >
                          {rec.status}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-[#252822]">
                      {rec.title}
                    </h3>
                    <p className="text-xs text-[#5A5E54]">{rec.detail}</p>
                  </div>

                  {rec.status === 'Pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          updateAdminRecommendation(rec.id, 'Approved')
                        }
                        className="px-3 py-1.5 text-xs font-medium bg-[#254C3A] hover:bg-[#1D3D2E] text-[#F7F5EF] rounded inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateAdminRecommendation(rec.id, 'Dismissed')
                        }
                        className="px-3 py-1.5 text-xs font-medium bg-white border border-[#E2DFD5] hover:border-[#252822] text-[#5A5E54] rounded inline-flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Dismiss
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Feedback Overview Summary */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-medium text-[#252822]">
                Student Feedback Overview
              </h2>
              <button
                type="button"
                onClick={() => setTab('complaints')}
                className="text-xs font-medium text-[#254C3A] hover:underline cursor-pointer"
              >
                Manage All Feedback
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {(
                [
                  'Food Quality',
                  'Taste',
                  'Hygiene',
                  'Menu Variety',
                  'Service',
                ] as const
              ).map((cat) => {
                const count = feedbackList.filter(
                  (f) => f.category === cat
                ).length
                return (
                  <div
                    key={cat}
                    className="p-3 rounded bg-[#FAF9F5] border border-[#E2DFD5]"
                  >
                    <div className="text-[11px] text-[#6B6F64]">{cat}</div>
                    <div className="text-lg font-semibold text-[#252822] tabular-nums mt-0.5">
                      {count}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: Feedback & Pending Complaints */}
      {tab === 'complaints' && (
        <Card className="space-y-4">
          <div>
            <h2 className="font-serif text-lg font-medium text-[#252822]">
              Student Feedback &amp; Complaints Resolution Queue
            </h2>
            <p className="text-xs text-[#5A5E54]">
              Publish official management responses and update status—changes
              appear immediately on the Student Feedback page.
            </p>
          </div>

          <div className="space-y-3.5">
            {feedbackList.map((fb) => (
              <div
                key={fb.id}
                className="p-4 rounded border border-[#E2DFD5] bg-[#FAF9F5] space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-[#252822]">
                      {fb.studentName}
                    </span>
                    <Badge tone="neutral">{fb.mealSlot}</Badge>
                    <Badge tone="neutral">{fb.category}</Badge>
                    <Badge
                      tone={
                        fb.sentiment === 'Positive'
                          ? 'sage'
                          : fb.sentiment === 'Negative'
                            ? 'terracotta'
                            : 'neutral'
                      }
                    >
                      {fb.sentiment}
                    </Badge>
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

                <p className="text-xs text-[#252822]">{fb.comment}</p>

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E2DFD5]">
                  <input
                    type="text"
                    value={replyDrafts[fb.id] ?? fb.managementResponse ?? ''}
                    onChange={(e) =>
                      setReplyDrafts((prev) => ({
                        ...prev,
                        [fb.id]: e.target.value,
                      }))
                    }
                    placeholder="Write official management response..."
                    className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-[#E2DFD5] rounded focus:outline-none focus:border-[#254C3A]"
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        updateFeedbackStatus(
                          fb.id,
                          'In Review',
                          replyDrafts[fb.id] ?? fb.managementResponse
                        )
                      }
                      className="px-2.5 py-1.5 text-xs font-medium bg-white border border-[#E2DFD5] hover:border-[#C87859] text-[#252822] rounded cursor-pointer"
                    >
                      In Review
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateFeedbackStatus(
                          fb.id,
                          'Resolved',
                          replyDrafts[fb.id] ??
                            fb.managementResponse ??
                            'Issue acknowledged and addressed by Mess Supervisor.'
                        )
                      }
                      className="px-3 py-1.5 text-xs font-medium bg-[#254C3A] hover:bg-[#1D3D2E] text-[#F7F5EF] rounded cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 3: Weekly Menu Management */}
      {tab === 'menu' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <Card className="lg:col-span-5 space-y-4">
            <div>
              <h2 className="font-serif text-lg font-medium text-[#252822]">
                Edit Weekly Menu Item
              </h2>
              <p className="text-xs text-[#5A5E54]">
                Update dish names and items for any day &amp; meal slot.
              </p>
            </div>

            {menuSavedMsg && (
              <div className="p-2.5 rounded bg-[#ECF1EA] border border-[#C7D5C3] text-xs text-[#254C3A]">
                {menuSavedMsg}
              </div>
            )}

            <form onSubmit={handleSaveMenuEdit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#5A5E54] mb-1">
                    Day of Week
                  </label>
                  <select
                    value={editDay}
                    onChange={(e) =>
                      handleSelectMenuSlot(
                        e.target.value as DayOfWeek,
                        editSlot
                      )
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E2DFD5] rounded"
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#5A5E54] mb-1">
                    Meal Slot
                  </label>
                  <select
                    value={editSlot}
                    onChange={(e) =>
                      handleSelectMenuSlot(editDay, e.target.value as MealSlot)
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E2DFD5] rounded"
                  >
                    {MEAL_SLOTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5A5E54] mb-1">
                  Meal Headline
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E2DFD5] rounded focus:outline-none focus:border-[#254C3A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5A5E54] mb-1">
                  Included Dishes (comma-separated)
                </label>
                <textarea
                  rows={3}
                  value={editItemsText}
                  onChange={(e) => setEditItemsText(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-white border border-[#E2DFD5] rounded focus:outline-none focus:border-[#254C3A]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 text-xs font-medium bg-[#254C3A] hover:bg-[#1D3D2E] text-[#F7F5EF] rounded cursor-pointer"
              >
                Save Menu Changes
              </button>
            </form>
          </Card>

          <Card padding="none" className="lg:col-span-7 overflow-x-auto">
            <div className="px-4 py-3.5 border-b border-[#E2DFD5]">
              <h3 className="text-sm font-semibold text-[#252822]">
                Current Weekly Schedule (Click any cell to edit)
              </h3>
            </div>
            <table className="w-full text-left border-collapse min-w-[540px]">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E2DFD5] text-[10px] font-semibold uppercase text-[#5A5E54]">
                  <th className="py-2 px-3">Day</th>
                  {MEAL_SLOTS.map((s) => (
                    <th key={s} className="py-2 px-3">
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE3] text-[11px]">
                {DAYS_OF_WEEK.map((d) => (
                  <tr key={d}>
                    <td className="py-2.5 px-3 font-semibold text-[#252822]">
                      {d.slice(0, 3)}
                    </td>
                    {MEAL_SLOTS.map((s) => {
                      const active = editDay === d && editSlot === s
                      return (
                        <td key={s} className="py-2 px-2">
                          <button
                            type="button"
                            onClick={() => handleSelectMenuSlot(d, s)}
                            className={`w-full text-left p-1.5 rounded border transition-colors cursor-pointer ${
                              active
                                ? 'bg-[#ECF1EA] border-[#254C3A] text-[#254C3A] font-medium'
                                : 'bg-white border-transparent hover:border-[#E2DFD5] text-[#5A5E54]'
                            }`}
                          >
                            {weeklyMenu[d][s].title}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* TAB 4: Quality Reports & Hygiene Checklist */}
      {tab === 'quality' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <Card className="lg:col-span-7 space-y-4">
            <h2 className="font-serif text-lg font-medium text-[#252822]">
              Food Quality Issue Reports
            </h2>
            <div className="space-y-3">
              {issueReports.map((iss) => (
                <div
                  key={iss.id}
                  className="p-3.5 rounded border border-[#E2DFD5] bg-[#FAF9F5] space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#252822]">
                      #{iss.id.toUpperCase()} · {iss.mealSlot} ({iss.category})
                    </span>
                    <Badge
                      tone={
                        iss.status === 'Resolved'
                          ? 'sage'
                          : iss.status === 'Supervisor Checking'
                            ? 'terracotta'
                            : 'neutral'
                      }
                    >
                      {iss.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#5A5E54]">{iss.description}</p>
                  <div className="text-[11px] text-[#8E4329] bg-[#F7EAE4] border border-[#E9C9BC] rounded px-2.5 py-1.5">
                    Simulated AI Flag: {iss.aiObservation.flaggedConcern}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={noteDrafts[iss.id] ?? iss.supervisorNote ?? ''}
                      onChange={(e) =>
                        setNoteDrafts((prev) => ({
                          ...prev,
                          [iss.id]: e.target.value,
                        }))
                      }
                      placeholder="Verified supervisor action note..."
                      className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-[#E2DFD5] rounded"
                    />
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          updateIssueStatus(
                            iss.id,
                            'Supervisor Checking',
                            noteDrafts[iss.id] ?? iss.supervisorNote
                          )
                        }
                        className="px-2.5 py-1.5 text-xs bg-white border border-[#E2DFD5] rounded cursor-pointer"
                      >
                        Checking
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateIssueStatus(
                            iss.id,
                            'Resolved',
                            noteDrafts[iss.id] ??
                              iss.supervisorNote ??
                              'Physically inspected and resolved at serving counter.'
                          )
                        }
                        className="px-3 py-1.5 text-xs bg-[#254C3A] text-[#F7F5EF] rounded cursor-pointer"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-medium text-[#252822]">
                Daily Hygiene Checklist
              </h2>
              <Badge tone="forest">
                {verifiedHygiene}/{hygieneChecks.length}
              </Badge>
            </div>
            <div className="divide-y divide-[#EFECE3] border border-[#E2DFD5] rounded">
              {hygieneChecks.map((check) => (
                <button
                  key={check.id}
                  type="button"
                  onClick={() => toggleHygieneCheck(check.id)}
                  className="w-full text-left p-3 bg-white hover:bg-[#FAF9F5] flex items-start gap-2.5 cursor-pointer"
                >
                  {check.verified ? (
                    <CheckCircle2 className="w-4 h-4 text-[#254C3A] mt-0.5 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#C87859] mt-0.5 shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-medium text-[#252822]">
                      {check.task}
                    </div>
                    <div className="text-[11px] text-[#7D8176]">
                      {check.area} · {check.verifiedBy}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: Waste Analytics */}
      {tab === 'waste' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <Card className="lg:col-span-7">
            <h2 className="font-serif text-lg font-medium text-[#252822] mb-1">
              Weekly Waste Analytics
            </h2>
            <p className="text-xs text-[#5A5E54] mb-4">
              Plate &amp; prep waste tracked across all 7 days
            </p>
            <WasteBarChart data={wasteStats} height={240} />
          </Card>

          <Card className="lg:col-span-5 space-y-3">
            <h2 className="font-serif text-lg font-medium text-[#252822]">
              Active Waste Reduction Controls
            </h2>
            {wasteSuggestions.map((ws) => (
              <div
                key={ws.id}
                className="p-3 rounded bg-[#FAF9F5] border border-[#E2DFD5] flex items-start justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-semibold text-[#252822]">
                    {ws.title}
                  </div>
                  <div className="text-[11px] text-[#5A5E54] mt-0.5">
                    Est. -{ws.impactKgPerWeek} kg/wk · ₹{ws.savingsInrPerWeek}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleWasteSuggestion(ws.id)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded border shrink-0 cursor-pointer ${
                    ws.implemented
                      ? 'bg-[#254C3A] text-[#F7F5EF] border-[#254C3A]'
                      : 'bg-white text-[#5A5E54] border-[#E2DFD5]'
                  }`}
                >
                  {ws.implemented ? 'Active' : 'Enable'}
                </button>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* TAB 6: Announcements Management */}
      {tab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <Card className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#254C3A]" />
              <h2 className="font-serif text-lg font-medium text-[#252822]">
                Publish Mess Announcement
              </h2>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-[#5A5E54] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Sunday Special Lunch Timing Extended"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E2DFD5] rounded"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5A5E54] mb-1">
                  Category
                </label>
                <select
                  value={annCategory}
                  onChange={(e) =>
                    setAnnCategory(e.target.value as Announcement['category'])
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E2DFD5] rounded"
                >
                  <option value="Notice">Notice</option>
                  <option value="Menu Update">Menu Update</option>
                  <option value="Quality">Quality</option>
                  <option value="Poll">Poll</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5A5E54] mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={3}
                  value={annBody}
                  onChange={(e) => setAnnBody(e.target.value)}
                  placeholder="Write clear notice details for hostel residents..."
                  className="w-full px-2.5 py-2 text-xs bg-white border border-[#E2DFD5] rounded"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-[#5A5E54] cursor-pointer">
                <input
                  type="checkbox"
                  checked={annPinned}
                  onChange={(e) => setAnnPinned(e.target.checked)}
                  className="accent-[#254C3A]"
                />
                Pin to top of Student Dashboard
              </label>

              <button
                type="submit"
                className="w-full py-2 text-xs font-medium bg-[#254C3A] hover:bg-[#1D3D2E] text-[#F7F5EF] rounded cursor-pointer"
              >
                Publish Announcement
              </button>
            </form>
          </Card>

          <Card className="lg:col-span-7 space-y-3">
            <h2 className="font-serif text-lg font-medium text-[#252822]">
              Active Announcements ({announcements.length})
            </h2>
            <div className="space-y-2.5">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-3.5 rounded bg-[#FAF9F5] border border-[#E2DFD5] flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
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
                      <span className="text-xs font-semibold text-[#252822]">
                        {ann.title}
                      </span>
                    </div>
                    <p className="text-xs text-[#5A5E54]">{ann.body}</p>
                    <p className="text-[11px] text-[#7D8176]">
                      {ann.author} · {ann.timestamp}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleAnnouncementPin(ann.id)}
                      title={ann.pinned ? 'Unpin' : 'Pin'}
                      className={`p-1.5 rounded border cursor-pointer ${
                        ann.pinned
                          ? 'bg-[#F7EAE4] border-[#E9C9BC] text-[#9A4E33]'
                          : 'bg-white border-[#E2DFD5] text-[#7D8176]'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAnnouncement(ann.id)}
                      title="Delete announcement"
                      className="p-1.5 rounded border bg-white border-[#E2DFD5] text-[#7D8176] hover:text-[#9A4E33] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
