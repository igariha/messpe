export type PageId =
  | 'dashboard'
  | 'menu'
  | 'quality'
  | 'feedback'
  | 'nutrition'
  | 'waste'
  | 'agents'
  | 'admin'

export type MealSlot = 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner'

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

export type DietaryTag =
  | 'Vegetarian'
  | 'Vegan-Friendly'
  | 'High-Protein'
  | 'Jain Option'

export interface NutritionEstimate {
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber: number
}

export interface MealItem {
  id: string
  slot: MealSlot
  timing: string
  title: string
  items: string[]
  image: string
  rating: number
  ratingCount: number
  userRating?: number
  tags: DietaryTag[]
  nutrition: NutritionEstimate
  wasteRatePercent: number
  predictedServings: number
}

export type WeeklyMenu = Record<DayOfWeek, Record<MealSlot, MealItem>>

export interface Announcement {
  id: string
  title: string
  body: string
  category: 'Notice' | 'Menu Update' | 'Quality' | 'Poll'
  timestamp: string
  pinned: boolean
  author: string
}

export interface HygieneCheckItem {
  id: string
  task: string
  area: 'Prep Kitchen' | 'Storage' | 'Serving Counter' | 'Dishwashing'
  verified: boolean
  verifiedAt: string
  verifiedBy: string
  reading?: string
}

export interface QualityUpdate {
  id: string
  parameter: string
  reading: string
  benchmark: string
  status: 'Verified' | 'Monitor'
  checkedAt: string
  inspector: string
}

export interface InspectionRecord {
  id: string
  date: string
  inspector: string
  score: number
  status: 'Passed' | 'Action Noted'
  summary: string
}

export interface FoodIssueReport {
  id: string
  mealSlot: MealSlot
  category: 'Temperature' | 'Undercooked' | 'Hygiene' | 'Freshness' | 'Portion'
  description: string
  reportedAt: string
  reportedBy: string
  imageUrl?: string
  status: 'Reported' | 'Supervisor Checking' | 'Resolved'
  aiObservation: {
    summary: string
    flaggedConcern: string
    recommendedCheck: string
    disclaimer: string
  }
  supervisorNote?: string
}

export type FeedbackCategory =
  | 'Food Quality'
  | 'Taste'
  | 'Hygiene'
  | 'Menu Variety'
  | 'Service'

export type Sentiment = 'Positive' | 'Neutral' | 'Negative'

export interface FeedbackItem {
  id: string
  studentName: string
  anonymous: boolean
  mealSlot: MealSlot
  rating: number
  comment: string
  submittedAt: string
  category: FeedbackCategory
  sentiment: Sentiment
  sentimentConfidence: number
  aiSummary: string
  status: 'Open' | 'In Review' | 'Resolved'
  managementResponse?: string
}

export interface WasteDayStat {
  day: string
  shortDay: string
  expectedStudents: number
  preparedKg: number
  consumedKg: number
  plateWasteKg: number
  prepWasteKg: number
  topWastedDish: string
}

export interface WasteSuggestion {
  id: string
  title: string
  impactKgPerWeek: number
  savingsInrPerWeek: number
  rationale: string
  implemented: boolean
}

export interface MenuAISuggestion {
  id: string
  day: DayOfWeek
  slot: MealSlot
  currentTitle: string
  suggestedTitle: string
  suggestedItems: string[]
  suggestedNutrition: NutritionEstimate
  suggestedTags: DietaryTag[]
  reason: string
  projectedRatingLift: string
  projectedWasteDrop: string
  applied: boolean
}

export interface AdminRecommendation {
  id: string
  agentName: string
  priority: 'High' | 'Medium' | 'Low'
  title: string
  detail: string
  status: 'Pending' | 'Approved' | 'Dismissed'
}

export type AgentId =
  | 'menu-agent'
  | 'quality-agent'
  | 'feedback-agent'
  | 'nutrition-agent'
  | 'waste-agent'

export interface AgentInfo {
  id: AgentId
  name: string
  shortRole: string
  responsibility: string
  status: 'Active · Monitoring' | 'Active · Ready'
  lastRun: string
  centralChannel: string
  exampleInput: string
  exampleOutput: string
  sampleScenarios: {
    label: string
    input: string
    output: string
    orchestratorMessage: string
  }[]
}
