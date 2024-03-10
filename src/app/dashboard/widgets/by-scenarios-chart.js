import React from 'react'
import { Card, CardHeader, CardBody } from '@nextui-org/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Chart from 'react-apexcharts'

export default function ByScenariosChart() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClientComponentClient({supabaseUrl: supabaseUrl, supabaseKey: supabaseKey})

  const [chartSeries, setChartSeries] = React.useState([0, 0, 0, 0])
  
  React.useEffect(() => {
    async function getAssessmentResultCounts() {
      try {
        const { data: results, error } = await supabase.from("apriori_results").select("apriori_result")

        if (error) {
          throw error
        }

        // Initialize counts for each scenario
        let noneCount = 0;
        let scenario1Count = 0;
        let scenario2Count = 0;
        let scenario3Count = 0;

        // Count occurrences of each scenario
        results.forEach(result => {
          switch (result.apriori_result) {
            case 0:
              noneCount++;
              break;
            case 1:
              scenario1Count++;
              break;
            case 2:
              scenario2Count++;
              break;
            case 3:
              scenario3Count++;
              break;
            default:
              break;
          }
        });

        // Update chart series
        setChartSeries([noneCount, scenario1Count, scenario2Count, scenario3Count]);
      } catch (error) {
        console.error("Error fetching assessment result counts:", error.message)
      }
    }

    getAssessmentResultCounts();
  }, [supabase])
  

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
            labels: ["None", "Scenario 1", "Scenario 2", "Scenario 3"],
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
