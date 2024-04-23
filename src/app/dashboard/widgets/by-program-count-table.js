"use client"
import React from 'react'
import { Card, CardHeader, CardBody, Skeleton } from '@nextui-org/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function ProgramCountTable() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClientComponentClient({supabaseUrl: supabaseUrl, supabaseKey: supabaseKey})

  const [chartData, setChartData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function getProgramCounts() {
      try {
        const { data: programCounts, error } = await supabase.rpc("count_students_by_program")

        if (error) {
          throw error
        }

        setChartData(programCounts)
        setIsLoading(false)
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
      {isLoading ?
      <div className="space-y-5 p-4">
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-8 w-3/5 rounded-lg bg-default-200"></div>
          </Skeleton>
        </div>
        <Skeleton className="rounded-lg p-2">
          <div className="h-80 rounded-lg bg-default-300"></div>
        </Skeleton>
      </div>
      :
      <>
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
              plotOptions: {
                bar: {
                  borderRadius: 5,
                  horizontal: true,
                }
              },
            }}
            series={[{ data: chartSeries }]}
            type="bar"
            width={"100%"}
            height={400}
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
      </>
      }
    </Card>
  )
}
