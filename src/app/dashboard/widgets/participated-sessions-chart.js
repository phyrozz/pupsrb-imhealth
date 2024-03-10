import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody } from '@nextui-org/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Chart from 'react-apexcharts'

export default function ParticipatedSessionsChart() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClientComponentClient({ supabaseUrl: supabaseUrl, supabaseKey: supabaseKey })

  const [chartSeries, setChartSeries] = useState([0, 0, 0])

  useEffect(() => {
    async function getSessionCounts() {
      try {
        const { data: assessments, error } = await supabase.from("assessments").select("user_id")

        if (error) {
          throw error
        }

        // Group assessments by user_id
        const userGroups = assessments.reduce((acc, curr) => {
          const { user_id } = curr;
          if (!acc[user_id]) {
            acc[user_id] = [];
          }
          acc[user_id].push(curr);
          return acc;
        }, {});

        // Count the number of assessments for each user
        const sessionCounts = Object.values(userGroups).reduce((counts, assessments) => {
          const count = assessments.length;
          if (count === 1) {
            counts[0]++;
          } else if (count === 2) {
            counts[1]++;
          } else if (count === 3) {
            counts[2]++;
          }
          return counts;
        }, [0, 0, 0]);

        const series = Object.values(sessionCounts)

        setChartSeries([{ data: series }]);
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
            labels: ["Session 1", "Session 2", "Session 3"],
          }}
          series={chartSeries}
          type="bar"
        />
      </CardBody>
    </Card>
  )
}
