import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, Plus, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UserManagementPage() {
  const users = [
    {
      id: 1,
      name: "Anjali Patel",
      email: "anjali@example.com",
      phone: "+91 98765 43210",
      location: "Delhi",
      status: "active",
      joinDate: "2023-01-15",
      bookings: 5,
      totalSpent: "₹45,000",
    },
    {
      id: 2,
      name: "Ritu Sharma",
      email: "ritu@example.com",
      phone: "+91 87654 32109",
      location: "Mumbai",
      status: "active",
      joinDate: "2023-02-20",
      bookings: 3,
      totalSpent: "₹28,000",
    },
    {
      id: 3,
      name: "Kavita Singh",
      email: "kavita@example.com",
      phone: "+91 76543 21098",
      location: "Bangalore",
      status: "inactive",
      joinDate: "2023-03-10",
      bookings: 1,
      totalSpent: "₹12,000",
    },
    {
      id: 4,
      name: "Pooja Verma",
      email: "pooja@example.com",
      phone: "+91 65432 10987",
      location: "Hyderabad",
      status: "active",
      joinDate: "2023-04-05",
      bookings: 7,
      totalSpent: "₹62,000",
    },
    {
      id: 5,
      name: "Neha Gupta",
      email: "neha@example.com",
      phone: "+91 54321 09876",
      location: "Chennai",
      status: "active",
      joinDate: "2023-05-12",
      bookings: 2,
      totalSpent: "₹18,000",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage customer accounts and user data</p>
        </div>
        <Button className="bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] hover:from-[#FF5A8C] hover:to-[#FF4979] shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>User Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Users</p>
              <p className="text-2xl font-bold">1,245</p>
              <p className="text-xs text-gray-500">+45 this month</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Active Users</p>
              <p className="text-2xl font-bold">1,156</p>
              <p className="text-xs text-gray-500">92.8% of total</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">New This Month</p>
              <p className="text-2xl font-bold">45</p>
              <p className="text-xs text-gray-500">+12% from last month</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Total Bookings</p>
              <p className="text-2xl font-bold">3,456</p>
              <p className="text-xs text-gray-500">2.8 avg per user</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>User List</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search users..." className="pl-8 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                          <AvatarFallback className="bg-gradient-to-br from-[#FF6B9D] to-[#FF5A8C] text-white">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{user.location}</TableCell>
                    <TableCell>
                      <Badge
                        className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{user.joinDate}</TableCell>
                    <TableCell className="text-center">{user.bookings}</TableCell>
                    <TableCell className="font-medium">{user.totalSpent}</TableCell>
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
                          <DropdownMenuItem>View Bookings</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
                            {user.status === "active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
