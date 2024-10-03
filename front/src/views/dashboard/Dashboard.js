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

// Folder Dashboard Component
const FolderDashboard = ({ folderName }) => {
  const [vulnerabilities, setVulnerabilities] = useState({});
  const [error, setError] = useState(null);
  const folder = useSelector((state) => state.folderName) || 'Unknown Foldername';

  // Fetch vulnerabilities from the API by folderName
  useEffect(() => {
    const fetchDataByFolder = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/vulnerabilities/folder/${encodeURIComponent(folder)}/`
        );
        const transformedData = Object.keys(response.data).reduce((acc, filename) => {
          acc[filename] = response.data[filename];
          return acc;
        }, {});

        setVulnerabilities(transformedData);
        console.log("Transformed vulnerabilities by folder:", transformedData);
      } catch (error) {
        setError('Error fetching vulnerabilities by folder');
        console.error('There was an error!', error);
      }
    };

    if (folder !== 'Unknown Foldername') {
      fetchDataByFolder();
    }
  }, [folder]);

  // Calculate statistics for folder
  const totalVulnerabilities_F = Object.values(vulnerabilities).flat().length;
  const resolvedCount_F = Object.values(vulnerabilities).flat().filter((v) => v.status === 'Resolved').length;
  const resolvedPercentage_F = ((resolvedCount_F / totalVulnerabilities_F) * 100).toFixed(1);
  const criticalCount_F = Object.values(vulnerabilities).flat().filter((v) => v.risk === 'Critical').length;
  const criticalPercentage_F = ((criticalCount_F / totalVulnerabilities_F) * 100).toFixed(1);
  const highPriorityCount_F = Object.values(vulnerabilities).flat().filter((v) => v.priority === 'High').length;
  const highPriorityPercentage_F = ((highPriorityCount_F / totalVulnerabilities_F) * 100).toFixed(1);

  // Filter open vulnerabilities for folder
  const openVulnerabilities_F = Object.entries(vulnerabilities).reduce((acc, [filename, items]) => {
    const unresolvedItems = items.filter((v) => v.status !== 'Resolved');
    if (unresolvedItems.length > 0) {
      acc[filename] = unresolvedItems;
    }
    return acc;
  }, {});

  // Handle status change for vulnerabilities for folder
  const handleStatusChange_F = async (e, vulnerabilityId) => {
    const newStatus = e.target.value;
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/vulnerability/${vulnerabilityId}/status/`,
        { status: newStatus }
      );

      if (response.status === 200) {
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

  // Return for folder
  return (
    <div>
      {error && <p className="text-danger">{error}</p>}
      {totalVulnerabilities_F > 0 ? (
        <>
          <h2>{`Vulnerabilities in Folder: ${folder}`}</h2>
          <CRow>
            <CCol xs={3}>
              <CWidgetStatsB
                className="mb-3"
                progress={{ value: resolvedPercentage_F }}
                text="Resolved Vulnerabilities"
                title="Resolved Status"
                value={`${resolvedPercentage_F}%`}
                color="success"
                inverse
              />
            </CCol>
            <CCol xs={3}>
              <CWidgetStatsB
                className="mb-3"
                color="primary"
                inverse
                progress={{ value: criticalPercentage_F }}
                text="Critical Risk Vulnerabilities"
                title="Critical Risk"
                value={`${criticalPercentage_F}%`}
              />
            </CCol>
            <CCol xs={3}>
              <CWidgetStatsB
                className="mb-3"
                progress={{ value: highPriorityPercentage_F }}
                text="High Priority Vulnerabilities"
                title="High Priority"
                value={`${highPriorityPercentage_F}%`}
                color="warning"
                inverse
              />
            </CCol>
            <CCol xs={3}>
              <CWidgetStatsB
                className="mb-3"
                color="danger"
                inverse
                progress={{ value: 100 - resolvedPercentage_F }}
                text="Open Vulnerabilities"
                title="Open Status"
                value={`${(100 - resolvedPercentage_F).toFixed(1)}%`}
              />
            </CCol>
          </CRow>

          {Object.keys(openVulnerabilities_F).length > 0 ? (
            Object.entries(openVulnerabilities_F).map(([filename, items]) => (
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
                                  onChange={(e) => handleStatusChange_F(e, item.id)}
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
            <h2>All vulnerabilities have been resolved for {folder}!</h2>
          )}
        </>
      ) : (
        <h2>Please check the Vulnerabilities Section</h2>
      )}
    </div>
  );
};

// File Dashboard Component
const FileDashboard = ({ fileName }) => {
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [error, setError] = useState(null);
  const file = useSelector((state) => state.fileName) || 'Unknown Filename';

  // Fetch vulnerabilities from the API by filename
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/vulnerabilities/${encodeURIComponent(file)}/`
        );
        setVulnerabilities(response.data);
      } catch (error) {
        setError('Error fetching vulnerabilities');
        console.error('There was an error!', error);
      }
    };

    if (file !== 'Unknown Filename') {
      fetchData();
    }
  }, [file]);

  // Calculate statistics for file 
  const totalVulnerabilities_f = vulnerabilities.length;
  const resolvedCount_f = vulnerabilities.filter((v) => v.status === 'Resolved').length;
  const resolvedPercentage_f = ((resolvedCount_f / totalVulnerabilities_f) * 100).toFixed(1);
  const criticalCount_f = vulnerabilities.filter((v) => v.risk === 'Critical').length;
  const criticalPercentage_f = ((criticalCount_f / totalVulnerabilities_f) * 100).toFixed(1);
  const highPriorityCount_f = vulnerabilities.filter((v) => v.priority === 'High').length;
  const highPriorityPercentage_f = ((highPriorityCount_f / totalVulnerabilities_f) * 100).toFixed(1);

  // Filter open vulnerabilities for file
  const openVulnerabilities_f = vulnerabilities.filter((v) => v.status !== 'Resolved');

  // Handle status change for vulnerabilities for file
  const handleStatusChange_f = async (e, vulnerabilityId) => {
    const newStatus = e.target.value;
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/vulnerability/${vulnerabilityId}/status/`,
        { status: newStatus }
      );

      if (response.status === 200) {
        setVulnerabilities((prevVulnerabilities) =>
          prevVulnerabilities.map((v) =>
            v.id === vulnerabilityId ? { ...v, status: newStatus } : v
          )
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Return for file
  return (
    <div>
      {error && <p className="text-danger">{error}</p>}
      {totalVulnerabilities_f > 0 ? (
        <>
          <h2>{`Vulnerabilities in File: ${file}`}</h2>
          <CRow>
            <CCol xs={3}>
              <CWidgetStatsB
                className="mb-3"
                progress={{ value: resolvedPercentage_f }}
                text="Resolved Vulnerabilities"
                title="Resolved Status"
                value={`${resolvedPercentage_f}%`}
                color="success"
                inverse
              />
            </CCol>
            <CCol xs={3}>
              <CWidgetStatsB
                className="mb-3"
                color="primary"
                inverse
                progress={{ value: criticalPercentage_f }}
                text="Critical Risk Vulnerabilities"
                title="Critical Risk"
                value={`${criticalPercentage_f}%`}
              />
            </CCol>
            <CCol xs={3}>
              <CWidgetStatsB
                className="mb-3"
                progress={{ value: highPriorityPercentage_f }}
                text="High Priority Vulnerabilities"
                title="High Priority"
                value={`${highPriorityPercentage_f}%`}
                color="warning"
                inverse
              />
            </CCol>
            <CCol xs={3}>
              <CWidgetStatsB
                className="mb-3"
                color="danger"
                inverse
                progress={{ value: 100 - resolvedPercentage_f }}
                text="Open Vulnerabilities"
                title="Open Status"
                value={`${(100 - resolvedPercentage_f).toFixed(1)}%`}
              />
            </CCol>
          </CRow>

          {openVulnerabilities_f.length > 0 ? (
            <CRow>
              <CCol xs>
                <CCard className="mb-4">
                  <CCardHeader>{`Open Vulnerabilities in ${file}`}</CCardHeader>
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
                        {openVulnerabilities_f.map((item) => (
                          <CTableRow key={item.id}>
                            <CTableDataCell className="text-center">{item.vulnerability}</CTableDataCell>
                            <CTableDataCell className="text-center">{item.priority}</CTableDataCell>
                            <CTableDataCell className="text-center">{item.risk}</CTableDataCell>
                            <CTableDataCell className="text-center">
                              <select
                                value={item.status}
                                onChange={(e) => handleStatusChange_f(e, item.id)}
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
            <h2>All vulnerabilities have been resolved for {file}!</h2>
          )}
        </>
      ) : (
        <h2>Please check the Vulnerabilities Section</h2>
      )}
    </div>
  );
};

const Dashboard = () => {
  const currentType = window.location.pathname.includes('file') ? 'file' : 'folder';
  const folderName = useSelector((state) => state.folderName) || 'Unknown Foldername';
  const fileName = useSelector((state) => state.fileName) || 'Unknown Filename';

  return currentType === 'folder' ? (
      <FolderDashboard folderName={folderName} />
  ) : (
      <FileDashboard fileName={fileName} />
  );
};

export default Dashboard;
