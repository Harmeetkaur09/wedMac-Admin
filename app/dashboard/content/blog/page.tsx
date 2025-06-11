import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, Plus, Edit, Eye, Trash2, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function BlogManagementPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Bridal Makeup Trends for 2023",
      slug: "top-10-bridal-makeup-trends-2023",
      status: "published",
      author: "Avneet Kaur",
      publishDate: "2023-06-10",
      views: 2450,
      comments: 18,
      excerpt: "Discover the latest bridal makeup trends that are taking the wedding industry by storm this year.",
      featuredImage: "/placeholder.svg?height=200&width=300",
      tags: ["Bridal", "Trends", "2023"],
    },
    {
      id: 2,
      title: "How to Choose the Perfect Makeup Artist",
      slug: "how-to-choose-perfect-makeup-artist",
      status: "published",
      author: "Priya Sharma",
      publishDate: "2023-06-08",
      views: 1890,
      comments: 12,
      excerpt: "A comprehensive guide to help you find and select the right makeup artist for your special day.",
      featuredImage: "/placeholder.svg?height=200&width=300",
      tags: ["Guide", "Tips", "Selection"],
    },
    {
      id: 3,
      title: "HD Makeup vs Traditional Makeup: What's the Difference?",
      slug: "hd-makeup-vs-traditional-makeup",
      status: "draft",
      author: "Meera Joshi",
      publishDate: "2023-06-12",
      views: 0,
      comments: 0,
      excerpt: "Understanding the key differences between HD and traditional makeup techniques.",
      featuredImage: "/placeholder.svg?height=200&width=300",
      tags: ["HD Makeup", "Traditional", "Comparison"],
    },
    {
      id: 4,
      title: "Seasonal Makeup Tips for Every Occasion",
      slug: "seasonal-makeup-tips",
      status: "published",
      author: "Neha Singh",
      publishDate: "2023-06-05",
      views: 3120,
      comments: 25,
      excerpt: "Learn how to adapt your makeup look for different seasons and occasions.",
      featuredImage: "/placeholder.svg?height=200&width=300",
      tags: ["Seasonal", "Tips", "Occasions"],
    },
    {
      id: 5,
      title: "The Art of Airbrush Makeup",
      slug: "art-of-airbrush-makeup",
      status: "scheduled",
      author: "Anjali Patel",
      publishDate: "2023-06-15",
      views: 0,
      comments: 0,
      excerpt: "Explore the world of airbrush makeup and its benefits for special events.",
      featuredImage: "/placeholder.svg?height=200&width=300",
      tags: ["Airbrush", "Technique", "Events"],
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">Create and manage blog posts</p>
        </div>
        <Button className="bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] hover:from-[#FF5A8C] hover:to-[#FF4979] shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Create New Post
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Blog Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Posts</p>
              <p className="text-2xl font-bold">45</p>
              <p className="text-xs text-gray-500">All blog posts</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Published</p>
              <p className="text-2xl font-bold">38</p>
              <p className="text-xs text-gray-500">84% of total</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Draft</p>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-gray-500">11% of total</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Total Views</p>
              <p className="text-2xl font-bold">45.2K</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>All Blog Posts</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search posts..." className="pl-8 w-64" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-48 flex-shrink-0">
                          <img
                            src={post.featuredImage || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-32 md:h-24 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold hover:text-[#FF6B9D] cursor-pointer">{post.title}</h3>
                              <p className="text-gray-600 mt-1">{post.excerpt}</p>
                            </div>
                            <Badge
                              className={
                                post.status === "published"
                                  ? "bg-green-100 text-green-800"
                                  : post.status === "draft"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : post.status === "scheduled"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                              }
                            >
                              {post.status}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src="/placeholder.svg?height=24&width=24" />
                                <AvatarFallback className="bg-gradient-to-br from-[#FF6B9D] to-[#FF5A8C] text-white text-xs">
                                  {post.author.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{post.publishDate}</span>
                            </div>
                            <span>{post.views.toLocaleString()} views</span>
                            <span>{post.comments} comments</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="bg-gray-50">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-[#FF6B9D] text-white hover:bg-[#FF5A8C]">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="published">
          <Card>
            <CardContent className="p-6">
              <p>Published blog posts will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="draft">
          <Card>
            <CardContent className="p-6">
              <p>Draft blog posts will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="scheduled">
          <Card>
            <CardContent className="p-6">
              <p>Scheduled blog posts will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
