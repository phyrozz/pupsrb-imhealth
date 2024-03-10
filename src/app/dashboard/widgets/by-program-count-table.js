import React from 'react'
import { Card, CardHeader, CardBody, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@nextui-org/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Chart from 'react-apexcharts'

export default function ProgramCountTable() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClientComponentClient({supabaseUrl: supabaseUrl, supabaseKey: supabaseKey})

  // const [counts, setCounts] = React.useState([])
  const [chartLabels, setChartLabels] = React.useState([])
  const [chartSeries, setChartSeries] = React.useState([])

  React.useEffect(() => {
    async function getProgramCounts() {
      try {
        const { data: personalDetails, error } = await supabase.from("personal_details").select("first_name, middle_name, last_name, name_suffix, programs (initial)")

        if (error) {
          throw error
        }

        // Filter out duplicate user accounts based on the same name
        const uniquePersonalDetails = personalDetails.reduce((acc, curr) => {
          const { first_name, middle_name, last_name, name_suffix } = curr
          const key = `${first_name}_${middle_name}_${last_name}_${name_suffix}`
          if (!acc[key]) {
            acc[key] = curr
          }
          return acc
        }, {})

        // Calculate counts for each program
        const countsMap = Object.values(uniquePersonalDetails).reduce((acc, curr) => {
          const programId = curr.programs?.initial
          if (programId) {
            acc[programId] = (acc[programId] || 0) + 1
          }
          return acc
        }, {});

        // Extract labels and series data
        const labels = Object.keys(countsMap)
        const series = Object.values(countsMap)

        setChartLabels(labels)
        setChartSeries([{ data: series }])
      } catch (e) {
        console.error("Failed to fetch program count data: ", e)
      }
    }

    getProgramCounts()
  }, [supabase])
  

  return (
    <Card isBlurred>
      <CardHeader>
        <p className="font-thin">Participating Students</p>
      </CardHeader>
      <CardBody>
        <Chart 
          options={{
            chart: {
              type: 'bar',
            },
            labels: chartLabels,
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
              }
            }]
          }}
          series={chartSeries}
          type="bar"
        />
        {/* <Table className="max-h-96" removeWrapper>
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn align="end">Number of Students</TableColumn>
          </TableHeader>
          <TableBody className="overflow-auto">
            {Object.entries(counts).map(([programId, count], index) => (
              <TableRow key={index}>
                <TableCell>{programId}</TableCell>
                <TableCell align="end">{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> */}
      </CardBody>
    </Card>
  )
}
