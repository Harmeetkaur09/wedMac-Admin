import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, Search, MoreHorizontal, Phone, Mail, MessageSquare } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LeadStatusPage() {
  const leads = [
    {
      id: 1,
      name: "Anjali Patel",
      email: "anjali@example.com",
      phone: "+91 98765 43210",
      service: "Bridal Makeup",
      location: "Delhi",
      status: "new",
      lastContact: "Never",
      assignedTo: "Avneet Kaur",
      notes: "Interested in bridal package for December wedding",
    },
    {
      id: 2,
      name: "Ritu Sharma",
      email: "ritu@example.com",
      phone: "+91 87654 32109",
      service: "Party Makeup",
      location: "Mumbai",
      status: "contacted",
      lastContact: "2023-06-09",
      assignedTo: "Priya Sharma",
      notes: "Called and left voicemail, awaiting response",
    },
    {
      id: 3,
      name: "Kavita Singh",
      email: "kavita@example.com",
      phone: "+91 76543 21098",
      service: "Engagement Makeup",
      location: "Bangalore",
      status: "qualified",
      lastContact: "2023-06-08",
      assignedTo: "Meera Joshi",
      notes: "Interested in engagement and wedding package",
    },
    {
      id: 4,
      name: "Pooja Verma",
      email: "pooja@example.com",
      phone: "+91 65432 10987",
      service: "HD Makeup",
      location: "Hyderabad",
      status: "unqualified",
      lastContact: "2023-06-07",
      assignedTo: "Neha Singh",
      notes: "Budget too low for our services",
    },
    {
      id: 5,
      name: "Neha Gupta",
      email: "neha@example.com",
      phone: "+91 54321 09876",
      service: "Bridal Makeup",
      location: "Chennai",
      status: "converted",
      lastContact: "2023-06-06",
      assignedTo: "Meera Joshi",
      notes: "Booking confirmed for December 15th",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Status Tracking</h1>
          <p className="text-gray-600 mt-1">Track and update lead status throughout the sales process</p>
        </div>
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

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">New</p>
              <p className="text-2xl font-bold">48</p>
              <p className="text-xs text-gray-500">+12 this week</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Contacted</p>
              <p className="text-2xl font-bold">32</p>
              <p className="text-xs text-gray-500">+8 this week</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Qualified</p>
              <p className="text-2xl font-bold">24</p>
              <p className="text-xs text-gray-500">+5 this week</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Unqualified</p>
              <p className="text-2xl font-bold">15</p>
              <p className="text-xs text-gray-500">+3 this week</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Converted</p>
              <p className="text-2xl font-bold">18</p>
              <p className="text-xs text-gray-500">+6 this week</p>
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
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{lead.email}</span>
                              <span>•</span>
                              <span>{lead.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{lead.service}</TableCell>
                        <TableCell>{lead.location}</TableCell>
                        <TableCell>
                          <Select defaultValue={lead.status}>
                            <SelectTrigger className="w-[120px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="qualified">Qualified</SelectItem>
                              <SelectItem value="unqualified">Unqualified</SelectItem>
                              <SelectItem value="converted">Converted</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{lead.assignedTo}</TableCell>
                        <TableCell className="text-sm">{lead.lastContact}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm">{lead.notes}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Phone className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Mail className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MessageSquare className="h-3.5 w-3.5" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Add Note</DropdownMenuItem>
                                <DropdownMenuItem>Schedule Follow-up</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">Delete Lead</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
