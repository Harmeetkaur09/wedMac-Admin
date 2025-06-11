import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Save, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LeadDistributionPage() {
  const rules = [
    {
      id: 1,
      name: "Bridal Makeup in Delhi",
      criteria: {
        service: "Bridal Makeup",
        location: "Delhi",
      },
      assignTo: "Avneet Kaur",
      priority: "High",
      status: "active",
    },
    {
      id: 2,
      name: "Party Makeup in Mumbai",
      criteria: {
        service: "Party Makeup",
        location: "Mumbai",
      },
      assignTo: "Priya Sharma",
      priority: "Medium",
      status: "active",
    },
    {
      id: 3,
      name: "HD Makeup in Bangalore",
      criteria: {
        service: "HD Makeup",
        location: "Bangalore",
      },
      assignTo: "Meera Joshi",
      priority: "Low",
      status: "inactive",
    },
  ]

  const artists = [
    {
      id: 1,
      name: "Avneet Kaur",
      specialty: "Bridal Makeup",
      location: "Delhi",
      capacity: "High",
      currentLeads: 12,
    },
    {
      id: 2,
      name: "Priya Sharma",
      specialty: "HD Makeup",
      location: "Mumbai",
      capacity: "Medium",
      currentLeads: 8,
    },
    {
      id: 3,
      name: "Meera Joshi",
      specialty: "Party Makeup",
      location: "Bangalore",
      capacity: "Low",
      currentLeads: 5,
    },
    {
      id: 4,
      name: "Neha Singh",
      specialty: "Airbrush Makeup",
      location: "Hyderabad",
      capacity: "High",
      currentLeads: 10,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Distribution Rules</h1>
          <p className="text-gray-600 mt-1">Configure how leads are automatically assigned to artists</p>
        </div>
        <Button className="bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] hover:from-[#FF5A8C] hover:to-[#FF4979] shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Create New Rule
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Distribution Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Automatic Lead Assignment</h3>
                  <p className="text-sm text-gray-500">Enable automatic assignment of leads based on rules</p>
                </div>
                <Switch id="auto-assign" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Round Robin Distribution</h3>
                  <p className="text-sm text-gray-500">Distribute leads evenly among eligible artists</p>
                </div>
                <Switch id="round-robin" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Capacity-Based Assignment</h3>
                  <p className="text-sm text-gray-500">Assign leads based on artist capacity</p>
                </div>
                <Switch id="capacity-based" defaultChecked />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="default-artist">Default Artist (when no rule matches)</Label>
                <Select defaultValue="1">
                  <SelectTrigger id="default-artist" className="mt-1">
                    <SelectValue placeholder="Select an artist" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Avneet Kaur</SelectItem>
                    <SelectItem value="2">Priya Sharma</SelectItem>
                    <SelectItem value="3">Meera Joshi</SelectItem>
                    <SelectItem value="4">Neha Singh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="max-leads">Maximum Leads Per Artist</Label>
                <Input id="max-leads" type="number" defaultValue="15" className="mt-1" />
              </div>
              <div className="flex justify-end">
                <Button className="bg-[#FF6B9D] hover:bg-[#FF5A8C]">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="rules">Distribution Rules</TabsTrigger>
          <TabsTrigger value="artists">Artist Capacity</TabsTrigger>
        </TabsList>
        <TabsContent value="rules">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Lead Distribution Rules</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search rules..." className="pl-8 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <Card key={rule.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{rule.name}</h3>
                            <Badge
                              className={
                                rule.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }
                            >
                              {rule.status}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Criteria: </span>
                            <span>
                              {rule.criteria.service} in {rule.criteria.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm">
                              <span className="text-gray-500">Assign to: </span>
                              <span className="font-medium">{rule.assignTo}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Priority: </span>
                              <Badge
                                variant="outline"
                                className={
                                  rule.priority === "High"
                                    ? "border-red-200 text-red-700"
                                    : rule.priority === "Medium"
                                      ? "border-yellow-200 text-yellow-700"
                                      : "border-blue-200 text-blue-700"
                                }
                              >
                                {rule.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`rule-status-${rule.id}`} className="text-sm">
                              Active
                            </Label>
                            <Switch id={`rule-status-${rule.id}`} defaultChecked={rule.status === "active"} />
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="artists">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Artist Lead Capacity</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search artists..." className="pl-8 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {artists.map((artist) => (
                  <Card key={artist.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                          <AvatarFallback className="bg-gradient-to-br from-[#FF6B9D] to-[#FF5A8C] text-white">
                            {artist.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{artist.name}</h3>
                          <p className="text-xs text-gray-500">{artist.specialty}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Location:</span>
                          <span>{artist.location}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Current Leads:</span>
                          <span className="font-medium">{artist.currentLeads}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Capacity:</span>
                          <Badge
                            variant="outline"
                            className={
                              artist.capacity === "High"
                                ? "border-green-200 text-green-700"
                                : artist.capacity === "Medium"
                                  ? "border-yellow-200 text-yellow-700"
                                  : "border-red-200 text-red-700"
                            }
                          >
                            {artist.capacity}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        Adjust Capacity
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
