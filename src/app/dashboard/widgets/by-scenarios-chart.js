"use client"
import React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardHeader, CardBody, Progress } from '@nextui-org/react'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClientComponentClient({ supabaseUrl, supabaseKey })

export default function AssessmentResultsDonutChart() {  
  const [chartData, setChartData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function getAssessmentResultCounts() {
      try {
        const { data, error } = await supabase.rpc("count_apriori_results_by_scenario")

        if (error) {
          throw error
        }

        setChartData(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching assessment result counts:", error.message)
      }
    }

    getAssessmentResultCounts()
  }, [supabase])

  const chartLabels = chartData.map(result => result.scenario_name)
  const chartSeries = chartData.map(result => result.result_count)

  return (
    <Card isBlurred>
      {isLoading ?
      <Progress isIndeterminate size="sm" aria-label="Loading Chart..." />
      :
      <>
        <CardHeader>
          <p className="font-bold">Assessment Results</p>
        </CardHeader>
        <CardBody>
          <Chart 
            options={{
              chart: {
                type: 'donut',
              },
              labels: chartLabels,
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
            series={chartSeries}
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
