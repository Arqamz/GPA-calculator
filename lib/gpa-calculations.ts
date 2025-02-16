import type { Semester } from "@/components/gpa-calculator"

const gradePoints: { [key: string]: number } = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.667,
  "B+": 3.333,
  B: 3.0,
  "B-": 2.667,
  "C+": 2.333,
  C: 2.0,
  "C-": 1.667,
  "D+": 1.33,
  D: 1.0,
  F: 0.0,
}

export function calculateSGPA(semester: Semester): number {
  const totalCredits = semester.subjects.reduce((sum, subject) => sum + subject.credits, 0)
  const totalGradePoints = semester.subjects.reduce(
    (sum, subject) => sum + gradePoints[subject.grade] * subject.credits,
    0,
  )
  return totalCredits > 0 ? totalGradePoints / totalCredits : 0
}

export function calculateCGPA(semesters: Semester[]): number {
  const totalCredits = semesters.flatMap((s) => s.subjects).reduce((sum, subject) => sum + subject.credits, 0)
  const totalGradePoints = semesters
    .flatMap((s) => s.subjects)
    .reduce((sum, subject) => sum + gradePoints[subject.grade] * subject.credits, 0)
  return totalCredits > 0 ? totalGradePoints / totalCredits : 0
}

