import React from "react"
import { Model } from "survey-core"
import { Survey } from "survey-react-ui"
import "survey-core/defaultV2.min.css"
import { themeJson } from "./theme"
import { json } from "./json"

function SurveyComponent() {
    // Add back end to insert survey result onto the database
    const survey = new Model(json)
    const alertResults = React.useCallback(
      (sender) => {
        const results = JSON.stringify(sender.data)
        alert(results)
      },
      [],
    )

    survey.applyTheme(themeJson)
    survey.onComplete.add((sender, options) => {
        console.log(JSON.stringify(sender.data, null, 3))
    })
    return (<Survey model={survey} />)
}

export default SurveyComponent