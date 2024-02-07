"use client"
import React, { useCallback } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { themeJson } from "./theme";
import { json } from "./json";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SurveyComponent({ session }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)
  
  const user = session?.user
  const survey = new Model(json);

  survey.applyTheme(themeJson);

  const onComplete = useCallback(async (sender) => {
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
        throw new Error("Error inserting assessment:", assessmentError.message);
      } else {
        console.log("Assessment inserted successfully:", assessmentData);
      }

      // Upsert assessment reminder into assessment_reminders table
      const { data: reminderData, error: reminderError } = await supabase.from("assessment_reminders").upsert(
        {
          user_id: user?.id,
          last_assessment_at: new Date().toISOString(), // Current timestamp
          reminder_sent: false,
        },
      )

      if (reminderError) {
        throw new Error("Error upserting assessment reminder:", reminderError.message);
      } else {
        console.log("Assessment reminder upserted successfully:", reminderData);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }, [supabase, user?.id])

  survey.onComplete.add(onComplete);

  return <Survey model={survey} />;
}
