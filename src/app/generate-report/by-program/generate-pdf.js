import React from 'react'
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table'
import IconCalendar from '../svg-icons/calendar'

export default function GeneratePDF({ reports, scenarioData, startDate, endDate, recommendations, filters }) {
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
    flexRowSectionItemsBetween: {
      flexDirection: 'row',
      gap: 5,
      justifyContent: "space-between",
      alignItems: "center",
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
    const data = reports.map((item) => ({
      name: `${item.profiles.personal_details[0].first_name} ${item.profiles.personal_details[0].middle_name} ${item.profiles.personal_details[0].last_name} ${item.profiles.personal_details[0].name_suffix}`,
      studentNumber: item.profiles.personal_details[0].student_number,
      program: item.profiles.personal_details[0].programs.initial,
      year: item.profiles.personal_details[0].year,
      createdAt: item.created_at,
      result: item.assessment_scenarios.name,
    }));
    const scenarios = scenarioData.map((item) => ({
      name: item.name,
      description: item.description,
    }))
    setReportData(data)
    setScenarios(scenarios)
  }, [reports, scenarioData])

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
      <View style={styles.flexRowSectionItemsBetween}>
        <Text style={styles.subHeader}>Assessments</Text>
        <Text style={styles.boldedText}>
          {new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
          })}
        </Text>
      </View>
      {startDate && endDate && <View style={styles.flexRowSection}>
        <IconCalendar />
        <Text style={styles.boldedText}>
          {`${formattedDate(startDate)} - ${formattedDate(endDate)}`}
        </Text>
      </View>}
      <Table>
        <TH style={styles.tableHeader}>
          <TD weighting={0.3} style={styles.tableCell}><Text style={styles.tableHeaderText}>Name</Text></TD>
          <TD weighting={0.15} style={styles.tableCell}><Text style={styles.tableHeaderText}>Student Number</Text></TD>
          <TD weighting={0.15} style={styles.tableCell}><Text style={styles.tableHeaderText}>Year</Text></TD>
          <TD weighting={0.2} style={styles.tableCell}><Text style={styles.tableHeaderText}>Session Date</Text></TD>
          <TD weighting={0.15} style={styles.tableCell}><Text style={styles.tableHeaderText}>Assessment Result</Text></TD>
        </TH>
        {data.map((item, index) => (
          <TR key={index}>
            <TD weighting={0.3} style={styles.tableCell}><Text style={styles.tableText}>{item.name}</Text></TD>
            <TD weighting={0.15} style={styles.tableCell}><Text style={styles.tableText}>{item.studentNumber}</Text></TD>
            <TD weighting={0.15} style={styles.tableCell}><Text style={styles.tableText}>{item.program} {item.year}</Text></TD>
            <TD weighting={0.2} style={styles.tableCell}><Text style={styles.tableText}>{formattedDateTime(item.createdAt)}</Text></TD>
            <TD weighting={0.15} style={styles.boldedTableCellRow}><Text style={styles.tableText}>{item.result}</Text></TD>
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

  return (
    <Document>
      <Page style={styles.page}>
        <View>
          <Text style={styles.centerText}>PUP-iMHealth</Text>
          <Text style={styles.header}>Assessment Report</Text>
        </View>
        {reportData.length > 0 && <AssessmentReport data={reportData} />}
        <ScenarioTable scenarios={scenarios} />
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
