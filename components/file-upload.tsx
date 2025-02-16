"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import type { Semester } from "./gpa-calculator"

type FileUploadProps = {
  onFileUpload: (data: Semester[]) => void
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        const fileContent = event.target?.result as string
        try {
          const data = JSON.parse(fileContent)
          onFileUpload(data)
        } catch (error) {
          console.error("Error parsing file:", error)
          alert("Error parsing file. Please make sure it's a valid JSON file.")
        }
      }

      reader.readAsText(file)
    },
    [onFileUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
    },
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-blue-300 hover:border-blue-500"
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-blue-500 mb-4" />
      {isDragActive ? (
        <p className="text-blue-600">Drop the JSON file here...</p>
      ) : (
        <p className="text-blue-600">Drag & drop a JSON file here, or click to select a file</p>
      )}
    </div>
  )
}

