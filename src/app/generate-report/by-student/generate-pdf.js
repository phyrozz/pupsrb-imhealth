import React from 'react'
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table'
import IconCalendar from '../svg-icons/calendar'

export default function GeneratePDFByStudent({ reports, scenarioData, startDate, endDate, recommendations, filters }) {
  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      flexDirection: 'column',
      padding: 20,
    },
    section: {
      marginBottom: 10,
    },
    flexRowSection: {
      flexDirection: 'row',
      gap: 5,
      paddingVertical: 3,
    },
    centerText: {
      fontSize: 10,
      textAlign: 'center',
    },
    header: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 14,
      fontWeight: 600,
      marginBottom: 10,
      textAlign: 'center',
    },
    subHeader: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 12,
      fontWeight: 600,
      marginTop: 5,
      marginBottom: 10,
    },
    text: {
      fontSize: 9,
      marginBottom: 5,
    },
    boldedText: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 9,
    },
    tableText: {
      fontSize: 8,
      flexWrap: "wrap"
    },
    tableHeader: {
      border: 1,
      borderColor: "#D1D5DB",
      backgroundColor: "#E5E7EB",
      borderRadius: 5,
      marginBottom: 3,
    },
    tableHeaderText: {
      fontSize: 8,
      fontFamily: 'Helvetica-Bold',
    },
    tableCell: {
      margin: 3,
      border: 0
    },
    boldedTableCellRow: {
      fontFamily: 'Helvetica-Bold',
      margin: 3,
      border: 0
    },
    remarks: {
      borderRadius: 5,
      padding: 20,
      fontSize: 12,
    }
  })

  const [reportData, setReportData] = React.useState([])
  const [scenarios, setScenarios] = React.useState([])

  React.useEffect(() => {
    let data = reports.map((item) => ({
      name: `${item.profiles.personal_details[0].first_name} ${item.profiles.personal_details[0].middle_name} ${item.profiles.personal_details[0].last_name} ${item.profiles.personal_details[0].name_suffix}`,
      studentNumber: item.profiles.personal_details[0].student_number,
      program: item.profiles.personal_details[0].programs.initial,
      year: item.profiles.personal_details[0].year,
      createdAt: item.created_at,
      counselingStatus: item.counseling_statuses.name,
      result: item.assessment_scenarios.name,
      domains: item.domains
    }))

    if (filters.domains) {
      // Filter data by selected domains
      data = data.filter(item => {
        const itemDomainNames = item.domains.map(domain => domain.domain_name)
        return filters.domains.domainNames.some(selectedDomain => itemDomainNames.includes(selectedDomain))
      })
    }

    const scenarios = scenarioData.map((item) => ({
      name: item.name,
      description: item.description,
    }))
    setReportData(data)
    setScenarios(scenarios)
  }, [filters.domains, reports, scenarioData])

  const formattedDateTime = (datetimeString) => {
    const date = new Date(datetimeString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }
    return date.toLocaleDateString('en-US', options)
  }

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }
    return date.toLocaleDateString('en-US', options)
  }

  const AssessmentReport = ({ data }) => (
    <View style={styles.section}>
      <Text style={styles.subHeader}>Assessments answered by {data[0].name}</Text>
      {startDate && endDate && <View style={styles.flexRowSection}>
        <IconCalendar />
        <Text style={styles.boldedText}>
          {`${formattedDate(startDate)} - ${formattedDate(endDate)}`}
        </Text>
      </View>}
      <Table>
        <TH style={styles.tableHeader}>
          <TD weighting={0.25} style={styles.tableCell}><Text style={styles.tableHeaderText}>Session Date</Text></TD>
          <TD weighting={0.20} style={styles.tableCell}><Text style={styles.tableHeaderText}>Status</Text></TD>
          <TD weighting={0.20} style={styles.tableCell}><Text style={styles.tableHeaderText}>Assessment Result</Text></TD>
          <TD weighting={0.35} style={styles.tableCell}><Text style={styles.tableHeaderText}>Possible issues related to</Text></TD>
        </TH>
        {data.map((item, index) => (
          <TR key={index}>
            <TD weighting={0.25} style={styles.tableCell}><Text style={styles.tableText}>{formattedDateTime(item.createdAt)}</Text></TD>
            <TD weighting={0.20} style={styles.tableCell}><Text style={styles.tableText}>{item.counselingStatus}</Text></TD>
            <TD weighting={0.20} style={styles.boldedTableCellRow}><Text style={styles.tableText}>{item.result}</Text></TD>
            <TD weighting={0.35} style={styles.boldedTableCellRow}><Text style={styles.tableText}>{item.domains.length ? (item.domains.map(item => item.domain_name)).join(', ') : "None"}</Text></TD>
          </TR>
        ))}
      </Table>
    </View>
  )

  const ScenarioTable = ({ scenarios }) => (
    <View style={styles.section}>
      <Text style={styles.subHeader}>Scenarios</Text>
      <Table>
        <TH style={styles.tableHeader}>
          <TD weighting={0.2} style={styles.tableCell}><Text style={styles.tableHeaderText}>Name</Text></TD>
          <TD weighting={0.8} style={styles.tableCell}><Text style={styles.tableHeaderText}>Description</Text></TD>
        </TH>
        {scenarios.map((scenario, index) => (
          <TR key={index}>
            <TD weighting={0.2} style={styles.boldedTableCellRow}><Text style={styles.tableText}>{scenario.name}</Text></TD>
            <TD weighting={0.8} style={styles.tableCell}><Text style={styles.tableText}>{scenario.description}</Text></TD>
          </TR>
        ))}
      </Table>
    </View>
  )

  const NarrativeTable = ({ data }) => (
    <View style={styles.section}>
      <Text style={styles.subHeader}>Narrative Interpretations</Text>
      <Table>
        {data.map((item, index) => 
          <TR key={index}>
            <TD style={styles.tableCell}>
              <View>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 5 }}>{formattedDateTime(item.createdAt)}</Text>
                {item.domains.length ? <>
                  <Text style={{ fontSize: 9 }}>Possible issues related to:</Text>
                  <Text style={styles.boldedText}>{item.domains.map((domain) => domain.domain_name).join(", ")}</Text>
                </> : <Text style={styles.boldedText}>No possible issues.</Text>}
              </View>
              {/* {item.domains.map((domain) => 
                <View style={{flexDirection: "column", width: 400}}>
                  <View style={{ flexDirection: "row", marginBottom: 4 }}>
                    <Text style={{ marginHorizontal: 8 }}>•</Text>
                    <Text>{domain.domain_name}</Text>
                  </View>
                </View>
              )} */}
            </TD>
          </TR>
        )}
      </Table>
    </View>
  )

  return (
    <Document>
      <Page style={styles.page}>
        <View>
          <Text style={styles.centerText}>PUP-iMHealth</Text>
          <Text style={styles.header}>Assessment Report</Text>
        </View>
        {reportData.length > 0 && <AssessmentReport data={reportData} />}
        <ScenarioTable scenarios={scenarios} />
        <NarrativeTable data={reportData} />
        <View style={styles.section}>
          <Text style={styles.subHeader}>Recommendations/Referral</Text>
          <Table>
            <TR key={0}>
              <TD style={styles.remarks}>{recommendations}</TD>
            </TR>
          </Table>
        </View>
      </Page>
    </Document>
  )
}
