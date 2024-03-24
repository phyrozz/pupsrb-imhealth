"use client"
import React from 'react'
import jsPDF from 'jspdf'
import { Button } from "@nextui-org/react"
import CustomNavbar from '../components/navbar'

 export default function GenerateReportPage() {
  const generateReport = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF()

    // Add text to the PDF document
    doc.text('Hello World!', 10, 10)

    // Save the PDF document
    doc.save('report.pdf')
  }

  return (
    <>
      <CustomNavbar activeLink="Generate Report" />
      <Button onClick={generateReport}>Generate PDF Report</Button>
    </>
  )
}
