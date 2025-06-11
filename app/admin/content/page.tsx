import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Filter, MoreHorizontal, Plus, Search, ImageIcon, Edit } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ContentManagement() {
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Bridal Makeup Trends for 2023",
      author: "Avneet Kaur",
      status: "published",
      date: "2023-06-10",
      views: 1245,
      comments: 32,
    },
    {
      id: 2,
      title: "How to Choose the Right Makeup Artist for Your Wedding",
      author: "Priya Sharma",
      status: "published",
      date: "2023-06-05",
      views: 987,
      comments: 24,
    },
    {
      id: 3,
      title: "The Ultimate Guide to HD Makeup",
      author: "Meera Joshi",
      status: "draft",
      date: "2023-06-02",
      views: 0,
      comments: 0,
    },
    {
      id: 4,
      title: "Natural vs. Airbrush Makeup: Which is Right for You?",
      author: "Neha Singh",
      status: "published",
      date: "2023-05-28",
      views: 756,
      comments: 18,
    },
    {
      id: 5,
      title: "Makeup Tips for Different Skin Types",
      author: "Anjali Patel",
      status: "scheduled",
      date: "2023-06-15",
      views: 0,
      comments: 0,
    },
    {
      id: 6,
      title: "How to Make Your Makeup Last All Day",
      author: "Kavita Verma",
      status: "draft",
      date: "2023-05-20",
      views: 0,
      comments: 0,
    },
  ]

  const mediaItems = [
    {
      id: 1,
      name: "bridal-makeup-1.jpg",
      type: "image",
      size: "2.4 MB",
      dimensions: "1920x1080",
      uploadedBy: "Avneet Kaur",
      date: "2023-06-10",
    },
    {
      id: 2,
      name: "makeup-tutorial.mp4",
      type: "video",
      size: "24.8 MB",
      dimensions: "1920x1080",
      uploadedBy: "Priya Sharma",
      date: "2023-06-05",
    },
    {
      id: 3,
      name: "product-catalog.pdf",
      type: "document",
      size: "4.2 MB",
      dimensions: "-",
      uploadedBy: "Admin",
      date: "2023-06-02",
    },
    {
      id: 4,
      name: "party-makeup-collection.jpg",
      type: "image",
      size: "1.8 MB",
      dimensions: "1600x900",
      uploadedBy: "Meera Joshi",
      date: "2023-05-28",
    },
    {
      id: 5,
      name: "makeup-tips.pdf",
      type: "document",
      size: "2.1 MB",
      dimensions: "-",
      uploadedBy: "Neha Singh",
      date: "2023-05-25",
    },
    {
      id: 6,
      name: "bridal-showcase.mp4",
      type: "video",
      size: "32.5 MB",
      dimensions: "1920x1080",
      uploadedBy: "Admin",
      date: "2023-05-20",
    },
  ]

  const pages = [
    {
      id: 1,
      title: "Home",
      url: "/",
      lastUpdated: "2023-06-10",
      updatedBy: "Admin",
      status: "published",
    },
    {
      id: 2,
      title: "About Us",
      url: "/about",
      lastUpdated: "2023-06-05",
      updatedBy: "Admin",
      status: "published",
    },
    {
      id: 3,
      title: "Services",
      url: "/services",
      lastUpdated: "2023-06-02",
      updatedBy: "Admin",
      status: "published",
    },
    {
      id: 4,
      title: "Contact",
      url: "/contact",
      lastUpdated: "2023-05-28",
      updatedBy: "Admin",
      status: "published",
    },
    {
      id: 5,
      title: "FAQ",
      url: "/faq",
      lastUpdated: "2023-05-25",
      updatedBy: "Admin",
      status: "published",
    },
    {
      id: 6,
      title: "Terms & Conditions",
      url: "/terms",
      lastUpdated: "2023-05-20",
      updatedBy: "Admin",
      status: "published",
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <Button className="bg-[#FF6B9D] hover:bg-[#FF5A8C]">
          <Plus className="mr-2 h-4 w-4" />
          Create New Content
        </Button>
      </div>

      <Tabs defaultValue="blog" className="mb-6">
        <TabsList>
          <TabsTrigger value="blog">Blog Management</TabsTrigger>
          <TabsTrigger value="media">Media Library</TabsTrigger>
          <TabsTrigger value="pages">Page Editing</TabsTrigger>
        </TabsList>
        <TabsContent value="blog">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Blog Posts</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search posts..." className="pl-8 w-64" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button className="bg-[#FF6B9D] hover:bg-[#FF5A8C]">
                    <Plus className="mr-2 h-4 w-4" />
                    New Post
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="h-40 bg-gray-100 relative">
                      <ImageIcon
                        src="/placeholder.svg?height=160&width=320"
                        alt={post.title}
                        width={320}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                      <Badge
                        className={
                          post.status === "published"
                            ? "absolute top-2 right-2 bg-green-100 text-green-800"
                            : post.status === "draft"
                              ? "absolute top-2 right-2 bg-gray-100 text-gray-800"
                              : "absolute top-2 right-2 bg-blue-100 text-blue-800"
                        }
                      >
                        {post.status}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <span>{post.author}</span>
                        <span>{post.date}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>👁️ {post.views} views</span>
                        <span>💬 {post.comments} comments</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
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
                            <DropdownMenuItem>View</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Change Status</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="media">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Media Library</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search media..." className="pl-8 w-64" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button className="bg-[#FF6B9D] hover:bg-[#FF5A8C]">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Media
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mediaItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div
                      className={`h-40 flex items-center justify-center ${
                        item.type === "image" ? "bg-gray-100" : item.type === "video" ? "bg-blue-50" : "bg-yellow-50"
                      }`}
                    >
                      {item.type === "image" ? (
                        <ImageIcon
                          src="/placeholder.svg?height=160&width=160"
                          alt={item.name}
                          width={160}
                          height={160}
                          className="w-full h-full object-cover"
                        />
                      ) : item.type === "video" ? (
                        <div className="text-blue-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
                            <path d="m10 8 6 4-6 4V8z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="text-yellow-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-sm mb-1 truncate">{item.name}</h3>
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>{item.type}</span>
                        <span>{item.size}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{item.dimensions}</span>
                        <span>{item.date}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem>Rename</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pages">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Website Pages</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search pages..." className="pl-8 w-64" />
                  </div>
                  <Button className="bg-[#FF6B9D] hover:bg-[#FF5A8C]">
                    <Plus className="mr-2 h-4 w-4" />
                    New Page
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Page Title</th>
                      <th className="text-left py-3 px-4">URL</th>
                      <th className="text-left py-3 px-4">Last Updated</th>
                      <th className="text-left py-3 px-4">Updated By</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((page) => (
                      <tr key={page.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{page.title}</td>
                        <td className="py-3 px-4 text-blue-500">{page.url}</td>
                        <td className="py-3 px-4">{page.lastUpdated}</td>
                        <td className="py-3 px-4">{page.updatedBy}</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-100 text-green-800">{page.status}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3 mr-1" />
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
                                <DropdownMenuItem>View</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Change Status</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
      </Tabs>
    </div>
  )
}
