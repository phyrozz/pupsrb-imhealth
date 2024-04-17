"use client"
import React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardHeader, CardBody, Progress } from '@nextui-org/react'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClientComponentClient({ supabaseUrl, supabaseKey })

export default function AnsweredAssessmentsTrendChart() {
  const [chartData, setChartData] = React.useState({
    options: {
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
    },
    series: [],
  })
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchScenarioNames() {
      try {
        const { data: scenarioNames, error } = await supabase
          .from('assessment_scenarios')
          .select('name')

        if (error) {
          throw error
        }

        const seriesData = await Promise.all(
          scenarioNames.map(async scenario => {
            // Check if the scenario name is not "None"
            if (scenario.name !== "None") {
              const { data: trendData } = await supabase.rpc("get_answered_assessments_trend", { scenario_name: scenario.name })
              const dates = trendData.map(row => new Date(row.session_date).getTime())
              const counts = trendData.map(row => row.count)
    
              return {
                name: scenario.name,
                data: counts.map((count, index) => [dates[index], count]), // Format data as [x, y]
              }
            } else {
              return null; // Return null for scenarios with "None" name
            }
          })
        )

        // Filter out the null entries
        const filteredSeriesData = seriesData.filter(data => data !== null);

        setChartData(prevState => ({
          ...prevState,
          series: filteredSeriesData,
        }))

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching chart data:', error.message)
      }
    }

    fetchScenarioNames()
  }, [])

  return (
    <Card>
      {isLoading ? 
      <Progress isIndeterminate size="sm" aria-label="Loading Chart..." /> 
      :
      <>
        <CardHeader>
          <p className="font-bold">Answered Assessments Trend</p>
        </CardHeader>
        <CardBody>
          <Chart
            options={chartData.options}
            series={chartData.series}
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
