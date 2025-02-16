"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import yaml from "js-yaml"
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
          let data
          if (file.name.endsWith(".json")) {
            data = JSON.parse(fileContent)
          } else if (file.name.endsWith(".yml") || file.name.endsWith(".yaml")) {
            data = yaml.load(fileContent) as Semester[]
          } else {
            throw new Error("Unsupported file format")
          }
          onFileUpload(data)
        } catch (error) {
          console.error("Error parsing file:", error)
          alert("Error parsing file. Please make sure it's a valid JSON or YAML file.")
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
      "application/x-yaml": [".yml", ".yaml"],
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
        <p className="text-blue-600">Drop the file here...</p>
      ) : (
        <p className="text-blue-600">Drag & drop a JSON or YAML file here, or click to select a file</p>
      )}
    </div>
  )
}

