"use client"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default async function generatePDF(queryData) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)
  
  const getScenarioDescriptions = async () => {
    try {
      const { data, error } = await supabase.from("assessment_scenarios").select(`name, description`).order("id")

      if (error) { throw error }

      return data
    } catch (error) {
      return []
    }
  }

  const doc = new jsPDF()

  var tableData = []

  function formatDateTime(datetimeString) {
    const date = new Date(datetimeString)
    const options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }
    const dateString = date.toLocaleDateString('en-US', options).replace(',', '')
    return dateString
  }

  queryData.forEach(item => {
    const firstName = item.profiles.personal_details[0].first_name
    const middleName = item.profiles.personal_details[0].middle_name
    const lastName = item.profiles.personal_details[0].last_name
    const nameSuffix = item.profiles.personal_details[0].name_suffix
    const name = `${firstName} ${middleName} ${lastName} ${nameSuffix}`
    const studentNumber = item.profiles.personal_details[0].student_number
    const createdAt = formatDateTime(item.created_at)
    const result = item.assessment_scenarios.name

    tableData.push([name, studentNumber, createdAt, result])
  })

  autoTable(doc, {
    columnStyles: { 0: { halign: "center", fillColor: [255, 255, 255], fontSize: 16, fontStyle: 'bold' } },
    body: [["Assessment Report"]],
  })
  autoTable(doc, {
    margin: { top: 0, bottom: 0 },
    head: [["Name", "Student Number", "Answered at", "Assessment Result"]],
    body: tableData,
  })

  var scenarioTableData = []
  const scenarios = await getScenarioDescriptions()
  scenarios.forEach(scenario => {
    const name = scenario.name
    const description = scenario.description

    scenarioTableData.push([name, description])
  })

  autoTable(doc, {
    columnStyles: { 0: { fillColor: [255, 255, 255], fontSize: 12, fontStyle: 'bold' } },
    body: [["Scenarios"]],
  })
  autoTable(doc, {
    margin: { top: 0, bottom: 0 },
    head: [["Name", "Description"]],
    body: scenarioTableData,
  })

  doc.save('report.pdf')
}
