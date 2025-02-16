import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import type { Semester, Subject } from "./gpa-calculator"
import { Plus, Trash2 } from "lucide-react"

type TranscriptTableProps = {
  semester: Semester
  semesterIndex: number
  onSubjectChange: (semesterIndex: number, subjectIndex: number, field: keyof Subject, value: string | number) => void
  onAddSubject: (semesterIndex: number) => void
  onRemoveSubject: (semesterIndex: number, subjectIndex: number) => void
  sgpa: number
  cgpa: number
}

const gradeOptions = [
  { label: "A+", value: "A+" },
  { label: "A", value: "A" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B", value: "B" },
  { label: "B-", value: "B-" },
  { label: "C+", value: "C+" },
  { label: "C", value: "C" },
  { label: "C-", value: "C-" },
  { label: "D+", value: "D+" },
  { label: "D", value: "D" },
  { label: "F", value: "F" },
]

export default function TranscriptTable({
  semester,
  semesterIndex,
  onSubjectChange,
  onAddSubject,
  onRemoveSubject,
  sgpa,
  cgpa,
}: TranscriptTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-100 p-4">
        <h2 className="text-xl font-semibold text-blue-700">{semester.name}</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Subject</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead className="w-1/6"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {semester.subjects.map((subject, subjectIndex) => (
            <TableRow key={subjectIndex}>
              <TableCell>
                <Input
                  value={subject.name}
                  onChange={(e) => onSubjectChange(semesterIndex, subjectIndex, "name", e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={subject.credits}
                  onChange={(e) =>
                    onSubjectChange(semesterIndex, subjectIndex, "credits", Number.parseInt(e.target.value))
                  }
                  min={1}
                  max={6}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={subject.grade}
                  onValueChange={(value) => onSubjectChange(semesterIndex, subjectIndex, "grade", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => onRemoveSubject(semesterIndex, subjectIndex)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="bg-blue-50 p-4 flex justify-between items-center">
        <div>
          <span className="font-semibold text-blue-700 mr-4">SGPA: {sgpa.toFixed(2)}</span>
          <span className="font-semibold text-blue-700">CGPA: {cgpa.toFixed(2)}</span>
        </div>
        <Button onClick={() => onAddSubject(semesterIndex)}>
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>
    </div>
  )
}

