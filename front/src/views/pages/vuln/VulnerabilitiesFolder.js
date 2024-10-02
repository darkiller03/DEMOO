import React, { useState } from 'react'
import FolderUpload from './FolderUpload'
import Spinner from './Spinner'
import {  useDispatch } from 'react-redux'
const VulnerabilitiesFolder = () => {
  const [vulnerabilities, setVulnerabilities] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  // Define the toggleDetails function
  const toggleDetails = (id) => {
    const detailsElement = document.getElementById(id)
    const arrow = detailsElement.previousElementSibling.querySelector('.arrow')

    if (detailsElement.style.display === 'none' || detailsElement.style.display === '') {
      detailsElement.style.display = 'block'
      arrow.classList.remove('fa-chevron-right')
      arrow.classList.add('fa-chevron-down')
    } else {
      detailsElement.style.display = 'none'
      arrow.classList.remove('fa-chevron-down')
      arrow.classList.add('fa-chevron-right')
    }
  }

  const handleFolderUpload = (vulnerabilitiesData,folderName) => {
    setVulnerabilities(vulnerabilitiesData)
    dispatch({ type: 'AddData', data: { vuln:vulnerabilitiesData,folderName } })
  }

  return (
    <div className="container">
      <h1 className="mt-4 mb-4">Vulnerabilities</h1>
      <div style={{ marginBottom: '50px' }}>
        <FolderUpload onFolderUpload={handleFolderUpload} setLoading={setIsLoading} />
      </div>
      {isLoading ? (
        <Spinner />
      ) : vulnerabilities.length > 0 ? (
        
        vulnerabilities.map((file, fileIndex) => (
          <div key={fileIndex}>
            <h3>File: {file.fileName}</h3>
            {file.vulnerabilities.length > 0 ? (
              file.vulnerabilities.map((vulnerability, index) => (
                <div className="card mb-3" key={index}>
                  <div
                    className="card-header vulnerability-header"
                    onClick={() => toggleDetails(`details-${fileIndex}-${index}`)}
                  >
                    <span className="arrow fas fa-chevron-right"></span>
                    <span>{vulnerability.Vulnerability}</span>
                  </div>
                  <div
                    id={`details-${fileIndex}-${index}`}
                    className="card-body vulnerability-details"
                    style={{ display: 'none' }}
                  >
                    <p><strong>Description:</strong> {vulnerability.Description}</p>
                    <p><strong>Priority:</strong> {vulnerability.Priority}</p>
                    <p><strong>Risk:</strong> {vulnerability.Risk}</p>
                    <p><strong>Status:</strong> {vulnerability.Status}</p>
                    <p><strong>CWE:</strong> {vulnerability.CWE}</p>
                    <p><strong>Recommendation:</strong> {vulnerability.Recommendation}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No vulnerabilities found for this file.</p>
            )}
          </div>
        ))
      ) : (
        <p>No vulnerabilities found.</p>
      )}
    </div>
  )
}

export default VulnerabilitiesFolder
