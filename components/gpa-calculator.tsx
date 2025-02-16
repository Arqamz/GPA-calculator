"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Upload, Download, AlertTriangle, TrendingUp } from "lucide-react"
import TranscriptTable from "./transcript-table"
import { Button } from "./ui/button"
import { calculateSGPA, calculateCGPA } from "@/lib/gpa-calculations"
import FileUpload from "./file-upload"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import Logo from "./logo"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

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
  const [showWarning, setShowWarning] = useState(false)

  const handleAddSemester = useCallback(() => {
    setTranscript((prevTranscript) => [
      ...prevTranscript,
      {
        name: `Semester ${prevTranscript.length + 1}`,
        subjects: [],
      },
    ])
  }, [])

  const handleRemoveSemester = useCallback((semesterIndex: number) => {
    setTranscript((prevTranscript) => prevTranscript.filter((_, index) => index !== semesterIndex))
  }, [])

  const handleAddSubject = useCallback((semesterIndex: number) => {
    setTranscript((prevTranscript) => {
      const newTranscript = [...prevTranscript]
      newTranscript[semesterIndex].subjects = [
        ...newTranscript[semesterIndex].subjects,
        {
          name: `Course ${newTranscript[semesterIndex].subjects.length + 1}`,
          grade: "A",
          credits: 3,
        },
      ]
      return newTranscript
    })
  }, [])

  const handleSubjectChange = useCallback(
    (semesterIndex: number, subjectIndex: number, field: keyof Subject, value: string | number) => {
      setTranscript((prevTranscript) => {
        const newTranscript = [...prevTranscript]
        newTranscript[semesterIndex].subjects[subjectIndex][field] = value as never
        return newTranscript
      })
    },
    [],
  )

  const handleRemoveSubject = useCallback((semesterIndex: number, subjectIndex: number) => {
    setTranscript((prevTranscript) => {
      const newTranscript = [...prevTranscript]
      newTranscript[semesterIndex].subjects.splice(subjectIndex, 1)
      return newTranscript
    })
  }, [])

  const handleFileUpload = useCallback((data: Semester[]) => {
    setTranscript(data)
  }, [])

  const handleExport = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transcript))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "transcript.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }, [transcript])

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <Logo className="w-24 h-24 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-blue-600 mb-2">GPA Calculator</h1>
        <p className="text-lg text-blue-500 mb-4">Calculate your SGPA and CGPA with ease</p>
        <p className="text-md text-blue-400 mb-6">
          Track your academic progress, import/export transcripts, and visualize per course GPA improvements
        </p>
        <div className="flex justify-center space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Import Transcript
              </Button>
            </DialogTrigger>
            <DialogContent>
              <FileUpload onFileUpload={handleFileUpload} />
              <p className="text-sm text-gray-500 mt-2">
                Import your previously exported transcript (JSON format only)
              </p>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export Transcript
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/gpa-improvement">
                  <Button variant="outline" >
                    <TrendingUp className="mr-2 h-4 w-4" /> Calculate GPA Improvement per Course
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Check individual course improvements without importing your full transcript</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Your Transcript</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {transcript.map((semester, index) => (
            <TranscriptTable
              key={`${semester.name}-${index}`}
              semester={semester}
              semesterIndex={index}
              onSubjectChange={handleSubjectChange}
              onAddSubject={handleAddSubject}
              onRemoveSubject={handleRemoveSubject}
              onRemoveSemester={handleRemoveSemester}
              sgpa={calculateSGPA(semester)}
              cgpa={calculateCGPA(transcript.slice(0, index + 1))}
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button onClick={handleAddSemester}>
            <Plus className="mr-2 h-4 w-4" /> Add Semester to Transcript
          </Button>
        </div>
      </motion.div>

      <Alert className="mt-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Don't forget to export your transcript!</AlertTitle>
        <AlertDescription>
          Make sure to export your transcript before leaving the page. This will allow you to easily import and continue
          your work later.
        </AlertDescription>
      </Alert>

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-yellow-500" />
            <h2 className="text-lg font-semibold">Unsaved Changes</h2>
          </div>
          <p>You have unsaved changes in your transcript. Would you like to export before leaving?</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowWarning(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>Export Transcript</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
