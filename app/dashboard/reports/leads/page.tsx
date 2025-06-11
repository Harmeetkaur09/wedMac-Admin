import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, TrendingUp, TrendingDown, Users, Target, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LeadAnalyticsPage() {
  const leadMetrics = [
    {
      title: "Total Leads",
      value: "1,245",
      change: "+18%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "Conversion Rate",
      value: "24.5%",
      change: "+3.2%",
      trend: "up",
      icon: Target,
      color: "green",
    },
    {
      title: "Qualified Leads",
      value: "305",
      change: "+12%",
      trend: "up",
      icon: Zap,
      color: "purple",
    },
    {
      title: "Lead Value",
      value: "₹18.5L",
      change: "+25%",
      trend: "up",
      icon: TrendingUp,
      color: "pink",
    },
  ]

  const leadSources = [
    { source: "Website Contact Form", leads: 456, conversion: "28%", value: "₹6.8L" },
    { source: "Social Media", leads: 342, conversion: "22%", value: "₹4.2L" },
    { source: "Google Ads", leads: 234, conversion: "31%", value: "₹5.1L" },
    { source: "Referrals", leads: 156, conversion: "45%", value: "₹2.8L" },
    { source: "Email Marketing", leads: 57, conversion: "18%", value: "₹0.9L" },
  ]

  const leadsByService = [
    { service: "Bridal Makeup", leads: 456, percentage: 36.7, avgValue: "₹18,500" },
    { service: "Party Makeup", leads: 342, percentage: 27.5, avgValue: "₹12,000" },
    { service: "HD Makeup", leads: 234, percentage: 18.8, avgValue: "₹15,000" },
    { service: "Engagement Makeup", leads: 156, percentage: 12.5, avgValue: "₹10,500" },
    { service: "Airbrush Makeup", leads: 57, percentage: 4.5, avgValue: "₹22,000" },
  ]

  const conversionFunnel = [
    { stage: "Website Visitors", count: 18650, percentage: 100 },
    { stage: "Lead Generation", count: 1245, percentage: 6.7 },
    { stage: "Qualified Leads", count: 305, percentage: 24.5 },
    { stage: "Proposals Sent", count: 189, percentage: 61.9 },
    { stage: "Bookings Confirmed", count: 87, percentage: 46.0 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Analytics</h1>
          <p className="text-gray-600 mt-1">Track lead generation and conversion performance</p>
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
        {leadMetrics.map((metric, index) => {
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

      <Tabs defaultValue="sources" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="services">By Service</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Lead Sources Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadSources.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{source.source}</h3>
                      <p className="text-sm text-gray-500">{source.leads} leads generated</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="font-medium text-green-600">{source.conversion}</p>
                        <p className="text-xs text-gray-500">Conversion</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-[#FF6B9D]">{source.value}</p>
                        <p className="text-xs text-gray-500">Total Value</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Leads by Service Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadsByService.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{service.service}</h3>
                      <p className="text-sm text-gray-500">{service.leads} leads</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#FF6B9D] h-2 rounded-full"
                            style={{ width: `${service.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{service.percentage}%</span>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-[#FF6B9D]">{service.avgValue}</p>
                        <p className="text-xs text-gray-500">Avg. Value</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle>Lead Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {conversionFunnel.map((stage, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{stage.stage}</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold">{stage.count.toLocaleString()}</span>
                        <Badge className="bg-[#FF6B9D] text-white">{stage.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] h-4 rounded-full transition-all duration-500"
                        style={{ width: `${stage.percentage}%` }}
                      ></div>
                    </div>
                    {index < conversionFunnel.length - 1 && (
                      <div className="absolute left-1/2 transform -translate-x-1/2 mt-2">
                        <TrendingDown className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Lead Generation Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
                  <div className="space-y-4">
                    {[
                      { month: "June 2023", leads: 1245, change: "+18%" },
                      { month: "May 2023", leads: 1056, change: "+12%" },
                      { month: "April 2023", leads: 942, change: "+8%" },
                      { month: "March 2023", leads: 873, change: "+15%" },
                    ].map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{trend.month}</p>
                          <p className="text-sm text-gray-500">{trend.leads} leads</p>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-sm text-green-600">{trend.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Peak Performance Days</h3>
                  <div className="space-y-4">
                    {[
                      { day: "Saturday", leads: 45, percentage: 18.2 },
                      { day: "Sunday", leads: 42, percentage: 17.0 },
                      { day: "Friday", leads: 38, percentage: 15.4 },
                      { day: "Thursday", leads: 35, percentage: 14.2 },
                    ].map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{day.day}</p>
                          <p className="text-sm text-gray-500">{day.leads} avg leads</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#FF6B9D] h-2 rounded-full"
                              style={{ width: `${day.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{day.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
