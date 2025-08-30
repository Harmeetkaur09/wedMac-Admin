import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CreditCard, DollarSign, Download, Users, UserPlus, Calendar, Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business today.</p>
        </div>
      
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Revenue",
            value: "₹4,58,750",
            change: "+20.1%",
            changeType: "positive",
            icon: <DollarSign className="h-5 w-5" />,
            color: "from-green-500 to-emerald-600",
            progress: 75,
          },
          {
            title: "Active Artists",
            value: "2,350",
            change: "+180 new",
            changeType: "positive",
            icon: <Users className="h-5 w-5" />,
            color: "from-blue-500 to-cyan-600",
            progress: 65,
          },
          {
            title: "New Leads",
            value: "12,234",
            change: "+19%",
            changeType: "positive",
            icon: <UserPlus className="h-5 w-5" />,
            color: "from-purple-500 to-violet-600",
            progress: 45,
          },
          {
            title: "Active Subscriptions",
            value: "573",
            change: "-2%",
            changeType: "negative",
            icon: <CreditCard className="h-5 w-5" />,
            color: "from-orange-500 to-red-600",
            progress: 35,
          },
        ].map((metric, index) => (
          <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                <div
                  className={`p-2 rounded-lg bg-gradient-to-r ${metric.color} text-white group-hover:scale-110 transition-transform duration-300`}
                >
                  {metric.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm font-medium ${
                    metric.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.change}
                </span>
                <span className="text-sm text-gray-500">from last month</span>
              </div>
              <Progress value={metric.progress} className="h-2 mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-[#FF6B9D]" />
              <span>Revenue Overview</span>
            </CardTitle>
            <CardDescription>Monthly revenue trends for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-200">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Revenue Chart</p>
                <p className="text-sm text-gray-400">Chart visualization will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-[#FF6B9D]" />
              <span>Recent Transactions</span>
            </CardTitle>
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
                  time: "2 hours ago",
                },
                {
                  name: "Priya Sharma",
                  email: "priya@example.com",
                  amount: "₹8,500",
                  status: "processing",
                  time: "4 hours ago",
                },
                {
                  name: "Rahul Verma",
                  email: "rahul@example.com",
                  amount: "₹15,000",
                  status: "completed",
                  time: "6 hours ago",
                },
                {
                  name: "Neha Singh",
                  email: "neha@example.com",
                  amount: "₹9,200",
                  status: "failed",
                  time: "8 hours ago",
                },
              ].map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                      <AvatarFallback className="bg-gradient-to-br from-[#FF6B9D] to-[#FF5A8C] text-white">
                        {transaction.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.name}</p>
                      <p className="text-xs text-gray-500">{transaction.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{transaction.amount}</p>
                    <Badge
                      variant="outline"
                      className={
                        transaction.status === "completed"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : transaction.status === "processing"
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-red-200 bg-red-50 text-red-700"
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

      {/* Recent Activity */}
   
    </div>
  )
}
