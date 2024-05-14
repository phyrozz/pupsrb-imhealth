"use client"
import React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardHeader, CardBody, Skeleton } from '@nextui-org/react'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClientComponentClient({ supabaseUrl, supabaseKey })

export default function AssessmentTrendCountChart() {
  const [chartData, setChartData] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('mental_health_downtrend')
          .select("count, created_at")

        if (error) {
          throw error
        }

        setChartData(data.map(count => [new Date(count.created_at).getTime(), count.count]))
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching chart data:', error.message)
      }
    }

    fetchData()
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
          <p className="font-bold">Downward Assessment Growth</p>
        </CardHeader>
        <CardBody>
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
            series={[{ data: chartData }]}
            type="line"
            width={"100%"}
            height={400}
          />
        </CardBody>
      </>
      }
    </Card>
  )
}
