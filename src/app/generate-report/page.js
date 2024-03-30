"use client"
import React from 'react'
import jsPDF from 'jspdf'
import { Button, Link, Card, CardBody, CardHeader, CardFooter } from "@nextui-org/react"
import CustomNavbar from '../components/navbar'
import IconArrowRightShort from '../components/arrow-right-short'
import { motion } from 'framer-motion'

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
    <div className="bg-gradient-to-r from-slate-100 to-slate-300 h-screen">
      <CustomNavbar activeLink="Generate Report" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-1/2 w-full md:px-0 px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0, 0.71, 0.2, 1.01]
          }}
          className="flex flex-wrap gap-5"
        >
          <Card className="w-full h-56">
            <CardHeader>
              <h1 className="font-bold">Generate by Program</h1>
            </CardHeader>
            <CardBody>
              <p className="text-sm">Generate a report by program such as BSIT or BSECE and export it as .pdf or .csv</p>
            </CardBody>
            <CardFooter>
              <div className="flex justify-end w-full">
                <Button
                  as={Link}
                  color="primary"
                  href="/generate-report/by-program"
                >
                  <IconArrowRightShort />
                </Button>
              </div>
            </CardFooter>
          </Card>
          <Card className="w-full h-56">
            <CardHeader>
              <h1 className="font-bold">Generate by Student</h1>
            </CardHeader>
            <CardBody>
              <p className="text-sm">Generate a report by individual student and export it as .pdf or .csv</p>
            </CardBody>
            <CardFooter>
              <div className="flex justify-end w-full">
                <Button
                  as={Link}
                  color="primary"
                  href="/generate-report/by-student"
                >
                  <IconArrowRightShort />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
