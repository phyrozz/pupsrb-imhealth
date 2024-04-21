"use client"
import React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Progress } from '@nextui-org/react'
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
          x: new Date(row.session_date).getTime(),
          y: row.scenario_id
        }))

        setChartData(formattedData)
        setIsLoading(false)
      } catch (error) {
        console.error(error)
      }
    },
    [userId],
  )

  const generateColors = (data) => {
    return data.map((d, idx) => {
      let color
      switch (d.y) {
        case 0:
          color = "#6b7280"
          break
        case 1:
          color = "#3b82f6"
          break
        case 2:
          color = "#fcd34d"
          break
        case 3:
          color = "#fb7185"
          break
        default:
          color = "#6b7280"
          break
      }

      return {
        offset: idx / data.length * 150,
        color,
        opacity: 1
      }
    })
  }

  React.useEffect(() => {
    getAssessmentHistory()
  }, [getAssessmentHistory, userId])

  return (
    <>
      {isLoading ?
        <div className="w-full">
          <Progress isIndeterminate size="sm" />
        </div>
       : 
        chartData.length > 1 ? <Chart
          options={{
            chart: {
              type: 'line',
              height: 350,
            },
            xaxis: {
              type: 'datetime',
            },
            yaxis: {
              min: 0,
              max: 3,
              stepSize: 1,
              labels: {
                formatter: function (value) {
                  if (parseInt(value) === 0) {
                    return 'None'
                  } else {
                    return 'Scenario ' + parseInt(value) 
                  }
                },
              },
            },
            fill: {
              type: 'gradient',
              gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                colorStops: generateColors(chartData),
              }
            },
            stroke: {
              curve: 'smooth',
            },
          }}
          series={[{ data: chartData }]}
          type="line"
          width={"100%"}
          height={400}
        /> 
        : 
        <div className="w-full h-48 flex justify-center items-center">
          <p className="text-center">Student must have more than one assessments to display the trends chart.</p>
        </div>
      }
    </>
  )
}
