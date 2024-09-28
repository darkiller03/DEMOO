/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import axios from 'axios' // Import axios for API calls

const FolderUpload = ({ onFolderUpload, setLoading }) => {
  const [files, setFiles] = useState([])

  const handleFileChange = (event) => {
    setFiles(event.target.files) // This will contain all the files inside the folder
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Check if files are selected and log them
    if (!files.length) {
      console.error('No files selected')
      return
    }

    // Convert the FileList to an array
    const validFiles = Array.from(files)
    console.log('Valid files:', validFiles)

    const fileContents = []
    const promises = []

    // Process each valid file
    for (const file of validFiles) {
      // Check if the file is a valid Blob before processing
      if (file instanceof File) {
        const reader = new FileReader()
        const promise = new Promise(async (resolve, reject) => {
          reader.onload = async (e) => {
            const content = e.target.result // Read the file content
            fileContents.push({ name: file.name, content }) // Store file name and content

            // Make API call for each file
            try {
              setLoading(true) // Set loading state
              const response = await axios.post(
                'http://localhost:8000/api/analyze_code/',
                { code: content, FileName: file.name },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                },
              )

              // Handle the API response if needed
              console.log('API response for file:', file.name, response.data)
              resolve() // Resolve promise when done
            } catch (error) {
              console.error('Error uploading file:', file.name, error)
              reject(error) // Reject promise if there's an error
            } finally {
              setLoading(false) // Reset loading state
            }
          }

          reader.onerror = (error) => {
            console.error('Error reading file:', error)
            reject(error)
          }
        })

        reader.readAsText(file) // Read the file as text
        promises.push(promise)
      } else {
        console.error('Invalid file:', file)
      }
    }

    // Wait for all files to be processed
    try {
      await Promise.all(promises)
      console.log('Uploaded file contents:', fileContents)
      if (onFolderUpload) {
        onFolderUpload(fileContents) // Pass the contents to the parent component if needed
      }
    } catch (error) {
      console.error('Error processing files:', error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" webkitdirectory="true" dir="true" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  )
}

export default FolderUpload
