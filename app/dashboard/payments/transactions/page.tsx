import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, Download, TrendingUp, TrendingDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TransactionHistoryPage() {
  const transactions = [
    {
      id: "TXN001",
      type: "booking",
      user: "Anjali Patel",
      artist: "Avneet Kaur",
      amount: "₹15,000",
      commission: "₹1,500",
      netAmount: "₹13,500",
      status: "completed",
      date: "2023-06-10",
      paymentMethod: "UPI",
    },
    {
      id: "TXN002",
      type: "subscription",
      user: "Priya Sharma",
      artist: null,
      amount: "₹2,499",
      commission: "₹0",
      netAmount: "₹2,499",
      status: "completed",
      date: "2023-06-10",
      paymentMethod: "Credit Card",
    },
    {
      id: "TXN003",
      type: "booking",
      user: "Kavita Singh",
      artist: "Meera Joshi",
      amount: "₹12,000",
      commission: "₹1,200",
      netAmount: "₹10,800",
      status: "refunded",
      date: "2023-06-09",
      paymentMethod: "Net Banking",
    },
    {
      id: "TXN004",
      type: "booking",
      user: "Pooja Verma",
      artist: "Neha Singh",
      amount: "₹20,000",
      commission: "₹2,000",
      netAmount: "₹18,000",
      status: "completed",
      date: "2023-06-09",
      paymentMethod: "Wallet",
    },
    {
      id: "TXN005",
      type: "subscription",
      user: "Meera Joshi",
      artist: null,
      amount: "₹4,999",
      commission: "₹0",
      netAmount: "₹4,999",
      status: "completed",
      date: "2023-06-08",
      paymentMethod: "UPI",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600 mt-1">View and analyze all financial transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search transactions..." className="pl-8 w-64" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Transaction Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold">₹18,45,000</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-gray-500">+12% from last month</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Commission Earned</p>
                  <p className="text-2xl font-bold">₹1,84,500</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500">10% of total revenue</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Transactions</p>
                  <p className="text-2xl font-bold">1,245</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-gray-500">+45 this week</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Refunds</p>
                  <p className="text-2xl font-bold">₹28,500</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-xs text-gray-500">1.5% of total revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <Select defaultValue="last30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last7">Last 7 days</SelectItem>
                  <SelectItem value="last30">Last 30 days</SelectItem>
                  <SelectItem value="last90">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Transaction Type</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="booking">Bookings</SelectItem>
                  <SelectItem value="subscription">Subscriptions</SelectItem>
                  <SelectItem value="refund">Refunds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Payment Method</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="netbanking">Net Banking</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Net Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.user}</TableCell>
                        <TableCell>{transaction.artist || <span className="text-gray-400">-</span>}</TableCell>
                        <TableCell className="font-medium">{transaction.amount}</TableCell>
                        <TableCell className="text-sm">{transaction.commission}</TableCell>
                        <TableCell className="font-medium text-green-600">{transaction.netAmount}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              transaction.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : transaction.status === "failed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-purple-100 text-purple-800"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{transaction.date}</TableCell>
                        <TableCell className="text-sm">{transaction.paymentMethod}</TableCell>
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
        <TabsContent value="bookings">
          <Card>
            <CardContent className="p-6">
              <p>Booking transactions will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subscriptions">
          <Card>
            <CardContent className="p-6">
              <p>Subscription transactions will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="refunds">
          <Card>
            <CardContent className="p-6">
              <p>Refund transactions will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
