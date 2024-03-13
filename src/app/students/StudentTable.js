"use client"
import React from 'react'
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Pagination, 
  CircularProgress, 
  Input
} from '@nextui-org/react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { motion } from "framer-motion"
import StudentHistorySidebar from "./student-history-sidebar"
import { SearchIcon } from '../components/search-icon'

export default function StudentTable() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)

  const [isLoading, setIsLoading] = React.useState(true)
  const [students, setStudents] = React.useState([])
  const [page, setPage] = React.useState(1)
  const [studentCount, setStudentCount] = React.useState(0)
  const [selectedUser, setSelectedUser] = React.useState(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const rowsPerPage = 20

  const pages = Math.ceil(studentCount / rowsPerPage)

  React.useEffect(() => {
    getStudents()
  }, [page, searchQuery])

  const getStudents = async () => {
    try {
      const start = (page - 1) * rowsPerPage
      const end = start + rowsPerPage

      let query = supabase.from("personal_details")
        .select(
          `email, first_name, middle_name, last_name, name_suffix, created_at, birth_date, programs ( initial, name ), year, marital_statuses ( status ), is_working_student, profiles ( id, is_student )`,
          { count: 'exact' }
        )
        .eq("profiles.is_student", true)
        .range(start, end)

      if (searchQuery) {
        query = query.or(
          `first_name.ilike.%${searchQuery}%, last_name.ilike.%${searchQuery}%, email.ilike.%${searchQuery}%`
        )
      }        

      const { data, count, error, status } = await query

      if (error && status !== 406) {
        throw error
      }

      setStudentCount(count)
      setStudents(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRowClick = (user) => {
    setSelectedUser(user)
    setIsOpen(true)
  }

  const handleCloseSidebar = () => {
    setIsOpen(false)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  return (
    <>
      {isLoading ? (
        <div className="h-screen w-screen flex flex-col justify-center items-center">
          <CircularProgress aria-label="Loading..." />
        </div>
      ) : (
        <>
          <div className="w-full pb-3 flex flex-row justify-end">
            <Input
              isClearable
              variant="bordered"
              radius="md"
              className="w-96"
              classNames={{
                inputWrapper: [
                  "border-slate-50"
                ]
              }}
              placeholder="Search for student..."
              value={searchQuery}
              onChange={handleSearch}
              startContent={
                <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
              }
            />
          </div>
          <div className={isOpen ? "grid grid-cols-12 gap-3" : ""}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                ease: [0, 0.71, 0.2, 1.01],
              }}
              className="md:col-span-8 col-span-12 min-h-[90.3vh]"
            >
              <Table
                isStriped
                aria-label="Student table"
                selectionMode="single"
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
                <TableBody emptyContent={"No rows to display."}>
                  {students.map((item) => (
                    <TableRow
                      key={item.profiles.id}
                      onClick={() => handleRowClick(item)}
                    >
                      <TableCell>{`${item.first_name} ${item.middle_name} ${item.last_name} ${item.name_suffix}`}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{new Date(item.birth_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                      <TableCell>{item.programs.initial}</TableCell>
                      <TableCell>{item.year || "-"}</TableCell>
                      <TableCell>{item.marital_statuses.status}</TableCell>
                      <TableCell>
                        {item.is_working_student ? "Yes" : "No"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
                className="md:col-span-4 col-span-12 md:static fixed md:w-full w-[94.5vw]"
              >
                <StudentHistorySidebar
                  user={selectedUser}
                  onClose={handleCloseSidebar}
                />
              </motion.div>
            )}
          </div>
        </>
      )}
    </>
  )
}
