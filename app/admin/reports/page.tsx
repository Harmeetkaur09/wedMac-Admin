import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Calendar } from "lucide-react"

export default function ReportsAnalytics() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Select defaultValue="last30">
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">Last 7 days</SelectItem>
              <SelectItem value="last30">Last 30 days</SelectItem>
              <SelectItem value="last90">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      <Tabs defaultValue="traffic" className="mb-6">
        <TabsList>
          <TabsTrigger value="traffic">Website Traffic</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Metrics</TabsTrigger>
          <TabsTrigger value="leads">Lead Reports</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="traffic">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24,562</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+12.5%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">86,249</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+8.2%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3m 42s</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500">-1.3%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42.8%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">-3.1%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-gray-500">Traffic Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-gray-500">Traffic Sources Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Page</th>
                      <th className="text-left py-3 px-4">Views</th>
                      <th className="text-left py-3 px-4">Unique Visitors</th>
                      <th className="text-left py-3 px-4">Avg. Time on Page</th>
                      <th className="text-left py-3 px-4">Bounce Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        page: "Homepage",
                        views: 12458,
                        visitors: 8965,
                        time: "2m 34s",
                        bounce: "38.2%",
                      },
                      {
                        page: "Makeup Artists",
                        views: 8752,
                        visitors: 6234,
                        time: "3m 12s",
                        bounce: "42.5%",
                      },
                      {
                        page: "Bridal Makeup",
                        views: 6543,
                        visitors: 4321,
                        time: "4m 05s",
                        bounce: "35.8%",
                      },
                      {
                        page: "Contact Us",
                        views: 4321,
                        visitors: 3456,
                        time: "1m 48s",
                        bounce: "52.3%",
                      },
                      {
                        page: "Blog",
                        views: 3987,
                        visitors: 2876,
                        time: "3m 56s",
                        bounce: "40.1%",
                      },
                    ].map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{item.page}</td>
                        <td className="py-3 px-4">{item.views.toLocaleString()}</td>
                        <td className="py-3 px-4">{item.visitors.toLocaleString()}</td>
                        <td className="py-3 px-4">{item.time}</td>
                        <td className="py-3 px-4">{item.bounce}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="engagement">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18,245</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+15.3%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Booking Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,432</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+8.7%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Reviews Submitted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">856</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+5.2%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.7</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+0.2</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-gray-500">Engagement Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Activity by Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-gray-500">Activity Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Artists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Artist</th>
                      <th className="text-left py-3 px-4">Profile Views</th>
                      <th className="text-left py-3 px-4">Bookings</th>
                      <th className="text-left py-3 px-4">Reviews</th>
                      <th className="text-left py-3 px-4">Avg. Rating</th>
                      <th className="text-left py-3 px-4">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        artist: "Avneet Kaur",
                        views: 2458,
                        bookings: 45,
                        reviews: 38,
                        rating: 4.9,
                        conversion: "1.83%",
                      },
                      {
                        artist: "Priya Sharma",
                        views: 1987,
                        bookings: 38,
                        reviews: 32,
                        rating: 4.8,
                        conversion: "1.91%",
                      },
                      {
                        artist: "Meera Joshi",
                        views: 1765,
                        bookings: 36,
                        reviews: 30,
                        rating: 4.7,
                        conversion: "2.04%",
                      },
                      {
                        artist: "Neha Singh",
                        views: 1654,
                        bookings: 32,
                        reviews: 28,
                        rating: 4.9,
                        conversion: "1.93%",
                      },
                      {
                        artist: "Anjali Patel",
                        views: 1432,
                        bookings: 28,
                        reviews: 24,
                        rating: 4.5,
                        conversion: "1.96%",
                      },
                    ].map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{item.artist}</td>
                        <td className="py-3 px-4">{item.views.toLocaleString()}</td>
                        <td className="py-3 px-4">{item.bookings}</td>
                        <td className="py-3 px-4">{item.reviews}</td>
                        <td className="py-3 px-4">{item.rating}</td>
                        <td className="py-3 px-4">{item.conversion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="leads">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,845</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+18.3%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+12.7%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.4%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+1.2%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2h</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500">+0.5h</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Generation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-gray-500">Lead Trends Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-gray-500">Lead Sources Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lead Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Count</th>
                      <th className="text-left py-3 px-4">Percentage</th>
                      <th className="text-left py-3 px-4">Avg. Time in Stage</th>
                      <th className="text-left py-3 px-4">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        status: "New",
                        count: 845,
                        percentage: "29.7%",
                        time: "1.2 days",
                        conversion: "65.3%",
                      },
                      {
                        status: "Contacted",
                        count: 652,
                        percentage: "22.9%",
                        time: "2.5 days",
                        conversion: "48.2%",
                      },
                      {
                        status: "Qualified",
                        count: 458,
                        percentage: "16.1%",
                        time: "3.8 days",
                        conversion: "72.5%",
                      },
                      {
                        status: "Unqualified",
                        count: 324,
                        percentage: "11.4%",
                        time: "1.5 days",
                        conversion: "0%",
                      },
                      {
                        status: "Converted",
                        count: 566,
                        percentage: "19.9%",
                        time: "5.2 days",
                        conversion: "100%",
                      },
                    ].map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{item.status}</td>
                        <td className="py-3 px-4">{item.count.toLocaleString()}</td>
                        <td className="py-3 px-4">{item.percentage}</td>
                        <td className="py-3 px-4">{item.time}</td>
                        <td className="py-3 px-4">{item.conversion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="financial">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹4,58,750</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+22.3%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Booking Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹3,24,500</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+18.7%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Subscription Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹1,34,250</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+15.2%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹8,450</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+5.8%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-gray-500">Revenue Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-gray-500">Service Revenue Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Month</th>
                      <th className="text-left py-3 px-4">Booking Revenue</th>
                      <th className="text-left py-3 px-4">Subscription Revenue</th>
                      <th className="text-left py-3 px-4">Total Revenue</th>
                      <th className="text-left py-3 px-4">Expenses</th>
                      <th className="text-left py-3 px-4">Net Profit</th>
                      <th className="text-left py-3 px-4">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        month: "June 2023",
                        booking: "₹3,24,500",
                        subscription: "₹1,34,250",
                        total: "₹4,58,750",
                        expenses: "₹1,85,000",
                        profit: "₹2,73,750",
                        growth: "+22.3%",
                      },
                      {
                        month: "May 2023",
                        booking: "₹2,85,400",
                        subscription: "₹1,12,600",
                        total: "₹3,98,000",
                        expenses: "₹1,72,500",
                        profit: "₹2,25,500",
                        growth: "+18.5%",
                      },
                      {
                        month: "April 2023",
                        booking: "₹2,45,800",
                        subscription: "₹98,200",
                        total: "₹3,44,000",
                        expenses: "₹1,58,000",
                        profit: "₹1,86,000",
                        growth: "+15.2%",
                      },
                      {
                        month: "March 2023",
                        booking: "₹2,12,500",
                        subscription: "₹86,500",
                        total: "₹2,99,000",
                        expenses: "₹1,45,000",
                        profit: "₹1,54,000",
                        growth: "+12.8%",
                      },
                      {
                        month: "February 2023",
                        booking: "₹1,85,600",
                        subscription: "₹78,400",
                        total: "₹2,64,000",
                        expenses: "₹1,32,000",
                        profit: "₹1,32,000",
                        growth: "+10.5%",
                      },
                    ].map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{item.month}</td>
                        <td className="py-3 px-4">{item.booking}</td>
                        <td className="py-3 px-4">{item.subscription}</td>
                        <td className="py-3 px-4 font-medium">{item.total}</td>
                        <td className="py-3 px-4 text-red-500">{item.expenses}</td>
                        <td className="py-3 px-4 text-green-500">{item.profit}</td>
                        <td className="py-3 px-4 text-green-500">{item.growth}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
