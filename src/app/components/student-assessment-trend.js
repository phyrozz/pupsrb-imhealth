"use client"
import React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { CircularProgress } from '@nextui-org/react'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClientComponentClient({ supabaseUrl, supabaseKey })

export default function StudentAssessmentTrend({ userId }) {
  const [chartData, setChartData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  const getAssessmentHistory = React.useCallback(
    async () => {
      try {
        const { data, error } = await supabase.rpc("get_answered_assessments_trend_by_student", { user_id: userId })

        if (error) {
          throw error
        }

        const formattedData = data.map(row => ({
          name: row.scenario_name,
          data: [[new Date(row.session_date).getTime(), row.scenario_name]]
        }))

        setChartData(formattedData)
        setIsLoading(false)
      } catch (e) {
        console.error(e)
      }
    },
    [userId],
  )
  

  React.useEffect(() => {
    getAssessmentHistory()
  }, [getAssessmentHistory, userId])
  

  return (
    <>
    {isLoading ? 
    <CircularProgress />
    :
    <Chart
      options={{
        chart: {
          type: 'line',
          height: 350,
        },
        xaxis: {
          type: 'datetime',
        },
        stroke: {
          curve: 'smooth',
        },
      }}
      series={chartData} // Pass chartData directly, as it's already formatted correctly
      type="line"
      width={"100%"}
      height={400}
    />
    }
    </>
  )
}
