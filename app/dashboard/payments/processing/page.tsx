import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, RefreshCw, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PaymentProcessingPage() {
  const payments = [
    {
      id: "PAY001",
      user: "Anjali Patel",
      artist: "Avneet Kaur",
      amount: "₹15,000",
      status: "processing",
      method: "UPI",
      date: "2023-06-10 14:30",
      reference: "UPI123456789",
    },
    {
      id: "PAY002",
      user: "Ritu Sharma",
      artist: "Priya Sharma",
      amount: "₹8,500",
      status: "completed",
      method: "Credit Card",
      date: "2023-06-10 12:15",
      reference: "CC987654321",
    },
    {
      id: "PAY003",
      user: "Kavita Singh",
      artist: "Meera Joshi",
      amount: "₹12,000",
      status: "failed",
      method: "Net Banking",
      date: "2023-06-10 10:45",
      reference: "NB456789123",
    },
    {
      id: "PAY004",
      user: "Pooja Verma",
      artist: "Neha Singh",
      amount: "₹20,000",
      status: "pending",
      method: "Wallet",
      date: "2023-06-10 09:20",
      reference: "WAL789123456",
    },
    {
      id: "PAY005",
      user: "Neha Gupta",
      artist: "Anjali Patel",
      amount: "₹18,500",
      status: "refunded",
      method: "UPI",
      date: "2023-06-09 16:30",
      reference: "UPI654321987",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Processing</h1>
          <p className="text-gray-600 mt-1">Monitor and manage payment transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search payments..." className="pl-8 w-64" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Payment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Processing</p>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-gray-500">₹1,45,000</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-2xl font-bold">156</p>
              <p className="text-xs text-gray-500">₹18,45,000</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-gray-500">₹95,000</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Failed</p>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-gray-500">₹45,000</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Refunded</p>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-gray-500">₹28,500</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
          <TabsTrigger value="refunded">Refunded</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.user}</TableCell>
                        <TableCell>{payment.artist}</TableCell>
                        <TableCell className="font-medium">{payment.amount}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              payment.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : payment.status === "processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : payment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : payment.status === "failed"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-purple-100 text-purple-800"
                            }
                          >
                            {payment.status === "completed" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : payment.status === "processing" ? (
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            ) : payment.status === "failed" ? (
                              <XCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 mr-1" />
                            )}
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell className="text-sm">{payment.date}</TableCell>
                        <TableCell className="text-sm font-mono">{payment.reference}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            {payment.status === "failed" && (
                              <Button variant="outline" size="sm" className="text-blue-600">
                                Retry
                              </Button>
                            )}
                            {payment.status === "completed" && (
                              <Button variant="outline" size="sm" className="text-red-600">
                                Refund
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-end space-x-2 py-4 px-4">
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
        <TabsContent value="processing">
          <Card>
            <CardContent className="p-6">
              <p>Processing payments will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardContent className="p-6">
              <p>Completed payments will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card>
            <CardContent className="p-6">
              <p>Pending payments will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="failed">
          <Card>
            <CardContent className="p-6">
              <p>Failed payments will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="refunded">
          <Card>
            <CardContent className="p-6">
              <p>Refunded payments will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
