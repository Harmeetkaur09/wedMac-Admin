import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, Plus, Edit, Eye, Trash2, Copy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function PagesManagementPage() {
  const pages = [
    {
      id: 1,
      title: "Home Page",
      slug: "home",
      status: "published",
      template: "landing",
      lastModified: "2023-06-10",
      author: "Admin",
      views: 15420,
    },
    {
      id: 2,
      title: "About Us",
      slug: "about-us",
      status: "published",
      template: "default",
      lastModified: "2023-06-10",
      author: "Admin",
      views: 3240,
    },
    {
      id: 3,
      title: "Services",
      slug: "services",
      status: "published",
      template: "default",
      lastModified: "2023-06-09",
      author: "Admin",
      views: 5680,
    },
    {
      id: 4,
      title: "Privacy Policy",
      slug: "privacy-policy",
      status: "published",
      template: "default",
      lastModified: "2023-06-08",
      author: "Admin",
      views: 890,
    },
    {
      id: 5,
      title: "Terms of Service",
      slug: "terms-of-service",
      status: "draft",
      template: "default",
      lastModified: "2023-06-05",
      author: "Admin",
      views: 0,
    },
    {
      id: 6,
      title: "Contact Us",
      slug: "contact",
      status: "published",
      template: "contact",
      lastModified: "2023-06-03",
      author: "Admin",
      views: 2340,
    },
    {
      id: 7,
      title: "FAQ",
      slug: "faq",
      status: "published",
      template: "default",
      lastModified: "2023-06-03",
      author: "Admin",
      views: 1560,
    },
    {
      id: 8,
      title: "Pricing",
      slug: "pricing",
      status: "archived",
      template: "default",
      lastModified: "2023-05-28",
      author: "Admin",
      views: 4320,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages Management</h1>
          <p className="text-gray-600 mt-1">Manage all website pages and content</p>
        </div>
        <Button className="bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] hover:from-[#FF5A8C] hover:to-[#FF4979] shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Create New Page
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Pages Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Pages</p>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-gray-500">All pages</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Published</p>
              <p className="text-2xl font-bold">6</p>
              <p className="text-xs text-gray-500">75% of total</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Draft</p>
              <p className="text-2xl font-bold">1</p>
              <p className="text-xs text-gray-500">12.5% of total</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Archived</p>
              <p className="text-2xl font-bold">1</p>
              <p className="text-xs text-gray-500">12.5% of total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Pages</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>All Pages</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search pages..." className="pl-8 w-64" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pages.map((page) => (
                      <TableRow key={page.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell className="text-sm text-gray-600">/{page.slug}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              page.status === "published"
                                ? "bg-green-100 text-green-800"
                                : page.status === "draft"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {page.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm capitalize">{page.template}</TableCell>
                        <TableCell className="text-sm">{page.views.toLocaleString()}</TableCell>
                        <TableCell className="text-sm">{page.lastModified}</TableCell>
                        <TableCell className="text-sm">{page.author}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Page Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Page
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Page
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Change Status</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Page
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="published">
          <Card>
            <CardContent className="p-6">
              <p>Published pages will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="draft">
          <Card>
            <CardContent className="p-6">
              <p>Draft pages will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="archived">
          <Card>
            <CardContent className="p-6">
              <p>Archived pages will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
