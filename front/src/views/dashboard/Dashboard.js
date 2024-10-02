/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsB,
} from '@coreui/react'
import axios from 'axios'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const [vulnerabilities, setVulnerabilities] = useState([])
  const [error, setError] = useState(null)
  const fileName = useSelector((state) => state.fileName) || 'Unknown Filename'
  const folderName = useSelector((state)=> state.folderName ) || 'Unknown Foldername'

  // Fetch vulnerabilities from the API

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/vulnerabilities/${encodeURIComponent(fileName)}/`
        )
        setVulnerabilities(response.data)
      } catch (error) {
        setError('Error fetching vulnerabilities')
        console.error('There was an error!', error)
      }
    }

    if (fileName !== 'Unknown Filename') {
      fetchData()
    }
  }, [fileName])

  // Fetch vulnerabilities from the API by folderName
  useEffect(() => {
    const fetchDataByFolder = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/vulnerabilities/folder/${encodeURIComponent(folderName)}/`
        )
        console.log("hedha el return mta3 el vulns by fodlername",response.data)
        setVulnerabilities(response.data)
      } catch (error) {
        setError('Error fetching vulnerabilities by folder')
        console.error('There was an error!', error)
      }
    }

    if (folderName !== 'Unknown Foldername') {
      fetchDataByFolder()
    }
  }, [folderName])
  
  // Calculate statistics
  const totalVulnerabilities = vulnerabilities.length
  const resolvedCount = vulnerabilities.filter((v) => v.status === 'Resolved').length
  const resolvedPercentage = ((resolvedCount / totalVulnerabilities) * 100).toFixed(1)
  const criticalCount = vulnerabilities.filter((v) => v.risk === 'Critical').length
  const criticalPercentage = ((criticalCount / totalVulnerabilities) * 100).toFixed(1)
  const highPriorityCount = vulnerabilities.filter((v) => v.priority === 'High').length
  const highPriorityPercentage = ((highPriorityCount / totalVulnerabilities) * 100).toFixed(1)

  // Filter open vulnerabilities
  const openVulnerabilities = vulnerabilities.filter((v) => v.status !== 'Resolved')
  
  // Handle status change for vulnerabilities
  const handleStatusChange = async (e, vulnerabilityId) => {
    const newStatus = e.target.value
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/vulnerability/${vulnerabilityId}/status/`,
        { status: newStatus }
      )

      if (response.status === 200) {
        setVulnerabilities((prevVulnerabilities) =>
          prevVulnerabilities.map((v) =>
            v.id === vulnerabilityId ? { ...v, status: newStatus } : v
          )
        )
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <div>
      {totalVulnerabilities > 0 ? (
        <>
          <CRow>
            <CCol xs={3}>
              <CWidgetStatsB
                className="mb-3"
                progress={{ value: resolvedPercentage }}
                text="Resolved Vulnerabilities"
                title="Resolved Status"
                value={`${resolvedPercentage}%`}
                color="success"
                inverse
              />
            </CCol>
            <CCol xs={3}>
              <CWidgetStatsB
                className="mb-3"
                color="primary"
                inverse
                progress={{ value: criticalPercentage }}
                text="Critical Risk Vulnerabilities"
                title="Critical Risk"
                value={`${criticalPercentage}%`}
              />
            </CCol>
            <CCol xs={3}>
              <CWidgetStatsB
                className="mb-3"
                progress={{ value: highPriorityPercentage }}
                text="High Priority Vulnerabilities"
                title="High Priority"
                value={`${highPriorityPercentage}%`}
                color="warning"
                inverse
              />
            </CCol>
            <CCol xs={3}>
              <CWidgetStatsB
                className="mb-3"
                color="danger"
                inverse
                progress={{ value: 100 - resolvedPercentage }}
                text="Open Vulnerabilities"
                title="Open Status"
                value={`${(100 - resolvedPercentage).toFixed(1)}%`}
              />
            </CCol>
          </CRow>

          {openVulnerabilities.length > 0 ? (
            <CRow>
              <CCol xs>
                <CCard className="mb-4">
                  <CCardHeader>List of Open Vulnerabilities</CCardHeader>
                  <CCardBody>
                    <CTable align="middle" className="mb-0 border" hover responsive>
                      <CTableHead className="text-nowrap">
                        <CTableRow>
                          <CTableHeaderCell className="bg-body-tertiary text-center">
                            Vulnerability
                          </CTableHeaderCell>
                          <CTableHeaderCell className="bg-body-tertiary text-center">
                            Priority
                          </CTableHeaderCell>
                          <CTableHeaderCell className="bg-body-tertiary text-center">
                            Risk
                          </CTableHeaderCell>
                          <CTableHeaderCell className="bg-body-tertiary text-center">
                            Status
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        
                        {openVulnerabilities.map((item, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell className="text-center">{item.vulnerability}</CTableDataCell>
                            <CTableDataCell className="text-center">{item.priority}</CTableDataCell>
                            <CTableDataCell className="text-center">{item.risk}</CTableDataCell>
                            <CTableDataCell className="text-center">
                              <select
                                value={item.status}
                                onChange={(e) => handleStatusChange(e, item.id)}
                              >
                                <option value="Open">Open</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                            </CTableDataCell>
                          </CTableRow>
                        ))}

                      </CTableBody>
                    </CTable>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          ) : (
            <h2>All vulnerabilities have been resolved!</h2>
          )}
        </>
      ) : (
        <h2>Please check the Vulnerabilities Section</h2>
      )}
    </div>
  )
}

export default Dashboard
