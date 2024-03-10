import { createClient } from "@supabase/supabase-js"

const domainQuestions = {
  I: [0, 1],
  II: [2],
  III: [3, 4],
  IV: [5, 6, 7],
  V: [8, 9],
  VI: [10],
  VII: [11, 12],
  VIII: [13],
  IX: [14],
  X: [15, 16],
  XI: [17],
  XII: [18, 19],
  XIII: [20, 21, 22],
}

export default async function assessUserAssessment(userId, assessments) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Get the user's previous assessment from the assessments table
  const { data: previousAssessment, error } = await supabase
    .from('assessments')
    .select('responses')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error fetching previous assessment:', error.message)
    return { triggered: false, scenario: 0 }
  }

  // If there is no previous assessment, skip scenario 1 checking
  if (!previousAssessment || !previousAssessment.length) {
    return checkScenarios(assessments)
  }

  const previousResponses = previousAssessment[0].responses

  // Compare the recently answered assessment with the previous assessment for Scenario 1
  const isScenario1Triggered = compareAssessmentsForScenario1(assessments, previousResponses)

  if (isScenario1Triggered) {
    return { triggered: true, scenario: 1 }
  }

  // Check other scenarios if Scenario 1 is not triggered
  return checkScenarios(assessments)
}

function compareAssessmentsForScenario1(currentResponses, previousResponses) {
  const domainQuestionsToCheck = ['I', 'II', 'III', 'IV', 'V', 'VIII', 'X', 'XIII']

  // Check if the previous assessment had at least one question in each domain with a response of >= 2
  const isDomainImprovement = domainQuestionsToCheck.some((domain) =>
    domainQuestions[domain].some((question) => previousResponses[question] >= 2)
  );

  // If there was no domain with a response >= 2 in the previous assessment, return false
  if (!isDomainImprovement) {
    return false
  }

  // Check if there is any domain in the current assessment that shows a decrease or no improvement (response < 2)
  return domainQuestionsToCheck.some((domain) =>
    domainQuestions[domain].some((question) => currentResponses[question] < 2)
  )
}


function checkScenarios(assessments) {
  // Scenario 3
  const scenario3Domains = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII']
  const scenario3Triggered = scenario3Domains.some((domain) =>
    domainQuestions[domain].some((question) => {
      const value = assessments[question];
      console.log(`Domain: ${domain}, Question: ${question}, Value: ${value}`)
      return value >= 3
    })
  )

  if (scenario3Triggered) {
    return { triggered: true, scenario: 3 }
  }

  // Scenario 2
  const scenario2Domains = ['VI', 'VII', 'IX', 'XI', 'XII']
  const scenario2Triggered = scenario2Domains.some((domain) =>
    domainQuestions[domain].some((question) => {
      const value = assessments[question];
      console.log(`Domain: ${domain}, Question: ${question}, Value: ${value}`)
      return value >= 1
    })
  )

  if (scenario2Triggered) {
    return { triggered: true, scenario: 2 }
  }

  return { triggered: false, scenario: 0 }
}

