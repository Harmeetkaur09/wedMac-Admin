import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, TrendingUp, DollarSign, CreditCard, PieChart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FinancialAnalyticsPage() {
  const financialMetrics = [
    {
      title: "Total Revenue",
      value: "₹18,45,000",
      change: "+25%",
      trend: "up",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Commission Earned",
      value: "₹1,84,500",
      change: "+22%",
      trend: "up",
      icon: CreditCard,
      color: "blue",
    },
    {
      title: "Average Booking Value",
      value: "₹14,800",
      change: "+8%",
      trend: "up",
      icon: TrendingUp,
      color: "purple",
    },
    {
      title: "Monthly Growth",
      value: "18.5%",
      change: "+3.2%",
      trend: "up",
      icon: PieChart,
      color: "pink",
    },
  ]

  const revenueByService = [
    { service: "Bridal Makeup", revenue: "₹8,45,000", percentage: 45.8, bookings: 456 },
    { service: "Party Makeup", revenue: "₹4,12,000", percentage: 22.3, bookings: 342 },
    { service: "HD Makeup", revenue: "₹3,51,000", percentage: 19.0, bookings: 234 },
    { service: "Engagement Makeup", revenue: "₹1,64,000", percentage: 8.9, bookings: 156 },
    { service: "Airbrush Makeup", revenue: "₹1,26,000", percentage: 6.8, bookings: 57 },
  ]

  const monthlyRevenue = [
    { month: "June 2023", revenue: "₹18,45,000", growth: "+25%" },
    { month: "May 2023", revenue: "₹14,76,000", growth: "+18%" },
    { month: "April 2023", revenue: "₹12,51,000", growth: "+12%" },
    { month: "March 2023", revenue: "₹11,17,000", growth: "+8%" },
    { month: "February 2023", revenue: "₹10,34,000", growth: "+15%" },
    { month: "January 2023", revenue: "₹8,99,000", growth: "+22%" },
  ]

  const paymentMethods = [
    { method: "UPI", amount: "₹8,45,000", percentage: 45.8, transactions: 567 },
    { method: "Credit Card", amount: "₹4,61,000", percentage: 25.0, transactions: 234 },
    { method: "Net Banking", amount: "₹3,32,000", percentage: 18.0, transactions: 189 },
    { method: "Wallet", amount: "₹1,38,000", percentage: 7.5, transactions: 98 },
    { method: "Cash", amount: "₹69,000", percentage: 3.7, transactions: 45 },
  ]

  const topArtists = [
    { name: "Avneet Kaur", revenue: "₹4,56,000", bookings: 89, commission: "₹45,600" },
    { name: "Priya Sharma", revenue: "₹3,89,000", bookings: 76, commission: "₹38,900" },
    { name: "Meera Joshi", revenue: "₹3,12,000", bookings: 65, commission: "₹31,200" },
    { name: "Neha Singh", revenue: "₹2,78,000", bookings: 58, commission: "₹27,800" },
    { name: "Anjali Patel", revenue: "₹2,34,000", bookings: 52, commission: "₹23,400" },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Analytics</h1>
          <p className="text-gray-600 mt-1">Track revenue, payments, and financial performance</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="last30">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="last7">Last 7 days</SelectItem>
              <SelectItem value="last30">Last 30 days</SelectItem>
              <SelectItem value="last90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{metric.title}</p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">{metric.change}</span>
                    </div>
                  </div>
                  <IconComponent className={`h-8 w-8 text-${metric.color}-500`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
          <TabsTrigger value="trends">Revenue Trends</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="artists">Top Performers</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Service Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueByService.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{service.service}</h3>
                      <p className="text-sm text-gray-500">{service.bookings} bookings</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] h-3 rounded-full"
                            style={{ width: `${service.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{service.percentage}%</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-[#FF6B9D]">{service.revenue}</p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyRevenue.map((month, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{month.month}</h3>
                      <p className="text-2xl font-bold text-[#FF6B9D]">{month.revenue}</p>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                      <Badge className="bg-green-100 text-green-800">{month.growth}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{payment.method}</h3>
                      <p className="text-sm text-gray-500">{payment.transactions} transactions</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] h-3 rounded-full"
                            style={{ width: `${payment.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{payment.percentage}%</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-[#FF6B9D]">{payment.amount}</p>
                        <p className="text-xs text-gray-500">Total Amount</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="artists">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Artists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topArtists.map((artist, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B9D] to-[#FF5A8C] rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{artist.name}</h3>
                        <p className="text-sm text-gray-500">{artist.bookings} bookings completed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="font-bold text-lg text-[#FF6B9D]">{artist.revenue}</p>
                        <p className="text-xs text-gray-500">Total Revenue</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-lg text-green-600">{artist.commission}</p>
                        <p className="text-xs text-gray-500">Commission</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
