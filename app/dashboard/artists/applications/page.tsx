import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, CheckCircle, XCircle, Eye, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApplicationReviewPage() {
  const applications = [
    {
      id: 1,
      name: "Ritu Sharma",
      email: "ritu@example.com",
      phone: "+91 98765 43210",
      location: "Mumbai",
      specialty: "Bridal Makeup",
      experience: "5 years",
      status: "pending",
      submittedAt: "2023-06-10",
      documents: ["ID Proof", "Address Proof", "Portfolio", "Certification"],
    },
    {
      id: 2,
      name: "Kavita Singh",
      email: "kavita@example.com",
      phone: "+91 87654 32109",
      location: "Delhi",
      specialty: "HD Makeup",
      experience: "3 years",
      status: "pending",
      submittedAt: "2023-06-09",
      documents: ["ID Proof", "Address Proof", "Portfolio"],
    },
    {
      id: 3,
      name: "Meera Joshi",
      email: "meera@example.com",
      phone: "+91 76543 21098",
      location: "Bangalore",
      specialty: "Party Makeup",
      experience: "4 years",
      status: "pending",
      submittedAt: "2023-06-08",
      documents: ["ID Proof", "Address Proof", "Portfolio", "Certification"],
    },
    {
      id: 4,
      name: "Pooja Verma",
      email: "pooja@example.com",
      phone: "+91 65432 10987",
      location: "Hyderabad",
      specialty: "Airbrush Makeup",
      experience: "2 years",
      status: "pending",
      submittedAt: "2023-06-07",
      documents: ["ID Proof", "Address Proof", "Portfolio"],
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Application Review (KYC)</h1>
          <p className="text-gray-600 mt-1">Review and verify artist applications and documents</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search applications..." className="pl-8 w-64" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Application Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Pending Review</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">In Progress</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Approved</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Rejected</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="inprogress">In Progress</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={`/placeholder.svg?height=80&width=80`} />
                      <AvatarFallback className="bg-gradient-to-br from-[#FF6B9D] to-[#FF5A8C] text-white text-xl">
                        {application.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{application.name}</h3>
                        <p className="text-gray-600">{application.specialty}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 mt-1">
                          <span>{application.location}</span>
                          <span>{application.email}</span>
                          <span>{application.phone}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">Submitted: {application.submittedAt}</div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Experience</h4>
                      <p className="text-sm">{application.experience}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Documents Submitted</h4>
                      <div className="flex flex-wrap gap-2">
                        {application.documents.map((doc, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                      <Button className="bg-[#FF6B9D] hover:bg-[#FF5A8C]">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="inprogress">
          <Card>
            <CardContent className="p-6">
              <p>Applications in progress will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="approved">
          <Card>
            <CardContent className="p-6">
              <p>Approved applications will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rejected">
          <Card>
            <CardContent className="p-6">
              <p>Rejected applications will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
