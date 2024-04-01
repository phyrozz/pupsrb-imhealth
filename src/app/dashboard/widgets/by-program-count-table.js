import React from 'react'
import { Card, CardHeader, CardBody } from '@nextui-org/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Chart from 'react-apexcharts'

export default function ProgramCountTable() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClientComponentClient({supabaseUrl: supabaseUrl, supabaseKey: supabaseKey})

  const [chartData, setChartData] = React.useState([])

  React.useEffect(() => {
    async function getProgramCounts() {
      try {
        const { data: programCounts, error } = await supabase.rpc("count_students_by_program")

        if (error) {
          throw error
        }

        setChartData(programCounts)
      } catch (e) {
        console.error("Failed to fetch program count data: ", e)
      }
    }

    getProgramCounts()
  }, [supabase])
  
  const chartLabels = chartData.map(program => program.program_initial)
  const chartSeries = chartData.map(program => program.result_count)

  return (
    <Card isBlurred>
      <CardHeader>
        <p className="font-bold">Participating Students</p>
      </CardHeader>
      <CardBody>
        <Chart 
          options={{
            chart: {
              type: 'bar',
            },
            labels: chartLabels,
          }}
          series={[{ data: chartSeries }]}
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
