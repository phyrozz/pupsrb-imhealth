"use client"
import React from 'react'
import { Card, CardHeader, CardBody } from '@nextui-org/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function ParticipatedSessionsChart() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClientComponentClient({ supabaseUrl: supabaseUrl, supabaseKey: supabaseKey })

  const [chartSeries, setChartSeries] = React.useState([0, 0, 0])

  React.useEffect(() => {
    async function getSessionCounts() {
      try {
        var sessions = []
        for (let c = 0; c <= 3; c++) {
          let count = 0
          let { data } = await supabase.rpc("count_users_with_specific_assessment_count", { assessment_count: c })
          count = data[0].user_count
          sessions.push(count)
        }
        
        setChartSeries([{ data: sessions }]);
      } catch (error) {
        console.error("Failed to fetch session counts:", error.message)
      }
    }

    getSessionCounts();
  }, [supabase])

  return (
    <Card isBlurred>
      <CardHeader>
        <p className="font-bold">Answered Assessments by Sessions</p>
      </CardHeader>
      <CardBody>
        <Chart
          options={{
            chart: {
              type: 'bar',
            },
            labels: ["None", "Session 1", "Session 2", "Session 3"],
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
    </Card>
  )
}
