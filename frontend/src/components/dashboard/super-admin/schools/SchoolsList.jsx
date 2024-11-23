import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MoreHorizontal,
  PenSquare,
  Trash2,
  Image,
  School as SchoolIcon,
  Plus,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { schoolService } from "@/services/schoolService"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function SchoolsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  })
  const [sortConfig, setSortConfig] = useState({
    field: 'createdAt',
    direction: 'desc'
  })
  const [filterConfig, setFilterConfig] = useState({
    type: '',
    category: ''
  })

  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    fetchSchools()
  }, [pagination.page, pagination.limit, sortConfig, filterConfig])

  const fetchSchools = async () => {
    try {
      setLoading(true)
      const data = await schoolService.getSchools({
        page: pagination.page,
        limit: pagination.limit,
        sort: `${sortConfig.direction === 'desc' ? '-' : ''}${sortConfig.field}`,
        type: filterConfig.type,
        category: filterConfig.category,
      })
      setSchools(data.schools || [])
      setPagination(prev => ({
        ...prev,
        total: data.totalDocs || 0
      }))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch schools. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (schoolId) => {
    navigate(`/dashboard/superadmin/schools/edit/${schoolId}`)
  }

  const handleDelete = async (schoolId) => {
    if (window.confirm("Are you sure you want to delete this school?")) {
      try {
        await schoolService.deleteSchool(schoolId)
        toast({
          title: "Success",
          description: "School deleted successfully",
        })
        fetchSchools()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete school. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.location?.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.location?.region.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderSortIcon = (field) => {
    if (sortConfig.field !== field) return <ChevronDown className="ml-2 h-4 w-4" />
    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  const getSchoolTypeColor = (type) => {
    switch (type) {
      case 'Day': return 'bg-blue-100 text-blue-800'
      case 'Boarding': return 'bg-green-100 text-green-800'
      case 'Mixed': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSchoolCategoryColor = (category) => {
    switch (category) {
      case 'Government': return 'bg-yellow-100 text-yellow-800'
      case 'Private': return 'bg-pink-100 text-pink-800'
      case 'Religious': return 'bg-indigo-100 text-indigo-800'
      case 'International': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Schools</h2>
          <p className="text-muted-foreground">
            Manage and monitor all schools in the system
          </p>
        </div>
        <Button
          onClick={() => navigate("/dashboard/superadmin/schools/new")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add School
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={filterConfig.type}
            onValueChange={(value) => setFilterConfig(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Day">Day</SelectItem>
              <SelectItem value="Boarding">Boarding</SelectItem>
              <SelectItem value="Mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterConfig.category}
            onValueChange={(value) => setFilterConfig(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Government">Government</SelectItem>
              <SelectItem value="Private">Private</SelectItem>
              <SelectItem value="Religious">Religious</SelectItem>
              <SelectItem value="International">International</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select
          value={pagination.limit.toString()}
          onValueChange={(value) => setPagination(prev => ({ ...prev, page: 1, limit: parseInt(value) }))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="10 per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('name')}
                  className="flex items-center"
                >
                  School {renderSortIcon('name')}
                </Button>
              </TableHead>
              <TableHead>Type & Category</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('location.district')}
                  className="flex items-center"
                >
                  Location {renderSortIcon('location.district')}
                </Button>
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center"
                >
                  Added {renderSortIcon('createdAt')}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading schools...
                </TableCell>
              </TableRow>
            ) : filteredSchools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No schools found
                </TableCell>
              </TableRow>
            ) : (
              filteredSchools.map((school) => (
                <TableRow key={school._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={school.media?.logo} alt={school.name} />
                        <AvatarFallback>
                          <SchoolIcon className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{school.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {school._id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={getSchoolTypeColor(school.type)}>
                        {school.type}
                      </Badge>
                      <Badge className={getSchoolCategoryColor(school.category)}>
                        {school.category}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{school.location?.district}</div>
                      <div className="text-muted-foreground">{school.location?.region}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{school.contact?.phone}</div>
                      <div className="text-muted-foreground">{school.contact?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {school.createdAt && (
                      <div className="text-sm">
                        {format(new Date(school.createdAt), 'MMM d, yyyy')}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(school._id)}>
                          <PenSquare className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(school._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredSchools.length} of {pagination.total} schools
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page * pagination.limit >= pagination.total}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
