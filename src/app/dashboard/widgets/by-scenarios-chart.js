import React from 'react'
import { Card, CardHeader, CardBody } from '@nextui-org/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Chart from 'react-apexcharts'

export default function ByScenariosChart() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClientComponentClient({ supabaseUrl, supabaseKey })

  const [chartData, setChartData] = React.useState([])

  React.useEffect(() => {
    async function getAssessmentResultCounts() {
      try {
        const { data: results, error } = await supabase.rpc("count_apriori_results_by_scenario")

        if (error) {
          throw error
        }

        setChartData(results)
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
      <CardHeader>
        <p className="font-bold">Assessment Results</p>
      </CardHeader>
      <CardBody>
        <Chart 
          options={{
            chart: {
              type: 'pie',
            },
            labels: chartLabels,
            legend: {
              position: 'bottom',
            },
          }}
          series={chartSeries}
          type="pie"
        />
      </CardBody>
    </Card>
  )
}
