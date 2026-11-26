import React, { useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  FileCheck2,
  ImagePlus,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import {
  Badge,
  Card,
  SectionHeader,
  SimulationNotice,
} from '../components/ui'
import { useMesspe } from '../context/MesspeContext'
import type { FoodIssueReport, MealSlot } from '../types/messpe'

const ISSUE_CATEGORIES: FoodIssueReport['category'][] = [
  'Temperature',
  'Undercooked',
  'Hygiene',
  'Freshness',
  'Portion',
]

export const QualityHygienePage: React.FC = () => {
  const {
    qualityUpdates,
    hygieneChecks,
    inspections,
    issueReports,
    toggleHygieneCheck,
    submitFoodIssueReport,
  } = useMesspe()

  const [mealSlot, setMealSlot] = useState<MealSlot>('Lunch')
  const [category, setCategory] =
    useState<FoodIssueReport['category']>('Temperature')
  const [description, setDescription] = useState('')
  const [reportedBy, setReportedBy] = useState('Aarav Sharma (Room 204)')
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  )
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return
    const created = submitFoodIssueReport({
      mealSlot,
      category,
      description,
      reportedBy,
      imageUrl: imagePreview,
    })
    setDescription('')
    setImagePreview(undefined)
    setSubmitSuccess(
      `Report ${created.id} submitted. Food Quality Agent generated a simulated observation for Mess Supervisor verification.`
    )
  }

  const verifiedCount = hygieneChecks.filter((h) => h.verified).length

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Food Quality & Hygiene"
        title="Kitchen Standards, Inspections & Issue Triage"
        subtitle="Track daily kitchen safety checks, verified inspection logs, and report meal-level quality concerns with optional photo evidence."
      />

      {/* Explicit Separation Banner */}
      <SimulationNotice label="Verification Standard" tone="terracotta">
        <strong>Distinction Notice:</strong> Verified inspection scores and
        sensor logs below represent physical Mess Supervisor checks. Any
        AI-generated observations on uploaded photos or student reports are{' '}
        <strong>simulated visual triage aids only</strong> and never replace
        certified food safety testing.
      </SimulationNotice>

      {/* Top Grid: Daily Quality Updates + Kitchen Hygiene Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Daily Quality Updates */}
        <Card className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-medium text-[#252822]">
                Daily Quality Measurements
              </h2>
              <p className="text-xs text-[#5A5E54]">
                Verified kitchen intake &amp; equipment checks
              </p>
            </div>
            <Badge tone="sage">Verified Logs</Badge>
          </div>

          <div className="space-y-2.5">
            {qualityUpdates.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded bg-[#FAF9F5] border border-[#E2DFD5] flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-semibold text-[#252822]">
                    {item.parameter}
                  </div>
                  <div className="text-[11px] text-[#6B6F64] mt-0.5">
                    Target: {item.benchmark} · {item.checkedAt}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold tabular-nums text-[#252822]">
                    {item.reading}
                  </div>
                  <Badge
                    tone={item.status === 'Verified' ? 'sage' : 'terracotta'}
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Kitchen Hygiene Checklist */}
        <Card className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-lg font-medium text-[#252822]">
                Kitchen Hygiene Checklist
              </h2>
              <p className="text-xs text-[#5A5E54]">
                Click any item to simulate supervisor sign-off verification
              </p>
            </div>
            <Badge tone="forest" className="tabular-nums">
              {verifiedCount} / {hygieneChecks.length} Verified
            </Badge>
          </div>

          <div className="divide-y divide-[#EFECE3] border border-[#E2DFD5] rounded overflow-hidden">
            {hygieneChecks.map((check) => (
              <button
                key={check.id}
                type="button"
                onClick={() => toggleHygieneCheck(check.id)}
                className="w-full text-left px-3.5 py-3 bg-white hover:bg-[#FAF9F5] transition-colors flex items-start justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-start gap-2.5">
                  {check.verified ? (
                    <CheckCircle2 className="w-4 h-4 text-[#254C3A] mt-0.5 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#C87859] mt-0.5 shrink-0" />
                  )}
                  <div>
                    <div
                      className={`text-xs font-medium ${
                        check.verified ? 'text-[#252822]' : 'text-[#9A4E33]'
                      }`}
                    >
                      {check.task}
                    </div>
                    <div className="text-[11px] text-[#7D8176] mt-0.5">
                      {check.area} · {check.verifiedBy} · {check.verifiedAt}
                    </div>
                  </div>
                </div>
                {check.reading && (
                  <Badge tone={check.verified ? 'sage' : 'neutral'}>
                    {check.reading}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Report Issue Form + Reported Issues Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Report Form */}
        <Card className="lg:col-span-5">
          <h2 className="font-serif text-lg font-medium text-[#252822]">
            Report a Food-Related Issue
          </h2>
          <p className="text-xs text-[#5A5E54] mt-0.5 mb-4">
            Attach a photo from your plate or describe the concern. The Food
            Quality Agent logs an initial observation for the mess supervisor.
          </p>

          {submitSuccess && (
            <div className="mb-4 p-3 rounded bg-[#ECF1EA] border border-[#C7D5C3] text-xs text-[#254C3A]">
              {submitSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#5A5E54] mb-1">
                  Meal Slot
                </label>
                <select
                  value={mealSlot}
                  onChange={(e) => setMealSlot(e.target.value as MealSlot)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E2DFD5] rounded focus:outline-none focus:border-[#254C3A]"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#5A5E54] mb-1">
                  Issue Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as FoodIssueReport['category'])
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E2DFD5] rounded focus:outline-none focus:border-[#254C3A]"
                >
                  {ISSUE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#5A5E54] mb-1">
                Student Name / Room
              </label>
              <input
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E2DFD5] rounded focus:outline-none focus:border-[#254C3A]"
                placeholder="e.g. Aarav Sharma (Room 204)"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#5A5E54] mb-1">
                Issue Description
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe counter number, dish name, and observation..."
                className="w-full px-2.5 py-2 text-xs bg-white border border-[#E2DFD5] rounded focus:outline-none focus:border-[#254C3A]"
              />
            </div>

            {/* Image Upload + Quick Sample Attach */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-[#5A5E54]">
                  Food Image Upload (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setImagePreview('/images/lunch-thali.jpg')}
                  className="text-[11px] text-[#254C3A] hover:underline cursor-pointer"
                >
                  Use sample plate photo
                </button>
              </div>

              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center gap-1.5 p-4 border border-dashed border-[#C7C3B6] rounded bg-[#FAF9F5] hover:bg-[#F3F1EA] transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 text-[#5A5E54]" />
                  <span className="text-xs text-[#5A5E54]">
                    Click to upload food snapshot (JPG / PNG)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative border border-[#E2DFD5] rounded overflow-hidden bg-[#FAF9F5]">
                  <img
                    src={imagePreview}
                    alt="Uploaded food preview"
                    className="w-full h-36 object-cover"
                  />
                  <div className="px-2.5 py-1.5 flex items-center justify-between text-[11px] bg-white border-t border-[#E2DFD5]">
                    <span className="inline-flex items-center gap-1 text-[#254C3A] font-medium">
                      <ImagePlus className="w-3.5 h-3.5" /> Image attached for
                      preview
                    </span>
                    <button
                      type="button"
                      onClick={() => setImagePreview(undefined)}
                      className="text-[#9A4E33] hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 text-xs font-medium bg-[#254C3A] hover:bg-[#1D3D2E] text-[#F7F5EF] rounded transition-colors cursor-pointer"
            >
              Submit Report &amp; Run Simulated AI Triage
            </button>
          </form>
        </Card>

        {/* Reported Issues & AI Observations */}
        <Card className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-medium text-[#252822]">
                Reported Issues &amp; Simulated AI Observations
              </h2>
              <p className="text-xs text-[#5A5E54]">
                Live status updates synced with Admin Panel
              </p>
            </div>
            <Badge tone="neutral">{issueReports.length} Reports</Badge>
          </div>

          <div className="space-y-3.5">
            {issueReports.map((iss) => (
              <div
                key={iss.id}
                className="border border-[#E2DFD5] rounded-md p-3.5 bg-[#FAF9F5] space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#252822]">
                      #{iss.id.toUpperCase()} · {iss.mealSlot} ({iss.category})
                    </span>
                  </div>
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

                <div className="flex flex-col sm:flex-row gap-3">
                  {iss.imageUrl && (
                    <img
                      src={iss.imageUrl}
                      alt="Reported meal"
                      className="w-full sm:w-28 h-24 object-cover rounded border border-[#E2DFD5] shrink-0"
                    />
                  )}
                  <div className="space-y-1 flex-1">
                    <p className="text-xs text-[#252822] leading-relaxed">
                      {iss.description}
                    </p>
                    <p className="text-[11px] text-[#7D8176]">
                      Reported by {iss.reportedBy} · {iss.reportedAt}
                    </p>
                  </div>
                </div>

                {/* Clearly Labeled Simulated AI Observation */}
                <div className="p-2.5 rounded bg-white border border-[#E2DFD5] space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9A4E33]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Simulated AI Observation (Unverified)
                    </span>
                  </div>
                  <p className="text-xs text-[#5A5E54]">
                    {iss.aiObservation.summary}
                  </p>
                  <p className="text-[11px] text-[#252822]">
                    <span className="font-medium">Suggested Check:</span>{' '}
                    {iss.aiObservation.recommendedCheck}
                  </p>
                  <p className="text-[10px] text-[#8A8D82] italic">
                    {iss.aiObservation.disclaimer}
                  </p>
                </div>

                {iss.supervisorNote && (
                  <div className="p-2.5 rounded bg-[#ECF1EA] border border-[#C7D5C3] text-xs text-[#254C3A] flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">
                        Verified Supervisor Resolution:{' '}
                      </span>
                      {iss.supervisorNote}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Verified Food Inspection Records Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2DFD5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[#254C3A]" />
            <h2 className="font-serif text-lg font-medium text-[#252822]">
              Verified Food Safety Inspection Records
            </h2>
          </div>
          <Badge tone="sage">Official Audits</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E2DFD5] text-[11px] font-semibold uppercase tracking-wider text-[#5A5E54]">
                <th className="py-2.5 px-5">Date</th>
                <th className="py-2.5 px-4">Inspector</th>
                <th className="py-2.5 px-4">Score</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-5">Verified Findings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE3] text-xs">
              {inspections.map((rec) => (
                <tr key={rec.id} className="bg-white">
                  <td className="py-3 px-5 font-medium text-[#252822] tabular-nums whitespace-nowrap">
                    {rec.date}
                  </td>
                  <td className="py-3 px-4 text-[#5A5E54] whitespace-nowrap">
                    {rec.inspector}
                  </td>
                  <td className="py-3 px-4 font-semibold tabular-nums text-[#252822]">
                    {rec.score} / 100
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      tone={rec.status === 'Passed' ? 'sage' : 'terracotta'}
                    >
                      {rec.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-5 text-[#5A5E54]">{rec.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
