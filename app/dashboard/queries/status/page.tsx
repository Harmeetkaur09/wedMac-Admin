import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserStatusPage() {
  const users = [
    {
      id: 1,
      name: "Anjali Patel",
      email: "anjali@example.com",
      location: "Delhi",
      status: "active",
      lastActivity: "2023-06-10",
      reason: null,
    },
    {
      id: 2,
      name: "Ritu Sharma",
      email: "ritu@example.com",
      location: "Mumbai",
      status: "active",
      lastActivity: "2023-06-09",
      reason: null,
    },
    {
      id: 3,
      name: "Kavita Singh",
      email: "kavita@example.com",
      location: "Bangalore",
      status: "inactive",
      lastActivity: "2023-03-25",
      reason: "Account deactivated by user request",
    },
    {
      id: 4,
      name: "Pooja Verma",
      email: "pooja@example.com",
      location: "Hyderabad",
      status: "suspended",
      lastActivity: "2023-06-05",
      reason: "Multiple payment failures",
    },
    {
      id: 5,
      name: "Neha Gupta",
      email: "neha@example.com",
      location: "Chennai",
      status: "active",
      lastActivity: "2023-06-08",
      reason: null,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Status Management</h1>
          <p className="text-gray-600 mt-1">Manage and update user account statuses</p>
        </div>
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

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Active</p>
              <p className="text-2xl font-bold">1,156</p>
              <p className="text-xs text-gray-500">92.8% of total</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Inactive</p>
              <p className="text-2xl font-bold">67</p>
              <p className="text-xs text-gray-500">5.4% of total</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Suspended</p>
              <p className="text-2xl font-bold">22</p>
              <p className="text-xs text-gray-500">1.8% of total</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Pending Review</p>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-gray-500">0.6% of total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Current Status</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Actions</TableHead>
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
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.location}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : user.status === "inactive"
                                  ? "bg-red-100 text-red-800"
                                  : user.status === "suspended"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-purple-100 text-purple-800"
                            }
                          >
                            {user.status === "active" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : user.status === "inactive" ? (
                              <XCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{user.lastActivity}</TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate">
                          {user.reason || <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select defaultValue={user.status}>
                              <SelectTrigger className="w-[120px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button size="sm" variant="outline">
                              <AlertCircle className="h-3.5 w-3.5 mr-1" />
                              Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active">
          <Card>
            <CardContent className="p-6">
              <p>Active users will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inactive">
          <Card>
            <CardContent className="p-6">
              <p>Inactive users will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="suspended">
          <Card>
            <CardContent className="p-6">
              <p>Suspended users will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
