import React, { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardHeader, CardBody } from '@nextui-org/react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClientComponentClient({ supabaseUrl, supabaseKey })

export default function AnsweredAssessmentsTrendChart() {
  const [chartData, setChartData] = useState({
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

  useEffect(() => {
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
            const { data: trendData } = await supabase.rpc("get_answered_assessments_trend", { scenario_name: scenario.name })
            const dates = trendData.map(row => new Date(row.session_date).getTime())
            const counts = trendData.map(row => row.count)

            return {
              name: scenario.name,
              data: counts.map((count, index) => [dates[index], count]), // Format data as [x, y]
            }
          })
        )

        setChartData(prevState => ({
          ...prevState,
          series: seriesData,
        }))
      } catch (error) {
        console.error('Error fetching chart data:', error.message)
      }
    }

    fetchScenarioNames()
  }, [])

  return (
    <Card>
      <CardHeader>
        <p className="font-bold">Answered Assessments Trend</p>
      </CardHeader>
      <CardBody>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={400}
        />
      </CardBody>
    </Card>
  )
}
