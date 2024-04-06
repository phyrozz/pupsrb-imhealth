import React from 'react'
import CustomNavbar from '../components/navbar'
import StudentAssessmentsTable from './student-assessments-table'

export default function StudentAssessmentsPage() {
  return (
		<div className="bg-gradient-to-r from-slate-50 to-slate-300 ">
         <CustomNavbar activeLink="Assessments" />
         <div className="p-3">
            <StudentAssessmentsTable />
         </div>
		</div>
	)
}
