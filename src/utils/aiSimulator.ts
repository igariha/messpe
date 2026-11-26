import type {
  FeedbackCategory,
  FoodIssueReport,
  MealSlot,
  Sentiment,
} from '../types/messpe'

/**
 * Simulated Student Feedback Agent:
 * Classifies complaints/suggestions into one of 5 canonical Messpe categories,
 * estimates sentiment, confidence, and creates a concise operational summary.
 */
export function analyzeStudentFeedback(
  comment: string,
  rating: number,
  mealSlot: MealSlot
): {
  category: FeedbackCategory
  sentiment: Sentiment
  confidence: number
  aiSummary: string
  suggestedReply: string
} {
  const text = comment.toLowerCase()

  let category: FeedbackCategory = 'Taste'
  if (
    /clean|hygien|hair|insect|fly|gloves|plate|wash|dirty|stale|smell|spoil|water|oil/.test(
      text
    )
  ) {
    category = 'Hygiene'
  } else if (
    /undercook|raw|cold|lukewarm|hard|soft|overcook|watery|thick|quality|paneer|dal|rice/.test(
      text
    )
  ) {
    category = 'Food Quality'
  } else if (
    /repeat|variety|same|boring|every week|option|vegan|jain|menu|swap|sprout/.test(
      text
    )
  ) {
    category = 'Menu Variety'
  } else if (
    /queue|line|slow|staff|counter|timing|late|empty|refill|portion|less/.test(
      text
    )
  ) {
    category = 'Service'
  }

  let sentiment: Sentiment = 'Neutral'
  const positiveHits = (
    text.match(
      /good|great|nice|love|fresh|hot|tasty|better|appreciate|awesome|clean|crispy|soft/g
    ) || []
  ).length
  const negativeHits = (
    text.match(
      /bad|cold|dirty|undercook|raw|less|slow|worst|oily|watery|stale|boring|repeat|delay|smell|hard|hair/g
    ) || []
  ).length

  if (rating >= 4 && negativeHits === 0) {
    sentiment = 'Positive'
  } else if (rating <= 2 || negativeHits > positiveHits) {
    sentiment = 'Negative'
  } else if (positiveHits > negativeHits) {
    sentiment = 'Positive'
  }

  const confidence = Math.min(96, 82 + Math.abs(positiveHits - negativeHits) * 4)

  const summaryMap: Record<FeedbackCategory, string> = {
    Hygiene: `${mealSlot} hygiene & sanitation observation flagged for supervisor review.`,
    'Food Quality': `${mealSlot} preparation texture/temperature consistency feedback logged.`,
    Taste: `${mealSlot} seasoning and flavor balance preference recorded.`,
    'Menu Variety': `${mealSlot} menu rotation and dietary variety suggestion captured.`,
    Service: `${mealSlot} counter flow, refill speed, or portion serving note logged.`,
  }

  const replyMap: Record<FeedbackCategory, string> = {
    Hygiene:
      'Flagged for immediate Mess Supervisor check at the serving counter and wash station.',
    'Food Quality':
      'Shared with Head Cook ahead of tomorrow’s batch preparation check.',
    Taste:
      'Logged into Menu Planning Agent preference weights for next week’s recipe tuning.',
    'Menu Variety':
      'Added to the Student Menu Committee review queue for the upcoming weekly rotation.',
    Service:
      'Coordinating with counter staff to open an extra serving tray during peak rush.',
  }

  return {
    category,
    sentiment,
    confidence,
    aiSummary: summaryMap[category],
    suggestedReply: replyMap[category],
  }
}

/**
 * Simulated Food Quality Agent:
 * Produces a visual/text observation clearly separated from verified physical inspection.
 */
export function generateSimulatedQualityObservation(
  category: FoodIssueReport['category'],
  mealSlot: MealSlot,
  description: string,
  hasImage: boolean
): FoodIssueReport['aiObservation'] {
  const imageContext = hasImage
    ? 'Simulated visual inspection of uploaded frame indicates '
    : 'Simulated report text triage indicates '

  const observations: Record<
    FoodIssueReport['category'],
    { concern: string; check: string; visual: string }
  > = {
    Temperature: {
      visual:
        'surface steam absence and possible holding-tray heat drop during mid-service window.',
      concern: 'Holding temperature may have dipped below 60°C in chafing dish.',
      check: 'Verify bain-marie thermostat & stir top serving layer every 20 mins.',
    },
    Undercooked: {
      visual:
        'uneven grain/center density consistent with insufficient simmer or steamer pressure.',
      concern: 'Batch cook duration may require +8 mins or lower batch volume.',
      check: 'Conduct core texture check on current kitchen batch before next refill.',
    },
    Hygiene: {
      visual:
        'potential surface cleanliness or foreign-particle anomaly requiring immediate isolation.',
      concern: 'Sanitation protocol breach risk at prep or counter station.',
      check: 'Pause serving from flagged tray immediately and inspect prep utensils.',
    },
    Freshness: {
      visual:
        'color dulling or moisture separation atypical of fresh morning batch prep.',
      concern: 'Ingredient shelf-life or cold-storage hold time needs audit.',
      check: 'Cross-check ingredient intake log and discard affected tray if confirmed.',
    },
    Portion: {
      visual:
        'ladle serving size appears smaller than standardized 150g hostel mess norm.',
      concern: 'Counter portion inconsistency during peak hostel queue.',
      check: 'Remind counter server to use standard calibrated serving ladle.',
    },
  }

  const item = observations[category]
  const snippet = description.trim().slice(0, 80)

  return {
    summary: `${imageContext}${item.visual}${snippet ? ` (Context: "${snippet}...")` : ''}`,
    flaggedConcern: `${mealSlot}: ${item.concern}`,
    recommendedCheck: item.check,
    disclaimer:
      'Simulated AI visual observation — not a certified food safety verdict. Requires supervisor physical verification.',
  }
}
