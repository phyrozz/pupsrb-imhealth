import React from 'react'
import { parse } from 'papaparse'
import { createClient } from '@supabase/supabase-js'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import assessUserAssessment from '../assessment/form/apriori';

export default function UploadCSVButton() {
  const [csvData, setCSVData] = React.useState([])
  const {isOpen, onOpen, onOpenChange} = useDisclosure()
  const fileInputRef = React.useRef(null)
  const [isUploading, setIsUploading] = React.useState(false)

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]

    if (!file) {
      // No file selected, do nothingzz
      return
    }

    if (isOpen) {
      onOpenChange() // Close the modal if it's already open
    }
    
    parse(file, {
      header: true,
      complete: async (results) => {
        console.log(results.data)
        setCSVData(results.data)
        // await insertDataIntoDatabase(results.data)
      },
    })

    onOpen()
  }

  const handleCloseModal = () => {
    setCSVData([])
    onOpenChange()
  
    if (fileInputRef.current) {
      fileInputRef.current.value = '' // Reset the file input value
    }
  }

  const generateRandomPassword = (length) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[]|;:,.<>?'
    let password = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      password += charset[randomIndex]
    }
    return password
  }

  const insertDataIntoDatabase = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabase = createClient(supabaseUrl, supabaseKey)

    setIsUploading(true)

    try {
      csvData.map(async (userData) => {
        if (typeof userData["Email Address"] !== undefined) {
          if (typeof userData["Name"] !== undefined) {
            var email = userData["Email Address"]
            var password = generateRandomPassword(12)
            var { data: studentData, error: studentError } = await supabase.auth.signUp({ email, password })
  
            if (!studentError) {
              var name = userData["Name"];
              var parts = name.split(','); // Split by comma to separate last name from the rest
              var lastName = parts[0].trim(); // Get the last name and remove leading/trailing spaces
              var otherParts = parts[1].trim().split(' '); // Get the other parts and split by space
              var firstName = otherParts.slice(0, -1).join(' '); // Join all parts except the last one as first name
              var suffixNames = otherParts.slice(-1).join(' '); // Get the last part as suffix names
  
              var year = userData["Year Level"]
              var program = userData["Program"]
              var programId = null
              switch (program) {
                case "BSBAHRM-SR":
                  programId = 9
                  break;
                case "BSIE-SR":
                  programId = 6
                  break;
                case "BTLEDHE-SR":
                  programId = 12
                  break;
                case "BSPSY-SR":
                  programId = 8
                  break;
                case "BSBAMM-SR":
                  programId = 2
                  break;
                case "BSA-SR":
                  programId = 1
                  break;
                case "BS-ECE-SR":
                  programId = 5
                  break;
                case "BSIT-SR":
                  programId = 7
                  break;
                case "BSMA-SR":
                  programId = 11
                  break;
                default:
                  programId = 1
                  break;
              }
              var maritalStatus = userData["Civil Status"]
              var maritalStatusId = null
              switch (maritalStatus) {
                case "Single":
                  maritalStatusId = 1
                  break;
                case "Married":
                  maritalStatusId = 2
                  break;
                default:
                  maritalStatus = 1
                  break;
              }
  
              await supabase.from("personal_details").insert({
                user_id: studentData.user.id,
                email: email,
                first_name: firstName,
                last_name: lastName,
                name_suffix: suffixNames,
                year: year,
                program_id: programId,
                marital_status_id: maritalStatusId
              })
            }
  
            // Insert assessment results
            var responses = []
            responses.push(parseInt(userData["I. 01. Little interest or pleasure in doing things?"]))
            responses.push(parseInt(userData["I. 02. Feeling down, depressed, or hopeless?"]))
            responses.push(parseInt(userData["II. 03. Feeling more irritated, grouchy, or angry than usual?"]))
            responses.push(parseInt(userData["III. 04. Sleeping less than usual, but still have a lot of energy?"]))
            responses.push(parseInt(userData["III. 05. Starting lots more projects than usual or doing more risky things than usual?"]))
            responses.push(parseInt(userData["IV. 06. Feeling nervous, anxious, frightened, worried, or on edge?"]))
            responses.push(parseInt(userData["IV. 07. Feeling panic or being frightened?"]))
            responses.push(parseInt(userData["IV. 08. Avoiding situations that make you anxious?"]))
            responses.push(parseInt(userData["V. 09. Unexplained aches and pains (e.g., head, back, joints, abdomen, legs)?"]))
            responses.push(parseInt(userData["V. 10. Feeling that your illnesses are not being taken seriously enough?"]))
            responses.push(parseInt(userData["VI. 11. Thoughts of actually hurting yourself?"]))
            responses.push(parseInt(userData["VII. 12. Hearing things other people couldn't hear, such as voices even when no one was around?"]))
            responses.push(parseInt(userData["VII. 13. Feeling that someone could hear your thoughts, or that you could hear what another person was thinking?"]))
            responses.push(parseInt(userData["VIII. 14. Problem with sleep that affected your sleep quality over all?"]))
            responses.push(parseInt(userData["IX. 15. Problems with memory (e.g., learning new information) or with location (e.g., finding your way home)?"]))
            responses.push(parseInt(userData["X. 16. Unpleasant thoughts, urges, or images that repeatedly enter your mind?"]))
            responses.push(parseInt(userData["X. 17. Feeling driven to perform certain behaviors or mental acts over and over again?"]))
            responses.push(parseInt(userData["XI. 18. Feeling detached or distant from yourself, your body, your physical surroundings, or your memories?"]))
            responses.push(parseInt(userData["XII. 19. Not knowing how you really are or what you want out of life?"]))
            responses.push(parseInt(userData["XII. 20. Not feeling close to other people or enjoying your relationships with them?"]))
            responses.push(parseInt(userData["XIII. 21. Drinking at least 4 drinks of any kind of alcohol in a single day?"]))
            responses.push(parseInt(userData["XIII. 22. Smoking any cigarettes, a cigar, or pipe, or using snuff or chewing tobacco?"]))
            responses.push(parseInt(userData["XIII. 23. Using any of the following medicines ON YOUR OWN..."]))
            var assessmentAnsweredAt = userData["Timestamp"]
  
            if (studentData.user.id) {
              var { data: assessmentData } = await supabase.from("assessments").insert({
                user_id: studentData.user.id,
                created_at: assessmentAnsweredAt,
                responses: responses
              }).select()
    
              // Other necessary inserts
              await supabase.from("assessment_reminders").upsert({
                id: studentData.user.id,
                last_assessment_at: assessmentAnsweredAt,
                reminder_sent: false
              })
    
              var result = await assessUserAssessment(studentData.user.id, responses)
              var { error: resultError } = await supabase.from("apriori_results").insert([
                {
                  assessment_id: assessmentData[0].id,
                  user_id: studentData.user.id,
                  apriori_result: result.scenario,
                },
              ])

              if (resultError) {
                throw new Error("Error inserting assessment:", resultError.message)
              }
            }
          }
        }
      })
    } catch (error) {
      console.error(error)
    }

    setIsUploading(false)
    handleCloseModal()
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onOpenChange} scrollBehavior="inside" size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black">Confirm import</ModalHeader>
              <ModalBody>
                <p className="text-medium font-bold pb-2">Are you sure you want to import this data?</p>
                {csvData.length > 0 && (
                  <Table removeWrapper>
                    <TableHeader>
                      {Object.keys(csvData[0]).map((header, index) => (
                        <TableColumn key={index}>{header}</TableColumn>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {csvData.map((row, rowIndex) => (
                        Object.keys(csvData[0]).every((key) => row[key] !== undefined) && ( // Check if all expected fields are present
                          <TableRow key={rowIndex}>
                            {Object.values(row).map((value, colIndex) => (
                              <TableCell key={colIndex}>{value}</TableCell>
                            ))}
                          </TableRow>
                        )
                      ))}
                    </TableBody>
                  </Table>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button color="primary" onClick={insertDataIntoDatabase} isLoading={isUploading}>
                  Yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <button>
        <label className="text-sm cursor-pointer" htmlFor="upload-input">
          Import (.csv)
        </label>
        <input 
          id="upload-input"
          style={{
            visibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0
          }} 
          type="file" 
          accept=".csv" 
          onChange={handleFileUpload} 
        />
      </button>
    </>
    
  )
}
