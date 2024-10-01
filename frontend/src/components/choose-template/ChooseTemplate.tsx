'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Search, ArrowUpDown, Plus } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Course } from '@/types'
import { getToken } from '@/services/authService'
import {getCourses} from "@/services/courseService";


const courseTypes = [
    'Graduate Certificate',
    'Graduate Diploma',
    "Master's (Coursework)",
    "Master's Extended",
    "Master's Research",
    'Doctoral Degree',
    "Professional Doctorate/Master's Coursework",
]

{/* Manual filter */}

const filters = {
    postgraduate: [
        "Master's (Coursework)",
        "Master's Extended",
        "Master's Research",
    ],
    undergraduate: ['Graduate Certificate', 'Graduate Diploma'],
    higherdegree: ['Doctoral Degree', "Professional Doctorate/Master's Coursework"],
}
interface Course {
    code: string;
    type: string;
}

const staticCourses: Course[] = [
    { code:'1',type: "Master's (Coursework)"},
    { code:'2',type: "Master's Extended" },
    { code:'3',type: "Master's Research" },
    { code:'4',type: 'Graduate Certificate' },
    { code:'5',type: 'Graduate Diploma'},
    { code:'6',type: 'Doctoral Degree' },
    { code:'7',type: "Professional Doctorate/Master's Coursework"},
    ];

/* read from database in next stage */
const ChooseTemplate: React.FC = () => {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [courses, setCourses] = useState<Course[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [filterKey, setFilterKey] = useState<'postgraduate' | 'undergraduate' | 'higherdegree' | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [token, setToken] = useState<string | null>(null)

    const router = useRouter()

    useEffect(() => {
        const storedToken = getToken()
        setToken(storedToken)
    }, [])

    useEffect(() => {
        const fetchCourses = async () => {
            if (!token) return
            try {
                const fetchedCourses = await getCourses(token)
                setCourses(fetchedCourses)
            } catch (error) {
                console.error('Error fetching courses:', error)
            }
        }

        fetchCourses()
    }, [token])

    {/* This is static controller. In this stage, we only open Master's coursework rule as MVP.
    It will read from database by course type in the future if we create a new dimension */}
    const filteredAndSortedCourses = staticCourses
        .filter(
            (course) =>
                (!selectedType || course.type === selectedType) &&
                (!filterKey || filters[filterKey].includes(course.type)) &&
                course.type.toLowerCase().includes(searchTerm.toLowerCase())
        )

    const handleEdit = (course: Course) => {
        if (course.type === "Master's (Coursework)") {
            router.push(`/manage-template?code=${course.code}`);
        } else {
            setSelectedCourse(course);
            setDialogOpen(true);
        }
    };

    return (
        <div className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                <h1 className="mb-6 text-3xl font-bold">Choose a Template</h1>

                {/* Sidebar */}
                <div className="flex mb-8">
                    <div className="w-1/4 pr-6">
                        <Card className="p-4 shadow-md">
                            <div className="mb-4">
                                <Button
                                    onClick={() => setFilterKey('postgraduate')}
                                    variant="outline"
                                    className={`w-full mb-2 ${filterKey === 'postgraduate' ? 'bg-blue-200' : ''}`}>
                                    Postgraduate
                                </Button>
                                <Button
                                    onClick={() => setFilterKey('undergraduate')}
                                    variant="outline"
                                    className={`w-full mb-2 ${filterKey === 'undergraduate' ? 'bg-blue-200' : ''}`}>
                                    Undergraduate
                                </Button>
                                <Button
                                    onClick={() => setFilterKey('higherdegree')}
                                    variant="outline"
                                    className={`w-full ${filterKey === 'higherdegree' ? 'bg-blue-200' : ''}`}>
                                    Higher Degree
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="w-3/4">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    placeholder="Search templates..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-[300px] pl-8"
                                />
                            </div>

                            <Select value={selectedType ?? undefined} onValueChange={setSelectedType}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by Type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {courseTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="oldest">Oldest</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                onClick={() => {
                                    setFilterKey(null);
                                    setSelectedType(null);
                                    setSearchTerm('');
                                }}
                                variant="secondary"
                            >Clear
                            </Button>
                        </div>

                        <Card className="shadow-md">
                            <div className="rounded-lg border border-gray-200">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[200px] bg-blue-100">Course Type</TableHead>
                                            <TableHead className="w-[100px] bg-blue-100">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAndSortedCourses.map((course) => (
                                            <TableRow key={course.type}>
                                                <TableCell className="font-medium">{course.type}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="transition-transform hover:bg-indigo-100 active:scale-95 active:bg-indigo-200"
                                                        onClick={() => handleEdit(course)}
                                                    >
                                                        Edit
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Dialog for other course types*/}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Oops :( </DialogTitle>
                        </DialogHeader>
                        <p>No data available for {selectedCourse?.type}.</p>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default ChooseTemplate;