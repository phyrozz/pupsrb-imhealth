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
    },
    series: [{
      name: 'Answered Assessments',
      data: [],
    }],
  })

  useEffect(() => {
    async function fetchChartData() {
      try {
        const { data, error } = await supabase.rpc("get_answered_assessments_trend")

        if (error) {
          throw error
        }

        const dates = data.map(row => new Date(row.session_date).getTime())
        const counts = data.map(row => row.count)

        setChartData(prevState => ({
          ...prevState,
          series: [{
            ...prevState.series[0],
            data: counts,
          }],
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: dates,
            },
          },
        }))
      } catch (error) {
        console.error('Error fetching chart data:', error.message)
      }
    }

    fetchChartData()
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
