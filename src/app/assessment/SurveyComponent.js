"use client"
import React from "react"
import { Model } from "survey-core"
import { Survey } from "survey-react-ui"
import "survey-core/defaultV2.min.css"
import { themeJson } from "./theme"
import { json } from "./json"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { CircularProgress } from "@nextui-org/react"
import assessUserAssessment from "./form/apriori"

export default function SurveyComponent({ session }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)
  
  const user = session?.user
  const survey = new Model(json)

  const [allow, setAllow] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [nextAssessmentDate, setNextAssessmentDate] = React.useState("")

  survey.applyTheme(themeJson)

  const getNextAssessmentDate = async () => {
    try {
      const { data, error } = await supabase
        .from("apriori_results")
        .select("created_at")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) { throw error }

      const createdAtTimestamp = data.created_at
      const createdAtDate = new Date(createdAtTimestamp)
      const twoWeeksLaterDate = new Date(createdAtDate.getTime() + (2 * 7 * 24 * 60 * 60 * 1000))
      const formattedDate = twoWeeksLaterDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      setNextAssessmentDate(formattedDate)
    } catch (error) {
      console.error(error)
    }
  }

  const getCurrentUserData = React.useCallback(
    async () => {
      try {
        const currentUserData = await supabase.from("assessment_reminders").select(`reminder_sent`).eq('id', user?.id)

        if (currentUserData.data.length === 0) {
          setAllow(true)
        } else {
          setAllow(currentUserData.data.map((index) => (index.reminder_sent))[0])
        }
        setIsLoading(false)
      } catch (e) {
        console.error("Error retrieving user data: ", e)
      }
    },
    [],
  )
  
  React.useEffect(() => {
    getCurrentUserData()
    getNextAssessmentDate()
  }, [getCurrentUserData])
  

  const onComplete = React.useCallback(async (sender) => {
    const results = sender.data

    try {
      // Extract number values from results object and store in an array
      const responsesArray = Object.values(results).map(value => parseInt(value, 10))

      const result = await assessUserAssessment(user.id, responsesArray)

      // Insert assessment into assessments table
      const { data: assessmentData, error: assessmentError } = await supabase.from("assessments").insert([
        {
          user_id: user?.id,
          responses: responsesArray,
        },
      ]).select()

      const { error: resultError } = await supabase.from("apriori_results").insert([
        {
          assessment_id: assessmentData[0].id,
          user_id: user?.id,
          apriori_result: result.scenario,
        },
      ])

      if (assessmentError || resultError) {
        throw new Error("Error inserting assessment:", assessmentError.message)
      }

      // Upsert assessment reminder into assessment_reminders table
      const { data: reminderData, error: reminderError } = await supabase.from("assessment_reminders").upsert(
        {
          last_assessment_at: new Date().toISOString(), // Current timestamp
          reminder_sent: false,
        }
      )

      if (reminderError) {
        throw new Error("Error upserting assessment reminder:", reminderError.message)
      }
    } catch (error) {
      console.error("Error:", error.message)
    }
  }, [supabase, user?.id])

  survey.onComplete.add(onComplete)

  return (
    <>
      {isLoading ? <div className="h-96 w-screen flex flex-col justify-center items-center">
        <CircularProgress />
      </div> : allow ? <Survey model={survey} /> : 
      <div className="h-96 w-screen flex flex-col justify-center items-center text-slate-900 text-center px-10">
        <p className="pb-3">You have already answered the form. You can go back to this page two weeks after answering your previous response.</p>
        <p>Your next assessment will be on <b>{nextAssessmentDate}</b>.</p>
      </div>}
    </>
  )
  
}
