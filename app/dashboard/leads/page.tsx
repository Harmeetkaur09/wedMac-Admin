import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, Plus, MoreHorizontal } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function LeadManagementPage() {
  const leads = [
    {
      id: 1,
      name: "Anjali Patel",
      email: "anjali@example.com",
      phone: "+91 98765 43210",
      service: "Bridal Makeup",
      location: "Delhi",
      status: "new",
      source: "Website",
      date: "2023-06-10",
      assignedTo: null,
    },
    {
      id: 2,
      name: "Ritu Sharma",
      email: "ritu@example.com",
      phone: "+91 87654 32109",
      service: "Party Makeup",
      location: "Mumbai",
      status: "contacted",
      source: "Instagram",
      date: "2023-06-09",
      assignedTo: "Avneet Kaur",
    },
    {
      id: 3,
      name: "Kavita Singh",
      email: "kavita@example.com",
      phone: "+91 76543 21098",
      service: "Engagement Makeup",
      location: "Bangalore",
      status: "qualified",
      source: "Referral",
      date: "2023-06-08",
      assignedTo: "Priya Sharma",
    },
    {
      id: 4,
      name: "Pooja Verma",
      email: "pooja@example.com",
      phone: "+91 65432 10987",
      service: "HD Makeup",
      location: "Hyderabad",
      status: "unqualified",
      source: "Google",
      date: "2023-06-07",
      assignedTo: null,
    },
    {
      id: 5,
      name: "Neha Gupta",
      email: "neha@example.com",
      phone: "+91 54321 09876",
      service: "Bridal Makeup",
      location: "Chennai",
      status: "converted",
      source: "Facebook",
      date: "2023-06-06",
      assignedTo: "Meera Joshi",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-1">Track and manage customer leads</p>
        </div>
        <Button className="bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] hover:from-[#FF5A8C] hover:to-[#FF4979] shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Add New Lead
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Lead Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">New Leads</p>
              <p className="text-2xl font-bold">48</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Contacted</p>
              <p className="text-2xl font-bold">32</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Qualified</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Unqualified</p>
              <p className="text-2xl font-bold">15</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Converted</p>
              <p className="text-2xl font-bold">18</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Leads</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="contacted">Contacted</TabsTrigger>
          <TabsTrigger value="qualified">Qualified</TabsTrigger>
          <TabsTrigger value="unqualified">Unqualified</TabsTrigger>
          <TabsTrigger value="converted">Converted</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Lead List</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search leads..." className="pl-8 w-64" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-xs">{lead.email}</p>
                          <p className="text-xs text-gray-500">{lead.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{lead.service}</TableCell>
                      <TableCell>{lead.location}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            lead.status === "new"
                              ? "bg-blue-100 text-blue-800"
                              : lead.status === "contacted"
                                ? "bg-purple-100 text-purple-800"
                                : lead.status === "qualified"
                                  ? "bg-green-100 text-green-800"
                                  : lead.status === "unqualified"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>{lead.assignedTo || <span className="text-gray-400">Unassigned</span>}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Change Status</DropdownMenuItem>
                            <DropdownMenuItem>Assign to Artist</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">Delete Lead</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
        <TabsContent value="new">
          <Card>
            <CardContent className="p-6">
              <p>New leads will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contacted">
          <Card>
            <CardContent className="p-6">
              <p>Contacted leads will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="qualified">
          <Card>
            <CardContent className="p-6">
              <p>Qualified leads will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="unqualified">
          <Card>
            <CardContent className="p-6">
              <p>Unqualified leads will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="converted">
          <Card>
            <CardContent className="p-6">
              <p>Converted leads will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
