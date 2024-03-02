"use client"
import React from "react"
import { Model } from "survey-core"
import { Survey } from "survey-react-ui"
import "survey-core/defaultV2.min.css"
import { themeJson } from "./theme"
import { json } from "./json"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { CircularProgress } from "@nextui-org/react"

export default function SurveyComponent({ session }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)
  
  const user = session?.user
  const survey = new Model(json)

  const [allow, setAllow] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  survey.applyTheme(themeJson)

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
  }, [getCurrentUserData])
  

  const onComplete = React.useCallback(async (sender) => {
    const results = sender.data

    try {
      // Extract number values from results object and store in an array
      const responsesArray = Object.values(results).map(value => parseInt(value, 10))

      // Insert assessment into assessments table
      const { data: assessmentData, error: assessmentError } = await supabase.from("assessments").insert([
        {
          user_id: user?.id,
          responses: responsesArray,
        },
      ])

      if (assessmentError) {
        throw new Error("Error inserting assessment:", assessmentError.message)
      } else {
        console.log("Assessment inserted successfully:", assessmentData)
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
      } else {
        console.log("Assessment reminder upserted successfully:", reminderData)
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
      <div className="h-96 w-screen flex flex-col justify-center items-center text-slate-900">
        You have already answered the form. You can go back to this page two weeks after answering your previous response.
      </div>}
      
    </>
  )
  
}
