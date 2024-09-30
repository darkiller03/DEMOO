/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import axios from 'axios' // Import axios for API calls

const FolderUpload = ({ onFolderUpload, setLoading }) => {
  const [files, setFiles] = useState([])

  const handleFileChange = (event) => {
    setFiles(event.target.files) // Store the files selected from folder
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!files.length) {
      console.error('No files selected')
      return
    }

    const validFiles = Array.from(files)
    console.log('Valid files:', validFiles)

    const allVulnerabilities = []
    const promises = []

    for (const file of validFiles) {
      if (file instanceof File) {
        const reader = new FileReader()

        const promise = new Promise((resolve, reject) => {
          reader.onload = async (e) => {
            const content = e.target.result // Read file content
            const fileName = file.name

            // Make API call for each file
            try {
              setLoading(true) // Start loading
              const response = await axios.post(
                'http://localhost:8000/api/analyze_code/',
                { code: content, FileName: fileName },
                { headers: { 'Content-Type': 'application/json' } }
              )

              // Collect vulnerabilities for this file
              const fileVulnerabilities = {
                fileName: fileName,
                vulnerabilities: response.data.Vulnerabilities || []
              }

              allVulnerabilities.push(fileVulnerabilities) // Add to the overall result
              console.log(`API response for file: ${fileName}`, response.data)

              resolve()
            } catch (error) {
              console.error(`Error uploading file: ${fileName}`, error)
              reject(error)
            } finally {
              setLoading(false) // End loading
            }
          }

          reader.onerror = (error) => {
            console.error('Error reading file:', error)
            reject(error)
          }
        })

        reader.readAsText(file)
        promises.push(promise)
      } else {
        console.error('Invalid file:', file)
      }
    }

    // Wait for all file uploads to complete
    try {
      await Promise.all(promises)
      console.log('All vulnerabilities:', allVulnerabilities)
      onFolderUpload(allVulnerabilities) // Pass the vulnerabilities data to the parent component
    } catch (error) {
      console.error('Error processing files:', error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          webkitdirectory="true"
          onChange={handleFileChange}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  )
}

export default FolderUpload
