import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, Upload, ImageIcon, Video, FileText, Download, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MediaManagementPage() {
  const mediaFiles = [
    {
      id: 1,
      name: "hero-image.jpg",
      type: "image",
      size: "2.4 MB",
      dimensions: "1920x1080",
      uploadDate: "2023-06-10",
      url: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "artist-portfolio-1.jpg",
      type: "image",
      size: "1.8 MB",
      dimensions: "1200x800",
      uploadDate: "2023-06-09",
      url: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "makeup-tutorial.mp4",
      type: "video",
      size: "45.2 MB",
      dimensions: "1920x1080",
      uploadDate: "2023-06-08",
      url: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      name: "bridal-look-1.jpg",
      type: "image",
      size: "3.1 MB",
      dimensions: "1600x1200",
      uploadDate: "2023-06-07",
      url: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      name: "terms-and-conditions.pdf",
      type: "document",
      size: "245 KB",
      dimensions: "-",
      uploadDate: "2023-06-06",
      url: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      name: "party-makeup-2.jpg",
      type: "image",
      size: "2.7 MB",
      dimensions: "1400x900",
      uploadDate: "2023-06-05",
      url: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 7,
      name: "artist-intro.mp4",
      type: "video",
      size: "28.5 MB",
      dimensions: "1280x720",
      uploadDate: "2023-06-04",
      url: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 8,
      name: "hd-makeup-3.jpg",
      type: "image",
      size: "2.2 MB",
      dimensions: "1500x1000",
      uploadDate: "2023-06-03",
      url: "/placeholder.svg?height=200&width=300",
    },
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "document":
        return <FileText className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-blue-100 text-blue-800"
      case "video":
        return "bg-purple-100 text-purple-800"
      case "document":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Management</h1>
          <p className="text-gray-600 mt-1">Upload and manage media files</p>
        </div>
        <Button className="bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] hover:from-[#FF5A8C] hover:to-[#FF4979] shadow-lg hover:shadow-xl transition-all duration-300">
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Storage Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Files</p>
              <p className="text-2xl font-bold">248</p>
              <p className="text-xs text-gray-500">All media files</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Images</p>
              <p className="text-2xl font-bold">186</p>
              <p className="text-xs text-gray-500">75% of total</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Videos</p>
              <p className="text-2xl font-bold">45</p>
              <p className="text-xs text-gray-500">18% of total</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Storage Used</p>
              <p className="text-2xl font-bold">2.4 GB</p>
              <p className="text-xs text-gray-500">of 10 GB limit</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#FF6B9D] transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Media Files</h3>
            <p className="text-gray-500 mb-4">Drag and drop files here, or click to browse</p>
            <Button className="bg-[#FF6B9D] hover:bg-[#FF5A8C]">Choose Files</Button>
            <p className="text-xs text-gray-400 mt-2">
              Supported formats: JPG, PNG, GIF, MP4, MOV, PDF (Max 50MB per file)
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Media Library</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search files..." className="pl-8 w-64" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaFiles.map((file) => (
                  <Card key={file.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                        {file.type === "image" ? (
                          <img
                            src={file.url || "/placeholder.svg"}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center">
                            {getFileIcon(file.type)}
                            <span className="text-xs text-gray-500 mt-1">{file.type.toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm truncate">{file.name}</h3>
                          <Badge className={getFileTypeColor(file.type)}>{file.type}</Badge>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex justify-between">
                            <span>Size:</span>
                            <span>{file.size}</span>
                          </div>
                          {file.dimensions !== "-" && (
                            <div className="flex justify-between">
                              <span>Dimensions:</span>
                              <span>{file.dimensions}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Uploaded:</span>
                            <span>{file.uploadDate}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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
        <TabsContent value="images">
          <Card>
            <CardContent className="p-6">
              <p>Image files will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="videos">
          <Card>
            <CardContent className="p-6">
              <p>Video files will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardContent className="p-6">
              <p>Document files will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
