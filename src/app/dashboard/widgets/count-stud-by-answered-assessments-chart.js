"use client"
import React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardHeader, CardBody, Skeleton } from '@nextui-org/react'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClientComponentClient({ supabaseUrl, supabaseKey })

export default function CountStudentByAnsweredAssessmentsPieChart() {  
  const [chartData, setChartData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function getAssessmentResultCounts() {
      try {
        const { data, error } = await supabase.rpc("count_students")

        if (error) {
          throw error
        }

        setChartData(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching student counts:", error.message)
      }
    }

    getAssessmentResultCounts()
  }, [])

  return (
    <Card isBlurred>
      {isLoading ?
      <div className="space-y-5 p-4">
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-8 w-3/5 rounded-lg bg-default-200"></div>
          </Skeleton>
        </div>
        <Skeleton className="rounded-lg p-2">
          <div className="h-80 rounded-lg bg-default-300"></div>
        </Skeleton>
      </div>
      :
      <>
        <CardHeader>
          <p className="font-bold">Students With/Without assessments</p>
        </CardHeader>
        <CardBody>
          <Chart 
            options={{
              chart: {
                type: 'donut',
              },
              labels: ["With assessments", "Without assessments"],
              legend: {
                position: 'bottom',
              },
              noData: {
                text: "No available data."
              },
              plotOptions: {
                pie: {
                  expandOnClick: true,
                  donut: {
                    size: '50%',
                    labels: {
                      show: true,
                      total: {
                        label: "Students",
                        show: true,
                        showAlways: true,
                      }
                    }
                  }
                }
              },
              fill: {
                type: 'gradient',
              }
            }}
            series={[chartData[0].answered_assessments_total, chartData[0].total - chartData[0].answered_assessments_total]}
            type="donut"
            width={"100%"}
            height={400}
          />
        </CardBody>
      </>
      }
    </Card>
  )
}
