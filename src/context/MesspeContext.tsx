import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  INITIAL_ADMIN_RECOMMENDATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_FEEDBACK,
  INITIAL_HYGIENE_CHECKS,
  INITIAL_INSPECTIONS,
  INITIAL_ISSUE_REPORTS,
  INITIAL_QUALITY_UPDATES,
  INITIAL_WASTE_STATS,
  INITIAL_WASTE_SUGGESTIONS,
  INITIAL_WEEKLY_MENU,
  MENU_AI_SUGGESTIONS,
  TODAY_DAY,
} from '../data/mockData'
import type {
  AdminRecommendation,
  Announcement,
  DayOfWeek,
  FeedbackItem,
  FoodIssueReport,
  HygieneCheckItem,
  InspectionRecord,
  MealItem,
  MealSlot,
  MenuAISuggestion,
  PageId,
  QualityUpdate,
  WasteDayStat,
  WasteSuggestion,
  WeeklyMenu,
} from '../types/messpe'
import {
  analyzeStudentFeedback,
  generateSimulatedQualityObservation,
} from '../utils/aiSimulator'

const STORAGE_KEY = 'messpe_prototype_state_v1'

interface MesspeState {
  weeklyMenu: WeeklyMenu
  announcements: Announcement[]
  hygieneChecks: HygieneCheckItem[]
  qualityUpdates: QualityUpdate[]
  inspections: InspectionRecord[]
  issueReports: FoodIssueReport[]
  feedbackList: FeedbackItem[]
  wasteStats: WasteDayStat[]
  wasteSuggestions: WasteSuggestion[]
  menuSuggestions: MenuAISuggestion[]
  adminRecommendations: AdminRecommendation[]
}

interface MesspeContextValue extends MesspeState {
  activePage: PageId
  setActivePage: (page: PageId) => void
  selectedPlannerDay: DayOfWeek
  setSelectedPlannerDay: (day: DayOfWeek) => void
  rateMeal: (day: DayOfWeek, slot: MealSlot, stars: number) => void
  updateMealItem: (
    day: DayOfWeek,
    slot: MealSlot,
    updates: Partial<MealItem>
  ) => void
  applyMenuSuggestion: (suggestionId: string) => void
  generateImprovedWeeklyMenu: () => number
  resetWeeklyMenuToDefault: () => void
  toggleHygieneCheck: (checkId: string) => void
  submitFoodIssueReport: (payload: {
    mealSlot: MealSlot
    category: FoodIssueReport['category']
    description: string
    reportedBy: string
    imageUrl?: string
  }) => FoodIssueReport
  updateIssueStatus: (
    issueId: string,
    status: FoodIssueReport['status'],
    supervisorNote?: string
  ) => void
  submitFeedback: (payload: {
    studentName: string
    anonymous: boolean
    mealSlot: MealSlot
    rating: number
    comment: string
  }) => FeedbackItem
  updateFeedbackStatus: (
    feedbackId: string,
    status: FeedbackItem['status'],
    managementResponse?: string
  ) => void
  toggleWasteSuggestion: (suggestionId: string) => void
  updateAdminRecommendation: (
    recId: string,
    status: 'Approved' | 'Dismissed'
  ) => void
  addAnnouncement: (payload: {
    title: string
    body: string
    category: Announcement['category']
    pinned: boolean
  }) => void
  toggleAnnouncementPin: (id: string) => void
  deleteAnnouncement: (id: string) => void
  resetDemoData: () => void
}

const defaultPersistedState = (): MesspeState => ({
  weeklyMenu: INITIAL_WEEKLY_MENU,
  announcements: INITIAL_ANNOUNCEMENTS,
  hygieneChecks: INITIAL_HYGIENE_CHECKS,
  qualityUpdates: INITIAL_QUALITY_UPDATES,
  inspections: INITIAL_INSPECTIONS,
  issueReports: INITIAL_ISSUE_REPORTS,
  feedbackList: INITIAL_FEEDBACK,
  wasteStats: INITIAL_WASTE_STATS,
  wasteSuggestions: INITIAL_WASTE_SUGGESTIONS,
  menuSuggestions: MENU_AI_SUGGESTIONS,
  adminRecommendations: INITIAL_ADMIN_RECOMMENDATIONS,
})

const MesspeContext = createContext<MesspeContextValue | null>(null)

export const MesspeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  const [selectedPlannerDay, setSelectedPlannerDay] =
    useState<DayOfWeek>(TODAY_DAY)

  const [state, setState] = useState<MesspeState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        return { ...defaultPersistedState(), ...JSON.parse(raw) }
      }
    } catch {
      // ignore corrupted storage
    }
    return defaultPersistedState()
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore storage quota errors
    }
  }, [state])

  const rateMeal = (day: DayOfWeek, slot: MealSlot, stars: number) => {
    setState((prev) => {
      const target = prev.weeklyMenu[day][slot]
      const alreadyRated = target.userRating !== undefined
      const baseCount = alreadyRated ? target.ratingCount : target.ratingCount + 1
      const previousUser = target.userRating ?? 0
      const totalScore =
        target.rating * target.ratingCount - previousUser + stars
      const nextRating = Number((totalScore / baseCount).toFixed(2))

      return {
        ...prev,
        weeklyMenu: {
          ...prev.weeklyMenu,
          [day]: {
            ...prev.weeklyMenu[day],
            [slot]: {
              ...target,
              rating: Math.min(5, Math.max(1, nextRating)),
              ratingCount: baseCount,
              userRating: stars,
            },
          },
        },
      }
    })
  }

  const updateMealItem = (
    day: DayOfWeek,
    slot: MealSlot,
    updates: Partial<MealItem>
  ) => {
    setState((prev) => ({
      ...prev,
      weeklyMenu: {
        ...prev.weeklyMenu,
        [day]: {
          ...prev.weeklyMenu[day],
          [slot]: {
            ...prev.weeklyMenu[day][slot],
            ...updates,
          },
        },
      },
    }))
  }

  const applyMenuSuggestion = (suggestionId: string) => {
    setState((prev) => {
      const sug = prev.menuSuggestions.find((s) => s.id === suggestionId)
      if (!sug || sug.applied) return prev

      const currentMeal = prev.weeklyMenu[sug.day][sug.slot]
      const updatedMeal: MealItem = {
        ...currentMeal,
        title: sug.suggestedTitle,
        items: sug.suggestedItems,
        nutrition: sug.suggestedNutrition,
        tags: sug.suggestedTags,
        rating: Number(Math.min(4.8, currentMeal.rating + 0.7).toFixed(1)),
        wasteRatePercent: Math.max(4, Math.round(currentMeal.wasteRatePercent * 0.45)),
      }

      return {
        ...prev,
        weeklyMenu: {
          ...prev.weeklyMenu,
          [sug.day]: {
            ...prev.weeklyMenu[sug.day],
            [sug.slot]: updatedMeal,
          },
        },
        menuSuggestions: prev.menuSuggestions.map((item) =>
          item.id === suggestionId ? { ...item, applied: true } : item
        ),
      }
    })
  }

  const generateImprovedWeeklyMenu = (): number => {
    let appliedCount = 0
    setState((prev) => {
      const nextMenu: WeeklyMenu = { ...prev.weeklyMenu }
      const nextSuggestions = prev.menuSuggestions.map((sug) => {
        if (sug.applied) return sug
        appliedCount += 1
        const current = nextMenu[sug.day][sug.slot]
        nextMenu[sug.day] = {
          ...nextMenu[sug.day],
          [sug.slot]: {
            ...current,
            title: sug.suggestedTitle,
            items: sug.suggestedItems,
            nutrition: sug.suggestedNutrition,
            tags: sug.suggestedTags,
            rating: Number(Math.min(4.8, current.rating + 0.7).toFixed(1)),
            wasteRatePercent: Math.max(4, Math.round(current.wasteRatePercent * 0.45)),
          },
        }
        return { ...sug, applied: true }
      })

      return {
        ...prev,
        weeklyMenu: nextMenu,
        menuSuggestions: nextSuggestions,
      }
    })
    return appliedCount
  }

  const resetWeeklyMenuToDefault = () => {
    setState((prev) => ({
      ...prev,
      weeklyMenu: INITIAL_WEEKLY_MENU,
      menuSuggestions: MENU_AI_SUGGESTIONS,
    }))
  }

  const toggleHygieneCheck = (checkId: string) => {
    setState((prev) => ({
      ...prev,
      hygieneChecks: prev.hygieneChecks.map((item) =>
        item.id === checkId
          ? {
              ...item,
              verified: !item.verified,
              verifiedAt: !item.verified ? 'Just now' : 'Pending verification',
              verifiedBy: !item.verified ? 'Mess Supervisor (Live)' : 'Unchecked',
            }
          : item
      ),
    }))
  }

  const submitFoodIssueReport = (payload: {
    mealSlot: MealSlot
    category: FoodIssueReport['category']
    description: string
    reportedBy: string
    imageUrl?: string
  }) => {
    const aiObservation = generateSimulatedQualityObservation(
      payload.category,
      payload.mealSlot,
      payload.description,
      Boolean(payload.imageUrl)
    )
    const newReport: FoodIssueReport = {
      id: `iss-${Math.floor(106 + Math.random() * 890)}`,
      mealSlot: payload.mealSlot,
      category: payload.category,
      description: payload.description,
      reportedAt: 'Just now',
      reportedBy: payload.reportedBy.trim() || 'Student Hosteler',
      imageUrl: payload.imageUrl,
      status: 'Reported',
      aiObservation,
    }
    setState((prev) => ({
      ...prev,
      issueReports: [newReport, ...prev.issueReports],
    }))
    return newReport
  }

  const updateIssueStatus = (
    issueId: string,
    status: FoodIssueReport['status'],
    supervisorNote?: string
  ) => {
    setState((prev) => ({
      ...prev,
      issueReports: prev.issueReports.map((iss) =>
        iss.id === issueId
          ? {
              ...iss,
              status,
              supervisorNote:
                supervisorNote !== undefined ? supervisorNote : iss.supervisorNote,
            }
          : iss
      ),
    }))
  }

  const submitFeedback = (payload: {
    studentName: string
    anonymous: boolean
    mealSlot: MealSlot
    rating: number
    comment: string
  }) => {
    const analysis = analyzeStudentFeedback(
      payload.comment,
      payload.rating,
      payload.mealSlot
    )
    const item: FeedbackItem = {
      id: `fb-${Date.now().toString().slice(-4)}`,
      studentName: payload.anonymous
        ? 'Anonymous Hosteler'
        : payload.studentName.trim() || 'Hostel Student',
      anonymous: payload.anonymous,
      mealSlot: payload.mealSlot,
      rating: payload.rating,
      comment: payload.comment.trim(),
      submittedAt: 'Just now',
      category: analysis.category,
      sentiment: analysis.sentiment,
      sentimentConfidence: analysis.confidence,
      aiSummary: analysis.aiSummary,
      status: analysis.sentiment === 'Negative' ? 'In Review' : 'Open',
      managementResponse:
        analysis.sentiment === 'Negative'
          ? `Auto-triage note: ${analysis.suggestedReply}`
          : undefined,
    }
    setState((prev) => ({
      ...prev,
      feedbackList: [item, ...prev.feedbackList],
    }))
    return item
  }

  const updateFeedbackStatus = (
    feedbackId: string,
    status: FeedbackItem['status'],
    managementResponse?: string
  ) => {
    setState((prev) => ({
      ...prev,
      feedbackList: prev.feedbackList.map((fb) =>
        fb.id === feedbackId
          ? {
              ...fb,
              status,
              managementResponse:
                managementResponse !== undefined
                  ? managementResponse
                  : fb.managementResponse,
            }
          : fb
      ),
    }))
  }

  const toggleWasteSuggestion = (suggestionId: string) => {
    setState((prev) => ({
      ...prev,
      wasteSuggestions: prev.wasteSuggestions.map((ws) =>
        ws.id === suggestionId
          ? { ...ws, implemented: !ws.implemented }
          : ws
      ),
    }))
  }

  const updateAdminRecommendation = (
    recId: string,
    status: 'Approved' | 'Dismissed'
  ) => {
    setState((prev) => ({
      ...prev,
      adminRecommendations: prev.adminRecommendations.map((rec) =>
        rec.id === recId ? { ...rec, status } : rec
      ),
    }))
  }

  const addAnnouncement = (payload: {
    title: string
    body: string
    category: Announcement['category']
    pinned: boolean
  }) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now().toString().slice(-4)}`,
      title: payload.title.trim(),
      body: payload.body.trim(),
      category: payload.category,
      timestamp: 'Just now',
      pinned: payload.pinned,
      author: 'Mess Administrator',
    }
    setState((prev) => ({
      ...prev,
      announcements: [newAnn, ...prev.announcements],
    }))
  }

  const toggleAnnouncementPin = (id: string) => {
    setState((prev) => ({
      ...prev,
      announcements: prev.announcements.map((a) =>
        a.id === id ? { ...a, pinned: !a.pinned } : a
      ),
    }))
  }

  const deleteAnnouncement = (id: string) => {
    setState((prev) => ({
      ...prev,
      announcements: prev.announcements.filter((a) => a.id !== id),
    }))
  }

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY)
    setState(defaultPersistedState())
    setSelectedPlannerDay(TODAY_DAY)
  }

  return (
    <MesspeContext.Provider
      value={{
        ...state,
        activePage,
        setActivePage,
        selectedPlannerDay,
        setSelectedPlannerDay,
        rateMeal,
        updateMealItem,
        applyMenuSuggestion,
        generateImprovedWeeklyMenu,
        resetWeeklyMenuToDefault,
        toggleHygieneCheck,
        submitFoodIssueReport,
        updateIssueStatus,
        submitFeedback,
        updateFeedbackStatus,
        toggleWasteSuggestion,
        updateAdminRecommendation,
        addAnnouncement,
        toggleAnnouncementPin,
        deleteAnnouncement,
        resetDemoData,
      }}
    >
      {children}
    </MesspeContext.Provider>
  )
}

export function useMesspe() {
  const ctx = useContext(MesspeContext)
  if (!ctx) {
    throw new Error('useMesspe must be used within MesspeProvider')
  }
  return ctx
}
