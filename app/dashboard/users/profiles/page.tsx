import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, Edit, MoreHorizontal, Star, Calendar, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UserProfilesPage() {
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
      preferences: ["Bridal Makeup", "Traditional Look"],
      lastBooking: "2023-06-01",
      rating: 4.8,
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
      preferences: ["Party Makeup", "Glamorous Look"],
      lastBooking: "2023-05-15",
      rating: 4.6,
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
      preferences: ["Natural Look", "Minimal Makeup"],
      lastBooking: "2023-03-25",
      rating: 4.2,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Profiles</h1>
          <p className="text-gray-600 mt-1">View and manage detailed user profiles</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search profiles..." className="pl-8 w-64" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Profiles</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="vip">VIP Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-6">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={`/placeholder.svg?height=96&width=96`} />
                      <AvatarFallback className="bg-gradient-to-br from-[#FF6B9D] to-[#FF5A8C] text-white text-2xl">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="ml-1 font-medium">{user.rating}</span>
                      </div>
                      <p className="text-sm text-gray-500">{user.bookings} bookings</p>
                    </div>
                    <Badge
                      className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {user.status}
                    </Badge>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{user.name}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <MapPin className="h-4 w-4" />
                          <span>{user.location}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 mt-1">
                          <span>{user.email}</span>
                          <span>{user.phone}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Full Profile</DropdownMenuItem>
                            <DropdownMenuItem>View Booking History</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Send Message</DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                              {user.status === "active" ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Preferences</h4>
                        <div className="flex flex-wrap gap-2">
                          {user.preferences.map((preference, index) => (
                            <Badge key={index} variant="outline" className="bg-gray-50">
                              {preference}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Account Details</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            <span>Joined: {user.joinDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            <span>Last Booking: {user.lastBooking}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <div>
                        <p className="text-sm font-medium">Total Spent</p>
                        <p className="text-lg font-bold text-[#FF6B9D]">{user.totalSpent}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Bookings
                        </Button>
                        <Button className="bg-[#FF6B9D] hover:bg-[#FF5A8C]" size="sm">
                          Send Offer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="active">
          <Card>
            <CardContent className="p-6">
              <p>Active user profiles will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inactive">
          <Card>
            <CardContent className="p-6">
              <p>Inactive user profiles will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vip">
          <Card>
            <CardContent className="p-6">
              <p>VIP customer profiles will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
