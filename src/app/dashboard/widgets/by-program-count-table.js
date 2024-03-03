import React from 'react'
import { Card, CardHeader, CardBody, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@nextui-org/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ProgramCountTable() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClientComponentClient({supabaseUrl: supabaseUrl, supabaseKey: supabaseKey})

  const [counts, setCounts] = React.useState([])

  const getProgramCounts = React.useCallback(
    async () => {
      try {
        const { data: programCounts, error } = await supabase.from("personal_details").select(`programs (initial)`)
      
        if (error) {
          throw error
        }

        const countsMap = programCounts.reduce((acc, curr) => {
          acc[curr.programs.initial] = (acc[curr.programs.initial] || 0) + 1
          return acc
        }, {})

        console.log(countsMap)
        setCounts(countsMap)
      } catch (e) {
        console.error("Failed to fetch program count data: ", e)
      }
    },
    [supabase],
  )
  
  React.useEffect(() => {
    getProgramCounts()
  }, [getProgramCounts])
  

  return (
    <Card isBlurred>
      <CardHeader>
        <p className="font-thin">Participating Students</p>
      </CardHeader>
      <CardBody>
        <Table className="h-64 overflow-auto" removeWrapper>
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Count</TableColumn>
          </TableHeader>
          <TableBody>
            {Object.entries(counts).map(([programId, count], index) => (
              <TableRow key={index}>
                <TableCell>{programId}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  )
}
