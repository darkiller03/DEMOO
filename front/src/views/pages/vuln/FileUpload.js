/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
// src/components/FileUpload.js
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'

const FileUpload = ({ onFileUpload, setLoading }) => {
  const dispatch = useDispatch()
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const handleFileChange = (e) => {
    // setFile(e.target.files[0])
    const file = e.target.files[0]
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const data = event.target.result
      // console.log(data, 'this is data')
      setFile(data)
    }
    reader.readAsText(file)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('file name', fileName)
    if (!file) {
      alert('Please upload a file')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    console.log(formData, 'this is file content')
    try {
      setLoading(true)
      const response = await axios.post(
        'http://localhost:8000/api/analyze_code/',
        { code: file, FileName: fileName },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      // console.log('this is the data fileupload mel aIIIII    ' + response.data)
      // console.log('hedhi mel fileupload', response.data)

      // dispatch({ type: 'AddData', data: response.data })
      // console.log('vylnnn ', response.data.Vulnerabilities)
      onFileUpload(response.data.Vulnerabilities, fileName)
    } catch (error) {
      console.error('Error uploading file ya iyeeedd:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  )
}

export default FileUpload
