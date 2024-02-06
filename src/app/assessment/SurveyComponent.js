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

      const { data, error } = await supabase.from("assessments").insert([
        {
          user_id: user?.id,
          responses: responsesArray,
        },
      ])

      if (error) {
        console.error("Error inserting assessment:", error.message);
      } else {
        console.log("Assessment inserted successfully:", data);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }, [supabase, user?.id])

  survey.onComplete.add(onComplete);

  return <Survey model={survey} />;
}
