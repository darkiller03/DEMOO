/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import FolderUpload from './FolderUpload'
import Spinner from './Spinner'
import { useSelector, useDispatch } from 'react-redux'

const Vulnerabilities = () => {
  const AiData = useSelector((state) => state.AiData)
  const dispatch = useDispatch()
  const [vulnerabilities, setVulnerabilities] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleFolderUpload = (files) => {
    console.log('array of files  ', files)
  }

  const toggleDetails = (id) => {
    const detailsElement = document.getElementById(id)
    const arrow = detailsElement.previousElementSibling.querySelector('.arrow')
    if (detailsElement.style.display === 'none' || detailsElement.style.display === '') {
      detailsElement.style.display = 'block'
      arrow.classList.remove('fa-chevron-right')
      arrow.classList.add('fa-chevron-down')
      detailsElement.previousElementSibling.classList.add('collapsed')
    } else {
      detailsElement.style.display = 'none'
      arrow.classList.remove('fa-chevron-down')
      arrow.classList.add('fa-chevron-right')
      detailsElement.previousElementSibling.classList.remove('collapsed')
    }
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
        vulnerabilities.map((vulnerability, index) => (
          <div className="card mb-3" key={index}>
            <div
              className="card-header vulnerability-header"
              onClick={() => toggleDetails(`details-${index + 1}`)}
            >
              <span className="arrow fas fa-chevron-right"></span>
              <span>{vulnerability.Vulnerability}</span>
            </div>
            <div
              id={`details-${index + 1}`}
              className="card-body vulnerability-details"
              style={{ display: 'none' }}
            >
              <p>
                <strong>Description:</strong> {vulnerability.Description}
              </p>
              <p>
                <strong>Priority:</strong> {vulnerability.Priority}
              </p>
              <p>
                <strong>Risk:</strong> {vulnerability.Risk}
              </p>
              <p>
                <strong>Status:</strong> {vulnerability.Status}
              </p>
              <p>
                <strong>CWE:</strong> {vulnerability.CWE}
              </p>
              <p>
                <strong>Recommendation:</strong> {vulnerability.Recommendation}
              </p>
              <p>
                <strong>Implemented Security Measures:</strong>{' '}
                {vulnerability['Implemented Security Measures']}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No vulnerabilities found.</p>
      )}
    </div>
  )
}

export default Vulnerabilities
