import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Save, Eye, Trash2, Plus, Edit } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContentEditorPage() {
  const pages = [
    {
      id: 1,
      title: "About Us",
      slug: "about-us",
      status: "published",
      lastModified: "2023-06-10",
      author: "Admin",
    },
    {
      id: 2,
      title: "Privacy Policy",
      slug: "privacy-policy",
      status: "published",
      lastModified: "2023-06-08",
      author: "Admin",
    },
    {
      id: 3,
      title: "Terms of Service",
      slug: "terms-of-service",
      status: "draft",
      lastModified: "2023-06-05",
      author: "Admin",
    },
    {
      id: 4,
      title: "FAQ",
      slug: "faq",
      status: "published",
      lastModified: "2023-06-03",
      author: "Admin",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Editor</h1>
          <p className="text-gray-600 mt-1">Create and edit website content</p>
        </div>
        <Button className="bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] hover:from-[#FF5A8C] hover:to-[#FF4979] shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Create New Page
        </Button>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="editor">Content Editor</TabsTrigger>
          <TabsTrigger value="pages">Manage Pages</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="page-title">Page Title</Label>
                    <Input id="page-title" placeholder="Enter page title" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="page-slug">URL Slug</Label>
                    <Input id="page-slug" placeholder="page-url-slug" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="meta-description">Meta Description</Label>
                    <Textarea
                      id="meta-description"
                      placeholder="Enter meta description for SEO"
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" placeholder="Enter your content here..." className="mt-1 min-h-[400px]" />
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-[#FF6B9D] hover:bg-[#FF5A8C]">
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">Publish</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Page Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="draft">
                      <SelectTrigger id="status" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="template">Page Template</Label>
                    <Select defaultValue="default">
                      <SelectTrigger id="template" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="landing">Landing Page</SelectItem>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="contact">Contact Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="featured-image">Featured Image</Label>
                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <p className="text-sm text-gray-500">Click to upload image</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input id="tags" placeholder="Enter tags separated by commas" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="publish-date">Publish Date</Label>
                    <Input id="publish-date" type="datetime-local" className="mt-1" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Manage Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{page.title}</h3>
                        <Badge
                          className={
                            page.status === "published"
                              ? "bg-green-100 text-green-800"
                              : page.status === "draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {page.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span>/{page.slug}</span>
                        <span>Last modified: {page.lastModified}</span>
                        <span>By: {page.author}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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
