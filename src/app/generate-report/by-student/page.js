import React from 'react'
import CustomNavbar from '@/app/components/navbar'
import ByStudentForm from './generate-form'

 export default function GenerateReportByProgramPage() {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-300 h-screen">
      <CustomNavbar activeLink="Generate Report" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-1/2 w-full md:px-0 px-5">
        <ByStudentForm />
      </div>
    </div>
  )
}
