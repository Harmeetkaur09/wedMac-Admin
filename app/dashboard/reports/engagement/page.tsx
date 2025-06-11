import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Heart, MessageSquare, Share2, Star, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EngagementAnalyticsPage() {
  const engagementData = [
    {
      metric: "Average Session Duration",
      value: "3:42",
      change: "+18%",
      trend: "up",
      description: "Time users spend on site",
    },
    {
      metric: "Pages per Session",
      value: "4.2",
      change: "+12%",
      trend: "up",
      description: "Average pages viewed per visit",
    },
    {
      metric: "Return Visitor Rate",
      value: "34.5%",
      change: "+8%",
      trend: "up",
      description: "Percentage of returning users",
    },
    {
      metric: "Social Shares",
      value: "1,245",
      change: "+25%",
      trend: "up",
      description: "Content shared on social media",
    },
  ]

  const topContent = [
    {
      title: "Top 10 Bridal Makeup Trends for 2023",
      type: "Blog Post",
      views: 8450,
      likes: 234,
      comments: 67,
      shares: 89,
      engagement: "8.2%",
    },
    {
      title: "Avneet Kaur - Bridal Makeup Artist",
      type: "Artist Profile",
      views: 6230,
      likes: 189,
      comments: 45,
      shares: 23,
      engagement: "6.8%",
    },
    {
      title: "How to Choose the Perfect Makeup Artist",
      type: "Blog Post",
      views: 5890,
      likes: 156,
      comments: 34,
      shares: 67,
      engagement: "7.1%",
    },
    {
      title: "HD Makeup Gallery",
      type: "Gallery",
      views: 4560,
      likes: 298,
      comments: 12,
      shares: 45,
      engagement: "9.2%",
    },
    {
      title: "Priya Sharma - HD Makeup Specialist",
      type: "Artist Profile",
      views: 3890,
      likes: 134,
      comments: 28,
      shares: 19,
      engagement: "5.9%",
    },
  ]

  const socialMetrics = [
    {
      platform: "Instagram",
      followers: "12.5K",
      engagement: "4.8%",
      posts: 156,
      reach: "45.2K",
    },
    {
      platform: "Facebook",
      followers: "8.9K",
      engagement: "3.2%",
      posts: 89,
      reach: "28.7K",
    },
    {
      platform: "YouTube",
      followers: "5.6K",
      engagement: "6.1%",
      posts: 34,
      reach: "18.9K",
    },
    {
      platform: "Twitter",
      followers: "3.2K",
      engagement: "2.9%",
      posts: 78,
      reach: "12.4K",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Engagement Analytics</h1>
          <p className="text-gray-600 mt-1">Track user engagement and content performance</p>
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
        {engagementData.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 font-medium">{metric.metric}</p>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{metric.change}</span>
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">{metric.value}</p>
              <p className="text-xs text-gray-500">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="content">Top Content</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="interactions">User Interactions</TabsTrigger>
          <TabsTrigger value="feedback">Feedback & Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContent.map((content, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{content.title}</h3>
                        <Badge variant="outline">{content.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{content.views.toLocaleString()} views</span>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5" />
                          <span>{content.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{content.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-3.5 w-3.5" />
                          <span>{content.shares}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#FF6B9D]">{content.engagement}</p>
                      <p className="text-xs text-gray-500">Engagement Rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {socialMetrics.map((platform, index) => (
                  <Card key={index} className="border-l-4 border-l-[#FF6B9D]">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{platform.platform}</h3>
                        <Badge className="bg-[#FF6B9D] text-white">{platform.engagement}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Followers</p>
                          <p className="text-xl font-bold">{platform.followers}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Posts</p>
                          <p className="text-xl font-bold">{platform.posts}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Reach</p>
                          <p className="text-xl font-bold">{platform.reach}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Engagement</p>
                          <p className="text-xl font-bold">{platform.engagement}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="interactions">
          <Card>
            <CardHeader>
              <CardTitle>User Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-pink-50 p-6 rounded-lg mb-3">
                    <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-pink-600">2,456</p>
                  </div>
                  <h3 className="font-medium">Total Likes</h3>
                  <p className="text-sm text-gray-500">+18% this month</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-50 p-6 rounded-lg mb-3">
                    <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-blue-600">892</p>
                  </div>
                  <h3 className="font-medium">Comments</h3>
                  <p className="text-sm text-gray-500">+25% this month</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-50 p-6 rounded-lg mb-3">
                    <Share2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-green-600">567</p>
                  </div>
                  <h3 className="font-medium">Shares</h3>
                  <p className="text-sm text-gray-500">+32% this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Customer Feedback & Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Average Ratings</h3>
                  <div className="space-y-4">
                    {[
                      { category: "Overall Service", rating: 4.8, reviews: 234 },
                      { category: "Artist Quality", rating: 4.9, reviews: 189 },
                      { category: "Booking Process", rating: 4.6, reviews: 156 },
                      { category: "Customer Support", rating: 4.7, reviews: 98 },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.category}</p>
                          <p className="text-sm text-gray-500">{item.reviews} reviews</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(item.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{item.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
                  <div className="space-y-4">
                    {[
                      {
                        user: "Anjali P.",
                        rating: 5,
                        comment: "Amazing service! The makeup artist was professional and talented.",
                        date: "2 days ago",
                      },
                      {
                        user: "Ritu S.",
                        rating: 4,
                        comment: "Great experience overall. Would definitely recommend.",
                        date: "3 days ago",
                      },
                      {
                        user: "Kavita M.",
                        rating: 5,
                        comment: "Perfect makeup for my wedding day. Thank you!",
                        date: "1 week ago",
                      },
                    ].map((review, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.user}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
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
