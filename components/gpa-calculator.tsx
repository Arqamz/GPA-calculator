"use client"

import { useState, useEffect } from "react"
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
import Cookies from "js-cookie"

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

  useEffect(() => {
    const savedTranscript = Cookies.get("transcript")
    if (savedTranscript) {
      setTranscript(JSON.parse(savedTranscript))
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (transcript.length > 0) {
        e.preventDefault()
        e.returnValue = ""
        setShowWarning(true)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [transcript.length]) // Added transcript.length as a dependency

  useEffect(() => {
    if (transcript.length > 0) {
      Cookies.set("transcript", JSON.stringify(transcript), { expires: 365 })
    }
  }, [transcript])

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
      name: "",
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
        <Logo className="w-24 h-24 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-blue-600 mb-2">GPA Calculator</h1>
        <p className="text-lg text-blue-500 mb-4">Calculate your SGPA and CGPA with ease</p>
        <p className="text-md text-blue-400 mb-6">
          Track your academic progress, import/export transcripts, and visualize per course GPA improvements
        </p>
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Your Academic Journey, Simplified</h2>
          <p className="text-blue-600 mb-4">
            This  GPA Calculator is designed to help you keep track of your academic performance. 
            Add semesters, input your courses and grades, and let it calculate your Semester GPA (SGPA) and
            Cumulative GPA (CGPA) for you. With this tool, you can:
          </p>
          <ul className="list-disc list-inside text-blue-600 mb-4">
            <li>Easily manage your academic transcript</li>
            <li>Calculate SGPA and CGPA instantly</li>
            <li>Analyze how improving specific courses could impact your overall GPA</li>
            <li>Export your transcript for safekeeping and future use</li>
          </ul>
        </div>
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
                  <Button variant="outline">
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

