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
  Input,
  Dropdown, DropdownItem, DropdownMenu, DropdownTrigger,
  Button,
  Autocomplete, AutocompleteItem
} from '@nextui-org/react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { motion } from "framer-motion"
import StudentHistorySidebar from "../components/student-history-sidebar"
import { SearchIcon } from '../icons/search-icon'
import UploadCSVButton from './import-by-csv'
import IconThreeDotsVertical from '../icons/three-dots-vertical-icon'
import IconFileImport from '../icons/file-import'
import IconFiltering from '../icons/filter-icon'

export default function StudentTable() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)

  const [isLoading, setIsLoading] = React.useState(false)
  const [showTable, setShowTable] = React.useState(false)
  const [students, setStudents] = React.useState([])
  const [page, setPage] = React.useState(1)
  const [studentCount, setStudentCount] = React.useState(0)
  const [selectedUser, setSelectedUser] = React.useState(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterBySession, setFilterBySession] = React.useState(0)
  const [filterByProgram, setFilterByProgram] = React.useState("")
  const [programs, setPrograms] = React.useState([])
  const [rowsPerPage, setRowsPerPage] = React.useState(20)

  const pages = Math.ceil(studentCount / rowsPerPage)

  const getStudents = async () => {
    if (searchQuery.trim() === "") return
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .rpc('get_users_with_multiple_assessments', { 
          result_count: filterBySession, 
          selected_program_initial: filterByProgram,
          search_query: searchQuery,
          page_size: rowsPerPage,
          page_number: page
      })

      if (error) {
        throw error
      }

      setStudentCount(data[0].total_count)
      setStudents(data)
      setShowTable(true)
    } catch (e) {
      setStudents([])
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const getPrograms = React.useCallback(
    async () => {
      try {
        const { data, error } = await supabase
          .from("programs")
          .select(`initial`)
        
        if (error) { throw error }
  
        setPrograms(data)
      } catch (error) {
        console.error(error)
      }
    },
    [supabase],
  )

  const handleRowClick = (user) => {
    setSelectedUser(user)
    setIsOpen(true)
  }

  const handleCloseSidebar = () => {
    setIsOpen(false)
  }

  const handleSearch = (e) => {
    const { value } = e.target
    setSearchQuery(value)
    if (value.trim() !== "") {
      setPage(1)
    }
  }

  const rowsPerPageAutocompleteChange = (key) => {
    setRowsPerPage(key)
  }
  
  const handleBySessionAutocompleteChange = (key) => {
    setFilterBySession(key)
  }

  const handleByProgramAutocompleteChange = (key) => {
    setFilterByProgram(key)
  }

  React.useEffect(() => {
    getPrograms()
  }, [getPrograms])

  return (
    <>
      <div className="w-full pb-3 flex flex-row justify-between items-center gap-3">
        <div className="flex flex-wrap md:flex-nowrap justify-start items-center gap-2">
          <p>Show</p>
          <Autocomplete
            size="sm"
            className="max-w-20"
            isClearable={false}
            defaultSelectedKey={"20"}
            onSelectionChange={rowsPerPageAutocompleteChange}
          >
            <AutocompleteItem key="10">10</AutocompleteItem>
            <AutocompleteItem key="20">20</AutocompleteItem>
            <AutocompleteItem key="50">50</AutocompleteItem>
            <AutocompleteItem key="75">75</AutocompleteItem>
            <AutocompleteItem key="100">100</AutocompleteItem>
          </Autocomplete>
          <p>records</p>
        </div>
        <div className="flex flex-wrap md:flex-nowrap justify-end items-center gap-3">
          <IconFiltering />
          <Autocomplete
            label="by No. of Session"
            size="sm"
            className="max-w-40"
            isClearable={false}
            defaultSelectedKey={"0"}
            onSelectionChange={handleBySessionAutocompleteChange}
          >
            <AutocompleteItem key="0">All</AutocompleteItem>
            <AutocompleteItem key="1">1</AutocompleteItem>
            <AutocompleteItem key="2">2</AutocompleteItem>
            <AutocompleteItem key="3">3</AutocompleteItem>
            <AutocompleteItem key="4">4</AutocompleteItem>
            <AutocompleteItem key="5">5</AutocompleteItem>
            <AutocompleteItem key="6">6</AutocompleteItem>
          </Autocomplete>

          <Autocomplete
            label="by Program"
            items={programs}
            size="sm"
            className="max-w-40"
            isClearable={false}
            defaultSelectedKey={""}
            onSelectionChange={handleByProgramAutocompleteChange}
          >
            <AutocompleteItem key="">All</AutocompleteItem>
            {programs.map((program) => 
              <AutocompleteItem key={program.initial}>
                {program.initial}
              </AutocompleteItem>)}
          </Autocomplete>
          
          <form name="" method="post" className="flex flex-row gap-2">
            <Input
              isClearable
              variant="faded"
              radius="md"
              size="lg"
              className="w-96"
              placeholder="Search for student..."
              value={searchQuery}
              onChange={handleSearch}
              startContent={
                <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
              }
              onClear={() => setSearchQuery("")}
            />

            <Button
              color="primary"
              size="lg"
              onClick={getStudents}
              isLoading={isLoading}
              type="submit"
            >
              Search
            </Button>
          </form>
          
          <Dropdown closeOnSelect={false}>
            <DropdownTrigger>
              <Button variant="light" isIconOnly>
                <IconThreeDotsVertical />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Table Options Dropdown">
              <DropdownItem key="import" endContent={<IconFileImport />}><UploadCSVButton /></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className={isOpen ? "grid grid-cols-12 gap-3" : ""}>
        {showTable ? 
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
                  color="primary"
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
              <TableColumn>Student Number</TableColumn>
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
                  key={item.user_id}
                  onClick={() => handleRowClick(item)}
                >
                  <TableCell>{`${item.first_name} ${item.middle_name} ${item.last_name} ${item.name_suffix}`}</TableCell>
                  <TableCell>{item.student_number}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{new Date(item.birth_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                  <TableCell>{item.program_initial}</TableCell>
                  <TableCell>{item.year || "-"}</TableCell>
                  <TableCell>{item.marital_status}</TableCell>
                  <TableCell>
                    {item.is_working_student ? "Yes" : "No"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
        :
        <div className="w-full h-[85vh] flex justify-center items-center">Start searching for a student...</div>
        }
        
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className="md:col-span-4 col-span-12 md:static fixed md:h-full h-[80vh] md:w-full w-[94.5vw]"
          >
            <StudentHistorySidebar
              user={selectedUser}
              onClose={handleCloseSidebar}
            />
          </motion.div>
        )}
      </div>
    </>
  )
}
