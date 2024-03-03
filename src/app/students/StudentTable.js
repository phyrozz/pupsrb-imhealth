"use client"
import React from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue, CircularProgress } from "@nextui-org/react"
import { motion } from "framer-motion"

export default function StudentTable() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)

  const [isLoading, setIsLoading] = React.useState(true)
  const [students, setStudents] = React.useState([])
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 20;

  const pages = Math.ceil(students.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return students.slice(start, end);
  }, [page, students]);

  const getStudents = React.useCallback(
    async () => {
      try {
        const { data, error, status } = await supabase
        .from('personal_details')
        .select(`email, first_name, middle_name, last_name, name_suffix, created_at, birth_date, programs ( initial ), year, marital_statuses ( status ), is_working_student, profiles ( id, is_student )`)
        .eq('profiles.is_student', true)

        if (error && status !== 406) {
          throw error
        }

        setStudents(data)
        console.log(data)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
        
      }
    },
    [supabase],
  )

  React.useEffect(() => {
    getStudents()
  }, [getStudents])
  
  return (
    <>
      {isLoading ? <div className="h-96 w-screen flex flex-col justify-center items-center"><CircularProgress aria-label="Loading..." /></div> : 
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0, 0.71, 0.2, 1.01]
        }}
      >
        <Table
          isStriped
          aria-label="Student table" 
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          className="text-slate-900"
        >
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Birth Date</TableColumn>
            <TableColumn>Program</TableColumn>
            <TableColumn>Year</TableColumn>
            <TableColumn>Marital Status</TableColumn>
            <TableColumn>Working Student?</TableColumn>
          </TableHeader>
          <TableBody items={items} emptyContent={"No rows to display."}>
            {(item) => (
              <TableRow key={item.profiles.id}>
                <TableCell>{`${item.first_name} ${item.middle_name} ${item.last_name} ${item.name_suffix}`}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.birth_date}</TableCell>
                <TableCell>{item.programs.initial}</TableCell>
                <TableCell>{item.year || '-'}</TableCell>
                <TableCell>{item.marital_statuses.status}</TableCell>
                <TableCell>{item.is_working_student ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>
      }
    </>
  )
}