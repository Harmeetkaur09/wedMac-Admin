import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CreditCard, DollarSign, Download, Users, UserPlus, Calendar, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Reports
          </Button>
          <Button className="bg-[#FF6B9D] hover:bg-[#FF5A8C]">
            <Activity className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+20.1%</span> from last month
                </p>
                <Progress value={75} className="h-1 mt-3" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Artists</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+180</span> new this month
                </p>
                <Progress value={65} className="h-1 mt-3" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+19%</span> from last month
                </p>
                <Progress value={45} className="h-1 mt-3" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500">-2%</span> from last month
                </p>
                <Progress value={35} className="h-1 mt-3" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-gray-500">Revenue Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest payment activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Avneet Kaur",
                      email: "avneet@example.com",
                      amount: "₹12,000",
                      status: "completed",
                    },
                    {
                      name: "Priya Sharma",
                      email: "priya@example.com",
                      amount: "₹8,500",
                      status: "processing",
                    },
                    {
                      name: "Rahul Verma",
                      email: "rahul@example.com",
                      amount: "₹15,000",
                      status: "completed",
                    },
                    {
                      name: "Neha Singh",
                      email: "neha@example.com",
                      amount: "₹9,200",
                      status: "failed",
                    },
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-9 w-9 mr-3">
                          <AvatarImage src={`/placeholder.svg?height=36&width=36`} />
                          <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{transaction.name}</p>
                          <p className="text-xs text-gray-500">{transaction.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{transaction.amount}</p>
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "success"
                              : transaction.status === "processing"
                                ? "outline"
                                : "destructive"
                          }
                          className={
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : transaction.status === "processing"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      icon: <UserPlus className="h-4 w-4 text-green-500" />,
                      title: "New artist registered",
                      description: "Meera Joshi completed registration",
                      time: "2 hours ago",
                    },
                    {
                      icon: <Star className="h-4 w-4 text-yellow-500" />,
                      title: "New review submitted",
                      description: "Customer left a 5-star review for Avneet",
                      time: "5 hours ago",
                    },
                    {
                      icon: <Calendar className="h-4 w-4 text-blue-500" />,
                      title: "Booking confirmed",
                      description: "Wedding makeup booking for June 15",
                      time: "Yesterday",
                    },
                    {
                      icon: <CreditCard className="h-4 w-4 text-purple-500" />,
                      title: "Subscription renewed",
                      description: "Priya renewed her premium plan",
                      time: "2 days ago",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Artists</CardTitle>
                <CardDescription>Best performing makeup artists</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Avneet Kaur", bookings: 45, rating: 4.9 },
                    { name: "Priya Sharma", bookings: 38, rating: 4.8 },
                    { name: "Meera Joshi", bookings: 36, rating: 4.7 },
                    { name: "Neha Singh", bookings: 32, rating: 4.9 },
                  ].map((artist, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                          <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{artist.name}</p>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            <p className="text-xs text-gray-500">{artist.rating}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{artist.bookings}</p>
                        <p className="text-xs text-gray-500">bookings</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
                <CardDescription>Next scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      client: "Anjali Patel",
                      artist: "Avneet Kaur",
                      service: "Bridal Makeup",
                      date: "June 15, 2023",
                      time: "10:00 AM",
                    },
                    {
                      client: "Ritu Sharma",
                      artist: "Priya Sharma",
                      service: "Party Makeup",
                      date: "June 16, 2023",
                      time: "4:00 PM",
                    },
                    {
                      client: "Kavita Singh",
                      artist: "Meera Joshi",
                      service: "Engagement Makeup",
                      date: "June 18, 2023",
                      time: "11:30 AM",
                    },
                    {
                      client: "Pooja Verma",
                      artist: "Neha Singh",
                      service: "HD Makeup",
                      date: "June 20, 2023",
                      time: "2:00 PM",
                    },
                  ].map((booking, index) => (
                    <div key={index} className="border-l-4 border-[#FF6B9D] pl-4 py-2">
                      <p className="text-sm font-medium">{booking.client}</p>
                      <p className="text-xs text-gray-500">
                        {booking.service} with {booking.artist}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {booking.date} at {booking.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
