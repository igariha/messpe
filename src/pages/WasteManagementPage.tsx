import React, { useMemo, useState } from 'react'
import { Check, Leaf, TrendingDown } from 'lucide-react'
import { WasteBarChart } from '../components/Charts'
import {
  Badge,
  Card,
  SectionHeader,
  SimulationNotice,
} from '../components/ui'
import { useMesspe } from '../context/MesspeContext'
import { TODAY_DAY } from '../data/mockData'

type ForecastDayScenario =
  | 'Friday (Weekend Outpass)'
  | 'Saturday (Low Occupancy)'
  | 'Monday (Full Campus)'
  | 'Exam Week (High Retention)'

const FORECAST_SCENARIOS: Record<
  ForecastDayScenario,
  {
    breakfast: number
    lunch: number
    snacks: number
    dinner: number
    confidence: string
    batchNote: string
    deltaVsBaseline: string
  }
> = {
  'Friday (Weekend Outpass)': {
    breakfast: 380,
    lunch: 390,
    snacks: 310,
    dinner: 355,
    confidence: '91%',
    batchNote:
      'Reduce Friday dinner rice by 5 kg & wheat dough by 6 kg due to afternoon hostel outpass departures.',
    deltaVsBaseline: '-13.5% dinner demand',
  },
  'Saturday (Low Occupancy)': {
    breakfast: 395,
    lunch: 365,
    snacks: 330,
    dinner: 345,
    confidence: '89%',
    batchNote:
      'Maintain light afternoon khichdi batch; increase Sunday morning buffer for returning hostelers.',
    deltaVsBaseline: '-15.8% lunch demand',
  },
  'Monday (Full Campus)': {
    breakfast: 410,
    lunch: 445,
    snacks: 360,
    dinner: 405,
    confidence: '94%',
    batchNote:
      'Peak weekday turnout expected. Prepare full Rajma Chawal batch with half-portion rice ladle option.',
    deltaVsBaseline: '+6.2% vs weekend',
  },
  'Exam Week (High Retention)': {
    breakfast: 435,
    lunch: 455,
    snacks: 410,
    dinner: 440,
    confidence: '93%',
    batchNote:
      '96% hostel occupancy during end-semester exams. Increase evening snacks & midnight tea capacity by 15%.',
    deltaVsBaseline: '+11.4% total meals',
  },
}

export const WasteManagementPage: React.FC = () => {
  const {
    weeklyMenu,
    wasteStats,
    wasteSuggestions,
    toggleWasteSuggestion,
  } = useMesspe()

  const [scenario, setScenario] = useState<ForecastDayScenario>(
    'Friday (Weekend Outpass)'
  )

  const weeklyTotals = useMemo(() => {
    const prepared = wasteStats.reduce((s, d) => s + d.preparedKg, 0)
    const consumed = wasteStats.reduce((s, d) => s + d.consumedKg, 0)
    const plateWaste = wasteStats.reduce((s, d) => s + d.plateWasteKg, 0)
    const prepWaste = wasteStats.reduce((s, d) => s + d.prepWasteKg, 0)
    const totalWaste = plateWaste + prepWaste
    const utilizationPct = ((consumed / prepared) * 100).toFixed(1)
    return {
      prepared: prepared.toFixed(0),
      consumed: consumed.toFixed(0),
      plateWaste: plateWaste.toFixed(1),
      prepWaste: prepWaste.toFixed(1),
      totalWaste: totalWaste.toFixed(1),
      utilizationPct,
    }
  }, [wasteStats])

  const savingsSummary = useMemo(() => {
    const active = wasteSuggestions.filter((s) => s.implemented)
    const kgSaved = active.reduce((sum, s) => sum + s.impactKgPerWeek, 0)
    const inrSaved = active.reduce((sum, s) => sum + s.savingsInrPerWeek, 0)
    return {
      count: active.length,
      kgSaved: kgSaved.toFixed(1),
      inrSaved: inrSaved.toLocaleString('en-IN'),
    }
  }, [wasteSuggestions])

  const activeForecast = FORECAST_SCENARIOS[scenario]
  const todayMeals = weeklyMenu[TODAY_DAY]

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Waste Management"
        title="Meal Demand Prediction & Plate-Waste Analytics"
        subtitle="Administrative overview of daily food preparation vs consumption, simulated AI headcount forecasts, and actionable waste reduction levers."
      />

      <SimulationNotice label="Waste Prediction Agent" tone="sage">
        Demand predictions combine historical swipe-gate attendance, day-of-week
        patterns, and menu dish popularity scores to recommend exact cooking
        batch sizes.
      </SimulationNotice>

      {/* Top 4 Waste KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="text-xs text-[#5A5E54]">Weekly Food Prepared</div>
          <div className="text-2xl font-semibold text-[#252822] mt-2 tabular-nums">
            {weeklyTotals.prepared} kg
          </div>
          <p className="text-[11px] text-[#6B6F64] mt-1">
            {weeklyTotals.consumed} kg consumed ({weeklyTotals.utilizationPct}%
            yield)
          </p>
        </Card>

        <Card padding="sm">
          <div className="flex items-center justify-between text-xs text-[#5A5E54]">
            <span>Weekly Total Waste</span>
            <Badge tone="terracotta">Plate + Prep</Badge>
          </div>
          <div className="text-2xl font-semibold text-[#252822] mt-2 tabular-nums">
            {weeklyTotals.totalWaste} kg
          </div>
          <p className="text-[11px] text-[#6B6F64] mt-1 tabular-nums">
            {weeklyTotals.plateWaste} kg plate · {weeklyTotals.prepWaste} kg prep
          </p>
        </Card>

        <Card padding="sm">
          <div className="flex items-center justify-between text-xs text-[#5A5E54]">
            <span>Active Savings Projected</span>
            <TrendingDown className="w-4 h-4 text-[#254C3A]" />
          </div>
          <div className="text-2xl font-semibold text-[#254C3A] mt-2 tabular-nums">
            {savingsSummary.kgSaved} kg / wk
          </div>
          <p className="text-[11px] text-[#6B6F64] mt-1 tabular-nums">
            Est. ₹{savingsSummary.inrSaved} weekly cost saved (
            {savingsSummary.count} actions active)
          </p>
        </Card>

        <Card padding="sm">
          <div className="text-xs text-[#5A5E54]">
            Today&apos;s Est. Meal Demand ({TODAY_DAY})
          </div>
          <div className="text-2xl font-semibold text-[#252822] mt-2 tabular-nums">
            {todayMeals.Lunch.predictedServings} plates
          </div>
          <p className="text-[11px] text-[#6B6F64] mt-1 tabular-nums">
            B: {todayMeals.Breakfast.predictedServings} · S:{' '}
            {todayMeals.Snacks.predictedServings} · D:{' '}
            {todayMeals.Dinner.predictedServings}
          </p>
        </Card>
      </div>

      {/* Charts & AI Demand Predictor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Card className="lg:col-span-7">
          <div className="mb-3">
            <h2 className="font-serif text-lg font-medium text-[#252822]">
              7-Day Food Wastage Breakdown
            </h2>
            <p className="text-xs text-[#5A5E54]">
              Daily plate waste vs kitchen prep trimmings across the week
            </p>
          </div>
          <WasteBarChart data={wasteStats} height={240} />
        </Card>

        {/* Simulated AI Demand Prediction */}
        <Card className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-serif text-lg font-medium text-[#252822]">
                  AI Meal Demand Forecast
                </h2>
                <p className="text-xs text-[#5A5E54]">
                  Select schedule context to preview predicted headcount
                </p>
              </div>
              <Badge tone="sage">{activeForecast.confidence} conf.</Badge>
            </div>

            <select
              value={scenario}
              onChange={(e) =>
                setScenario(e.target.value as ForecastDayScenario)
              }
              className="w-full px-3 py-2 text-xs font-medium bg-[#FAF9F5] border border-[#E2DFD5] rounded focus:outline-none focus:border-[#254C3A]"
            >
              {(Object.keys(FORECAST_SCENARIOS) as ForecastDayScenario[]).map(
                (key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                )
              )}
            </select>

            <div className="grid grid-cols-2 gap-2.5 tabular-nums">
              {[
                { label: 'Breakfast', val: activeForecast.breakfast },
                { label: 'Lunch', val: activeForecast.lunch },
                { label: 'Snacks', val: activeForecast.snacks },
                { label: 'Dinner', val: activeForecast.dinner },
              ].map((m) => (
                <div
                  key={m.label}
                  className="p-3 rounded bg-[#FAF9F5] border border-[#E2DFD5]"
                >
                  <div className="text-[11px] text-[#6B6F64]">{m.label}</div>
                  <div className="text-lg font-semibold text-[#252822] mt-0.5">
                    {m.val}{' '}
                    <span className="text-[11px] font-normal text-[#7D8176]">
                      servings
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded bg-[#ECF1EA] border border-[#C7D5C3] space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#254C3A]">
              <span>Kitchen Batch Guidance</span>
              <span>{activeForecast.deltaVsBaseline}</span>
            </div>
            <p className="text-xs text-[#304237] leading-relaxed">
              {activeForecast.batchNote}
            </p>
          </div>
        </Card>
      </div>

      {/* Wastage Reduction Suggestions */}
      <section className="space-y-3">
        <div>
          <h2 className="font-serif text-lg font-medium text-[#252822]">
            AI Suggestions to Reduce Wastage
          </h2>
          <p className="text-xs text-[#5A5E54]">
            Toggle actions below to simulate weekly waste and cost impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wasteSuggestions.map((ws) => (
            <Card key={ws.id} className="flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge tone="sage">-{ws.impactKgPerWeek} kg / wk</Badge>
                  <span className="text-[11px] font-medium text-[#254C3A] tabular-nums">
                    Save ₹{ws.savingsInrPerWeek.toLocaleString('en-IN')}/wk
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-[#252822] leading-snug">
                  {ws.title}
                </h3>
                <p className="text-xs text-[#5A5E54] leading-relaxed">
                  {ws.rationale}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleWasteSuggestion(ws.id)}
                className={`w-full py-2 text-xs font-medium rounded border transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                  ws.implemented
                    ? 'bg-[#254C3A] text-[#F7F5EF] border-[#254C3A]'
                    : 'bg-white text-[#252822] border-[#E2DFD5] hover:border-[#254C3A]'
                }`}
              >
                {ws.implemented ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Implemented
                  </>
                ) : (
                  <>
                    <Leaf className="w-3.5 h-3.5" /> Implement Suggestion
                  </>
                )}
              </button>
            </Card>
          ))}
        </div>
      </section>

      {/* Weekly Waste Analysis Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2DFD5]">
          <h2 className="font-serif text-lg font-medium text-[#252822]">
            Weekly Waste Analysis Log
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E2DFD5] text-[11px] font-semibold uppercase tracking-wider text-[#5A5E54]">
                <th className="py-2.5 px-5">Day</th>
                <th className="py-2.5 px-4">Diners</th>
                <th className="py-2.5 px-4">Prepared</th>
                <th className="py-2.5 px-4">Consumed</th>
                <th className="py-2.5 px-4">Plate Waste</th>
                <th className="py-2.5 px-5">Primary Waste Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE3] text-xs tabular-nums">
              {wasteStats.map((d) => (
                <tr key={d.day} className="bg-white">
                  <td className="py-3 px-5 font-medium text-[#252822]">
                    {d.day}
                  </td>
                  <td className="py-3 px-4 text-[#5A5E54]">
                    {d.expectedStudents}
                  </td>
                  <td className="py-3 px-4 text-[#5A5E54]">{d.preparedKg} kg</td>
                  <td className="py-3 px-4 text-[#254C3A] font-medium">
                    {d.consumedKg} kg
                  </td>
                  <td className="py-3 px-4">
                    <Badge tone={d.plateWasteKg > 15 ? 'terracotta' : 'neutral'}>
                      {d.plateWasteKg} kg
                    </Badge>
                  </td>
                  <td className="py-3 px-5 text-[#5A5E54] font-sans">
                    {d.topWastedDish}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
