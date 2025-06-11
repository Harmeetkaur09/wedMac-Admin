import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, Star, Edit, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ArtistProfilesPage() {
  const artists = [
    {
      id: 1,
      name: "Avneet Kaur",
      email: "avneet@example.com",
      location: "Delhi",
      specialty: "Bridal Makeup",
      status: "active",
      rating: 4.9,
      bookings: 45,
      bio: "Professional makeup artist with 5+ years of experience specializing in bridal makeup.",
      services: ["Bridal Makeup", "Party Makeup", "HD Makeup", "Airbrush Makeup"],
      price: "₹12,000 - ₹25,000",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@example.com",
      location: "Mumbai",
      specialty: "HD Makeup",
      status: "active",
      rating: 4.8,
      bookings: 38,
      bio: "Celebrity makeup artist with expertise in HD makeup for special occasions.",
      services: ["HD Makeup", "Celebrity Makeup", "Fashion Makeup", "Editorial Makeup"],
      price: "₹15,000 - ₹30,000",
    },
    {
      id: 3,
      name: "Meera Joshi",
      email: "meera@example.com",
      location: "Bangalore",
      specialty: "Party Makeup",
      status: "pending",
      rating: 4.7,
      bookings: 36,
      bio: "Passionate about creating stunning party looks for all occasions.",
      services: ["Party Makeup", "Engagement Makeup", "Cocktail Makeup", "Reception Makeup"],
      price: "₹8,000 - ₹18,000",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Artist Profiles</h1>
          <p className="text-gray-600 mt-1">View and manage detailed artist profiles</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search profiles..." className="pl-8 w-64" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Profiles</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-6">
          {artists.map((artist) => (
            <Card key={artist.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={`/placeholder.svg?height=96&width=96`} />
                      <AvatarFallback className="bg-gradient-to-br from-[#FF6B9D] to-[#FF5A8C] text-white text-2xl">
                        {artist.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="ml-1 font-medium">{artist.rating}</span>
                      </div>
                      <p className="text-sm text-gray-500">{artist.bookings} bookings</p>
                    </div>
                    <Badge
                      className={
                        artist.status === "active"
                          ? "bg-green-100 text-green-800"
                          : artist.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {artist.status}
                    </Badge>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{artist.name}</h3>
                        <p className="text-gray-600">{artist.specialty}</p>
                        <p className="text-sm text-gray-500">
                          {artist.location} • {artist.email}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Edit className="h-3.5 w-3.5 mr-1" />
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
                            <DropdownMenuItem>View Full Profile</DropdownMenuItem>
                            <DropdownMenuItem>Message Artist</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Change Status</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <p className="text-sm">{artist.bio}</p>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {artist.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <div>
                        <p className="text-sm font-medium">Price Range</p>
                        <p className="text-sm text-gray-600">{artist.price}</p>
                      </div>
                      <Button className="bg-[#FF6B9D] hover:bg-[#FF5A8C]">View Bookings</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="active">
          <Card>
            <CardContent className="p-6">
              <p>Active artist profiles will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card>
            <CardContent className="p-6">
              <p>Pending artist profiles will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inactive">
          <Card>
            <CardContent className="p-6">
              <p>Inactive artist profiles will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
