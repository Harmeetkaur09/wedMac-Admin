import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Filter, MoreHorizontal, Plus, Search } from "lucide-react"

export default function ArtistManagement() {
  const artists = [
    {
      id: 1,
      name: "Avneet Kaur",
      email: "avneet@example.com",
      location: "Delhi",
      specialty: "Bridal Makeup",
      status: "active",
      rating: 4.9,
      bookings: 45,
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@example.com",
      location: "Mumbai",
      specialty: "HD Makeup",
      status: "active",
      rating: 4.8,
      bookings: 38,
    },
    {
      id: 3,
      name: "Meera Joshi",
      email: "meera@example.com",
      location: "Bangalore",
      specialty: "Party Makeup",
      status: "pending",
      rating: 4.7,
      bookings: 36,
    },
    {
      id: 4,
      name: "Neha Singh",
      email: "neha@example.com",
      location: "Hyderabad",
      specialty: "Airbrush Makeup",
      status: "active",
      rating: 4.9,
      bookings: 32,
    },
    {
      id: 5,
      name: "Anjali Patel",
      email: "anjali@example.com",
      location: "Ahmedabad",
      specialty: "Bridal Makeup",
      status: "inactive",
      rating: 4.5,
      bookings: 28,
    },
    {
      id: 6,
      name: "Kavita Verma",
      email: "kavita@example.com",
      location: "Pune",
      specialty: "HD Makeup",
      status: "pending",
      rating: 4.6,
      bookings: 25,
    },
    {
      id: 7,
      name: "Ritu Sharma",
      email: "ritu@example.com",
      location: "Chennai",
      specialty: "Party Makeup",
      status: "active",
      rating: 4.7,
      bookings: 30,
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Artist Management</h1>
    
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Artist Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Active Artists</p>
              <p className="text-2xl font-bold">124</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Pending Approval</p>
              <p className="text-2xl font-bold">18</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Inactive Artists</p>
              <p className="text-2xl font-bold">7</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Bookings</p>
              <p className="text-2xl font-bold">1,245</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Artist List</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search artists..." className="pl-8 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artist</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artists.map((artist) => (
                <TableRow key={artist.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                        <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{artist.name}</p>
                        <p className="text-xs text-gray-500">{artist.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{artist.location}</TableCell>
                  <TableCell>{artist.specialty}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        artist.status === "active" ? "success" : artist.status === "pending" ? "outline" : "destructive"
                      }
                      className={
                        artist.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : artist.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {artist.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      {artist.rating}
                    </div>
                  </TableCell>
                  <TableCell>{artist.bookings}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Change Status</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-[#FF6B9D] text-white hover:bg-[#FF5A8C]">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
