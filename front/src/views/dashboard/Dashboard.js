/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
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
} from '@coreui/react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const [vulnerabilities, setVulnerabilities] = useState({});
  const [error, setError] = useState(null);
  const fileName = useSelector((state) => state.fileName) || 'Unknown Filename';
  const folderName = useSelector((state) => state.folderName) || 'Unknown Foldername';

  // Fetch vulnerabilities from the API by folderName
  useEffect(() => {
    const fetchDataByFolder = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/vulnerabilities/folder/${encodeURIComponent(folderName)}/`
        );
        // Store the vulnerabilities in an object with filenames as keys
        const transformedData = Object.keys(response.data).reduce((acc, filename) => {
          acc[filename] = response.data[filename];
          return acc;
        }, {});

        setVulnerabilities(transformedData);
        console.log("Transformed vulnerabilities by folder:", transformedData); // Console log added here
      } catch (error) {
        setError('Error fetching vulnerabilities by folder');
        console.error('There was an error!', error);
      }
    };

    if (folderName !== 'Unknown Foldername') {
      fetchDataByFolder();
    }
  }, [folderName]);

  // Calculate statistics
  const totalVulnerabilities = Object.values(vulnerabilities).flat().length;
  const resolvedCount = Object.values(vulnerabilities).flat().filter((v) => v.status === 'Resolved').length;
  const resolvedPercentage = ((resolvedCount / totalVulnerabilities) * 100).toFixed(1);
  const criticalCount = Object.values(vulnerabilities).flat().filter((v) => v.risk === 'Critical').length;
  const criticalPercentage = ((criticalCount / totalVulnerabilities) * 100).toFixed(1);
  const highPriorityCount = Object.values(vulnerabilities).flat().filter((v) => v.priority === 'High').length;
  const highPriorityPercentage = ((highPriorityCount / totalVulnerabilities) * 100).toFixed(1);

  // Filter open vulnerabilities
  const openVulnerabilities = Object.entries(vulnerabilities).reduce((acc, [filename, items]) => {
    const unresolvedItems = items.filter((v) => v.status !== 'Resolved');
    if (unresolvedItems.length > 0) {
      acc[filename] = unresolvedItems;
    }
    return acc;
  }, {});

  // Handle status change for vulnerabilities
  const handleStatusChange = async (e, vulnerabilityId) => {
    const newStatus = e.target.value;
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/vulnerability/${vulnerabilityId}/status/`,
        { status: newStatus }
      );

      if (response.status === 200) {
        // Update the state by removing the resolved vulnerability
        setVulnerabilities((prevVulnerabilities) => {
          const updated = { ...prevVulnerabilities };
          Object.keys(updated).forEach((filename) => {
            updated[filename] = updated[filename].map((v) =>
              v.id === vulnerabilityId ? { ...v, status: newStatus } : v
            );
          });
          return updated;
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div>
      {totalVulnerabilities > 0 ? (
        <>
          <h2>{`Vulnerabilities in Folder: ${folderName}`}</h2> {/* Display folder name here */}
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

          {Object.keys(openVulnerabilities).length > 0 ? (
            Object.entries(openVulnerabilities).map(([filename, items]) => (
              <CRow key={filename}>
                <CCol xs>
                  <CCard className="mb-4">
                    <CCardHeader>{`Vulnerabilities in ${filename}`}</CCardHeader>
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
                          {items.map((item) => (
                            <CTableRow key={item.id}>
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
            ))
          ) : (
            <h2>All vulnerabilities have been resolved for {folderName}!</h2>
          )}
        </>
      ) : (
        <h2>Please check the Vulnerabilities Section</h2>
      )}
    </div>
  );
};

export default Dashboard;
