"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import Logo from "./logo"

type Course = {
  name: string
  credits: number
  oldGrade: string
  newGrade: string
}

const gradePoints: { [key: string]: number } = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.67,
  "B+": 3.33,
  B: 3.0,
  "B-": 2.67,
  "C+": 2.33,
  C: 2.0,
  "C-": 1.67,
  "D+": 1.33,
  D: 1.0,
  F: 0.0,
}

export default function GpaImprovementCalculator() {
  const [currentCGPA, setCurrentCGPA] = useState<number | "">("")
  const [totalCredits, setTotalCredits] = useState<number | "">("")
  const [courses, setCourses] = useState<Course[]>([])
  const [newCourse, setNewCourse] = useState<Course>({ name: "", credits: 3, oldGrade: "", newGrade: "A+" })

  const addCourse = () => {
    if (newCourse.name && newCourse.credits > 0 && newCourse.oldGrade) {
      setCourses([...courses, newCourse])
      setNewCourse({ name: "", credits: 3, oldGrade: "", newGrade: "A+" })
    }
  }

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index))
  }

  const updateCourse = (index: number, field: keyof Course, value: string | number) => {
    const updatedCourses = [...courses]
    updatedCourses[index] = { ...updatedCourses[index], [field]: value }
    setCourses(updatedCourses)
  }

  const calculateNewCGPA = (course: Course) => {
    if (typeof currentCGPA !== "number" || typeof totalCredits !== "number") return currentCGPA

    const totalPoints = currentCGPA * totalCredits
    const oldPoints = gradePoints[course.oldGrade] * course.credits
    const newPoints = gradePoints[course.newGrade] * course.credits
    return (totalPoints - oldPoints + newPoints) / totalCredits
  }

  const calculateFinalCGPA = () => {
    if (typeof currentCGPA !== "number" || typeof totalCredits !== "number") return currentCGPA

    let totalPoints = currentCGPA * totalCredits
    courses.forEach((course) => {
      totalPoints -= gradePoints[course.oldGrade] * course.credits
      totalPoints += gradePoints[course.newGrade] * course.credits
    })
    return totalPoints / totalCredits
  }

  const chartData = courses.map((course) => ({
    name: course.name,
    "Current CGPA": Number(currentCGPA),
    "New CGPA": calculateNewCGPA(course),
    "GPA Improvement": calculateNewCGPA(course) - Number(currentCGPA),
  }))

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <Logo className="w-16 h-16 mx-auto mb-4" />
      <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft className="mr-2" /> Back to GPA Calculator
      </Link>
      <h1 className="text-3xl font-bold text-blue-600 mb-6">GPA Improvement Calculator</h1>
      <p className="text-gray-600 mb-6">
        Use this calculator to see how improving your grades in specific courses could affect your overall CGPA.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="currentCGPA" className="block text-sm font-medium text-gray-700 mb-1">
            Current CGPA
          </label>
          <Input
            id="currentCGPA"
            type="number"
            placeholder="Enter your current CGPA"
            value={currentCGPA}
            onChange={(e) => setCurrentCGPA(e.target.value ? Number(e.target.value) : "")}
            min={0}
            max={4}
            step={0.01}
          />
        </div>
        <div>
          <label htmlFor="totalCredits" className="block text-sm font-medium text-gray-700 mb-1">
            Total Credits Completed
          </label>
          <Input
            id="totalCredits"
            type="number"
            placeholder="Enter total credits completed"
            value={totalCredits}
            onChange={(e) => setTotalCredits(e.target.value ? Number(e.target.value) : "")}
            min={0}
          />
        </div>
      </div>
      <div className="space-y-4 mb-6">
        <h2 className="text-xl font-semibold text-blue-600">Add Courses for Improvement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Course Name"
            value={newCourse.name}
            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Credits"
            value={newCourse.credits}
            onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
            min={1}
          />
          <Select value={newCourse.oldGrade} onValueChange={(value) => setNewCourse({ ...newCourse, oldGrade: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Current Grade" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(gradePoints).map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={newCourse.newGrade} onValueChange={(value) => setNewCourse({ ...newCourse, newGrade: value })}>
            <SelectTrigger>
              <SelectValue placeholder="New Grade" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(gradePoints).map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={addCourse}>Add Course</Button>
      </div>
      {courses.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-blue-600">Added Courses</h3>
          {courses.map((course, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center bg-gray-100 p-2 rounded">
              <Input
                value={course.name}
                onChange={(e) => updateCourse(index, "name", e.target.value)}
                placeholder="Course Name"
              />
              <Input
                type="number"
                value={course.credits}
                onChange={(e) => updateCourse(index, "credits", Number(e.target.value))}
                min={1}
                placeholder="Credits"
              />
              <Select value={course.oldGrade} onValueChange={(value) => updateCourse(index, "oldGrade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Old Grade" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(gradePoints).map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={course.newGrade} onValueChange={(value) => updateCourse(index, "newGrade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="New Grade" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(gradePoints).map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" onClick={() => removeCourse(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      {courses.length > 0 && (
        <div className="space-y-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-600">GPA Impact</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[Math.floor(Number(currentCGPA) * 10) / 10, 4.0]} />
              <Tooltip
                formatter={(value, name, props) => {
                  if (name === "GPA Improvement") {
                    return [`+${Number(value).toFixed(3)}`, "GPA Improvement"]
                  }
                  return [Number(value).toFixed(3), name]
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Current CGPA" stroke="#1E40AF" strokeWidth={2} />
              <Line type="monotone" dataKey="New CGPA" stroke="#047857" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Final CGPA After Improvements</h3>
            <p className="text-2xl font-bold text-blue-800">
              {typeof calculateFinalCGPA() === "number" ? calculateFinalCGPA().toFixed(3) : "N/A"}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Total GPA Improvement:{" "}
              {typeof calculateFinalCGPA() === "number" && typeof currentCGPA === "number"
                ? (calculateFinalCGPA() - currentCGPA).toFixed(3)
                : "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

