"use client"
import React from 'react'
import { Card, CardHeader, CardBody, Skeleton } from '@nextui-org/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function ParticipatedSessionsChart() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClientComponentClient({ supabaseUrl: supabaseUrl, supabaseKey: supabaseKey })

  const [chartSeries, setChartSeries] = React.useState([0, 0, 0])
  const [isLoading, setIsLoading] = React.useState(true)
  const sessionUpperBound = 6

  React.useEffect(() => {
    async function getSessionCounts() {
      try {
        var sessions = []
        for (let c = 1; c <= sessionUpperBound; c++) {
          let count = 1
          let { data } = await supabase.rpc("count_users_with_specific_assessment_count", { assessment_count: c })
          count = data[0].user_count
          sessions.push(count)
        }
        
        setChartSeries([{ data: sessions }])
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch session counts:", error.message)
      }
    }

    getSessionCounts()
  }, [supabase])

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
          <p className="font-bold">Answered Assessments by Sessions</p>
        </CardHeader>
        <CardBody>
          <Chart
            options={{
              chart: {
                type: 'bar',
              },
              labels: Array.from({ length: sessionUpperBound }, (_, i) => `Session ${i + 1}`),
              plotOptions: {
                bar: {
                  borderRadius: 5,
                }
              },
            }}
            series={chartSeries}
            type="bar"
            width={"100%"}
            height={400}
          />
        </CardBody>
      </>
      }
    </Card>
  )
}
