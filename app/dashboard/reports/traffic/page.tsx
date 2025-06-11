import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, TrendingDown, Users, Eye, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TrafficAnalyticsPage() {
  const trafficData = [
    { page: "/", views: 15420, uniqueVisitors: 12340, bounceRate: "45%", avgTime: "2:34" },
    { page: "/makeup-artists", views: 8950, uniqueVisitors: 7230, bounceRate: "38%", avgTime: "3:12" },
    { page: "/about", views: 3240, uniqueVisitors: 2890, bounceRate: "52%", avgTime: "1:45" },
    { page: "/contact", views: 2340, uniqueVisitors: 2100, bounceRate: "35%", avgTime: "2:18" },
    { page: "/blog", views: 1890, uniqueVisitors: 1650, bounceRate: "42%", avgTime: "4:22" },
  ]

  const topSources = [
    { source: "Google Search", visitors: 8450, percentage: 45.2 },
    { source: "Direct", visitors: 4230, percentage: 22.6 },
    { source: "Social Media", visitors: 3120, percentage: 16.7 },
    { source: "Referrals", visitors: 1890, percentage: 10.1 },
    { source: "Email", visitors: 980, percentage: 5.4 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Traffic Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor website traffic and user behavior</p>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Visitors</p>
                <p className="text-3xl font-bold">18,650</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Page Views</p>
                <p className="text-3xl font-bold">45,230</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+8.3%</span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Bounce Rate</p>
                <p className="text-3xl font-bold">42.3%</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">-2.1%</span>
                </div>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg. Session</p>
                <p className="text-3xl font-bold">2:45</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+15s</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>
        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages by Traffic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trafficData.map((page, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{page.page}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span>{page.views.toLocaleString()} views</span>
                        <span>{page.uniqueVisitors.toLocaleString()} unique visitors</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-medium">{page.bounceRate}</p>
                        <p className="text-gray-500">Bounce Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{page.avgTime}</p>
                        <p className="text-gray-500">Avg. Time</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{source.source}</h3>
                      <p className="text-sm text-gray-500">{source.visitors.toLocaleString()} visitors</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-[#FF6B9D] h-2 rounded-full" style={{ width: `${source.percentage}%` }}></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{source.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="devices">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-50 p-6 rounded-lg mb-3">
                    <p className="text-3xl font-bold text-blue-600">65.4%</p>
                  </div>
                  <h3 className="font-medium">Desktop</h3>
                  <p className="text-sm text-gray-500">12,190 visitors</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-50 p-6 rounded-lg mb-3">
                    <p className="text-3xl font-bold text-green-600">28.7%</p>
                  </div>
                  <h3 className="font-medium">Mobile</h3>
                  <p className="text-sm text-gray-500">5,350 visitors</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-50 p-6 rounded-lg mb-3">
                    <p className="text-3xl font-bold text-purple-600">5.9%</p>
                  </div>
                  <h3 className="font-medium">Tablet</h3>
                  <p className="text-sm text-gray-500">1,110 visitors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Top Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { country: "India", city: "Mumbai", visitors: 4230, percentage: 22.7 },
                  { country: "India", city: "Delhi", visitors: 3890, percentage: 20.9 },
                  { country: "India", city: "Bangalore", visitors: 2340, percentage: 12.5 },
                  { country: "India", city: "Hyderabad", visitors: 1890, percentage: 10.1 },
                  { country: "India", city: "Chennai", visitors: 1560, percentage: 8.4 },
                ].map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {location.city}, {location.country}
                      </h3>
                      <p className="text-sm text-gray-500">{location.visitors.toLocaleString()} visitors</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#FF6B9D] h-2 rounded-full"
                          style={{ width: `${location.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{location.percentage}%</span>
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
