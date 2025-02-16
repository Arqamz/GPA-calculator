"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Upload, Download } from "lucide-react"
import TranscriptTable from "./transcript-table"
import { Button } from "./ui/button"
import { calculateSGPA, calculateCGPA } from "@/lib/gpa-calculations"
import FileUpload from "./file-upload"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"

export type Subject = {
  name: string
  grade: string
  credits: number
}

export type Semester = {
  name: string
  subjects: Subject[]
}

export default function GpaCalculator() {
  const [transcript, setTranscript] = useState<Semester[]>([])

  const handleAddSemester = () => {
    const newSemester: Semester = {
      name: `Semester ${transcript.length + 1}`,
      subjects: [],
    }
    setTranscript([...transcript, newSemester])
  }

  const handleAddSubject = (semesterIndex: number) => {
    const updatedTranscript = [...transcript]
    updatedTranscript[semesterIndex].subjects.push({
      name: `Course ${updatedTranscript[semesterIndex].subjects.length + 1}`,
      grade: "A",
      credits: 3,
    })
    setTranscript(updatedTranscript)
  }

  const handleSubjectChange = (
    semesterIndex: number,
    subjectIndex: number,
    field: keyof Subject,
    value: string | number,
  ) => {
    const updatedTranscript = [...transcript]
    updatedTranscript[semesterIndex].subjects[subjectIndex][field] = value as never
    setTranscript(updatedTranscript)
  }

  const handleRemoveSubject = (semesterIndex: number, subjectIndex: number) => {
    const updatedTranscript = [...transcript]
    updatedTranscript[semesterIndex].subjects.splice(subjectIndex, 1)
    setTranscript(updatedTranscript)
  }

  const handleFileUpload = (data: Semester[]) => {
    setTranscript(data)
  }

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transcript))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "transcript.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-blue-600 mb-2">GPA Calculator</h1>
        <p className="text-lg text-blue-500 mb-4">Calculate your SGPA and CGPA with ease</p>
        <div className="flex justify-center space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Import Transcript
              </Button>
            </DialogTrigger>
            <DialogContent>
              <FileUpload onFileUpload={handleFileUpload} />
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export Transcript
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {transcript.map((semester, index) => (
            <TranscriptTable
              key={semester.name}
              semester={semester}
              semesterIndex={index}
              onSubjectChange={handleSubjectChange}
              onAddSubject={handleAddSubject}
              onRemoveSubject={handleRemoveSubject}
              sgpa={calculateSGPA(semester)}
              cgpa={calculateCGPA(transcript.slice(0, index + 1))}
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button onClick={handleAddSemester}>
            <Plus className="mr-2 h-4 w-4" /> Add Semester
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

