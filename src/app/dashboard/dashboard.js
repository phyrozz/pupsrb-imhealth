"use client"

import { useState, useCallback, useEffect } from "react";
import AssessmentAnsweredChart from "./widgets/by-scenarios-chart";
import ProgramCountTable from "./widgets/by-program-count-table";
import ParticipatedSessionsChart from "./widgets/participated-sessions-chart";
import AnsweredAssessmentsTrendChart from "./widgets/answered-assessments-trend";
import WorkingStudentDonutChart from "./widgets/working-student-chart";
import CountStudentByAnsweredAssessmentsPieChart from "./widgets/count-stud-by-answered-assessments-chart";
import AssessmentTrendCountChart from "./widgets/assessment-trend-count";

export default function Dashboard({ session }) {
	const user = session?.user

	const [email, setEmail] = useState(null);

	const getUserEmail = useCallback(async () => {
    try {
      const userEmail = await user.email
			setEmail(userEmail)
    } catch (error) {
      alert('Error loading user data!')
    } finally {
    }
  }, [user.email])

  useEffect(() => {
    getUserEmail()
  }, [getUserEmail])

	return (
    <>
      <div className="text-center md:text-left text-slate-700 px-5">
        <h1 className="text-6xl font-thin pt-10">
          Welcome!
        </h1>
        <p className="text-2xl font-bold pb-10">{email}</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pb-5">
          <AssessmentAnsweredChart />
          <CountStudentByAnsweredAssessmentsPieChart />
          <WorkingStudentDonutChart /> 
          <ProgramCountTable />
          <ParticipatedSessionsChart />
          <AssessmentTrendCountChart />
          <AnsweredAssessmentsTrendChart />
        </div>
      </div>
    </>
	)
}