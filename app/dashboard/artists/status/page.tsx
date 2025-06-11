import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StatusManagementPage() {
  const artists = [
    {
      id: 1,
      name: "Avneet Kaur",
      email: "avneet@example.com",
      location: "Delhi",
      specialty: "Bridal Makeup",
      status: "active",
      lastUpdated: "2023-06-10",
      reason: null,
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@example.com",
      location: "Mumbai",
      specialty: "HD Makeup",
      status: "active",
      lastUpdated: "2023-06-09",
      reason: null,
    },
    {
      id: 3,
      name: "Meera Joshi",
      email: "meera@example.com",
      location: "Bangalore",
      specialty: "Party Makeup",
      status: "pending",
      lastUpdated: "2023-06-08",
      reason: "Awaiting document verification",
    },
    {
      id: 4,
      name: "Neha Singh",
      email: "neha@example.com",
      location: "Hyderabad",
      specialty: "Airbrush Makeup",
      status: "active",
      lastUpdated: "2023-06-07",
      reason: null,
    },
    {
      id: 5,
      name: "Anjali Patel",
      email: "anjali@example.com",
      location: "Ahmedabad",
      specialty: "Bridal Makeup",
      status: "inactive",
      lastUpdated: "2023-06-06",
      reason: "Account suspended due to policy violation",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Status Management</h1>
          <p className="text-gray-600 mt-1">Manage and update artist account statuses</p>
        </div>
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

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Active</p>
              <p className="text-2xl font-bold">124</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-2xl font-bold">18</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Inactive</p>
              <p className="text-2xl font-bold">7</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Suspended</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Artists</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Artist</th>
                      <th className="text-left py-3 px-4">Location</th>
                      <th className="text-left py-3 px-4">Specialty</th>
                      <th className="text-left py-3 px-4">Current Status</th>
                      <th className="text-left py-3 px-4">Last Updated</th>
                      <th className="text-left py-3 px-4">Reason</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artists.map((artist) => (
                      <tr key={artist.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                              <AvatarFallback className="bg-gradient-to-br from-[#FF6B9D] to-[#FF5A8C] text-white">
                                {artist.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{artist.name}</p>
                              <p className="text-xs text-gray-500">{artist.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{artist.location}</td>
                        <td className="py-3 px-4">{artist.specialty}</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              artist.status === "active"
                                ? "bg-green-100 text-green-800"
                                : artist.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {artist.status === "active" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : artist.status === "pending" ? (
                              <Clock className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {artist.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">{artist.lastUpdated}</td>
                        <td className="py-3 px-4 text-sm">
                          {artist.reason || <span className="text-gray-400">-</span>}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Select>
                              <SelectTrigger className="w-[140px] h-8 text-xs">
                                <SelectValue placeholder="Change Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Set Active</SelectItem>
                                <SelectItem value="pending">Set Pending</SelectItem>
                                <SelectItem value="inactive">Set Inactive</SelectItem>
                                <SelectItem value="suspended">Suspend</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button size="sm" variant="outline">
                              <AlertCircle className="h-3.5 w-3.5 mr-1" />
                              Details
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active">
          <Card>
            <CardContent className="p-6">
              <p>Active artists will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card>
            <CardContent className="p-6">
              <p>Pending artists will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inactive">
          <Card>
            <CardContent className="p-6">
              <p>Inactive artists will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
