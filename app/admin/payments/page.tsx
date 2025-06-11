import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Filter, MoreHorizontal, Plus, Search, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PaymentManagement() {
  const transactions = [
    {
      id: "TRX-001",
      customer: "Anjali Patel",
      email: "anjali@example.com",
      amount: "₹12,000",
      status: "completed",
      date: "2023-06-10",
      method: "Credit Card",
      type: "Booking",
    },
    {
      id: "TRX-002",
      customer: "Ritu Sharma",
      email: "ritu@example.com",
      amount: "₹8,500",
      status: "processing",
      date: "2023-06-09",
      method: "UPI",
      type: "Booking",
    },
    {
      id: "TRX-003",
      customer: "Avneet Kaur",
      email: "avneet@example.com",
      amount: "₹2,999",
      status: "completed",
      date: "2023-06-08",
      method: "Net Banking",
      type: "Subscription",
    },
    {
      id: "TRX-004",
      customer: "Priya Sharma",
      email: "priya@example.com",
      amount: "₹1,499",
      status: "completed",
      date: "2023-06-07",
      method: "Credit Card",
      type: "Subscription",
    },
    {
      id: "TRX-005",
      customer: "Neha Singh",
      email: "neha@example.com",
      amount: "₹9,200",
      status: "failed",
      date: "2023-06-06",
      method: "Debit Card",
      type: "Booking",
    },
    {
      id: "TRX-006",
      customer: "Meera Joshi",
      email: "meera@example.com",
      amount: "₹7,500",
      status: "refunded",
      date: "2023-06-05",
      method: "UPI",
      type: "Booking",
    },
    {
      id: "TRX-007",
      customer: "Kavita Verma",
      email: "kavita@example.com",
      amount: "₹2,999",
      status: "completed",
      date: "2023-06-04",
      method: "Net Banking",
      type: "Subscription",
    },
  ]

  const subscriptionPlans = [
    {
      id: 1,
      name: "Basic",
      price: "₹1,499",
      period: "monthly",
      features: ["Profile Listing", "Basic Analytics", "5 Leads per month", "Email Support"],
      status: "active",
      subscribers: 124,
    },
    {
      id: 2,
      name: "Professional",
      price: "₹2,999",
      period: "monthly",
      features: [
        "Premium Profile Listing",
        "Advanced Analytics",
        "25 Leads per month",
        "Priority Email Support",
        "Featured in Search Results",
      ],
      status: "active",
      subscribers: 86,
    },
    {
      id: 3,
      name: "Premium",
      price: "₹4,999",
      period: "monthly",
      features: [
        "VIP Profile Listing",
        "Comprehensive Analytics",
        "Unlimited Leads",
        "24/7 Phone Support",
        "Featured in Homepage",
        "Dedicated Account Manager",
      ],
      status: "active",
      subscribers: 42,
    },
    {
      id: 4,
      name: "Enterprise",
      price: "Custom",
      period: "annual",
      features: [
        "Custom Profile Design",
        "White-label Solutions",
        "API Access",
        "Dedicated Support Team",
        "Custom Analytics Dashboard",
      ],
      status: "inactive",
      subscribers: 8,
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payment Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Transactions
          </Button>
          <Button className="bg-[#FF6B9D] hover:bg-[#FF5A8C]">
            <Plus className="mr-2 h-4 w-4" />
            Create New Plan
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Payment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold">₹4,58,750</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Active Subscriptions</p>
              <p className="text-2xl font-bold">252</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Pending Payments</p>
              <p className="text-2xl font-bold">18</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Refunded Amount</p>
              <p className="text-2xl font-bold">₹24,500</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions" className="mb-6">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscription Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Transaction History</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search transactions..." className="pl-8 w-64" />
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
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>
                        <div>
                          <p>{transaction.customer}</p>
                          <p className="text-xs text-gray-500">{transaction.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : transaction.status === "processing"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : transaction.status === "failed"
                                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.method}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            transaction.type === "Booking"
                              ? "border-purple-500 text-purple-500"
                              : "border-blue-500 text-blue-500"
                          }
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
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
                            <DropdownMenuItem>Send Receipt</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Process Refund</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Void Transaction</DropdownMenuItem>
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
        <TabsContent value="subscriptions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className={plan.id === 2 ? "border-[#FF6B9D] shadow-lg" : ""}>
                {plan.id === 2 && (
                  <div className="bg-[#FF6B9D] text-white text-center py-1 text-sm font-medium">Most Popular</div>
                )}
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{plan.name}</span>
                    <Badge
                      className={plan.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {plan.status}
                    </Badge>
                  </CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-500 mb-2">
                        <span className="font-medium text-gray-700">{plan.subscribers}</span> active subscribers
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          Edit
                        </Button>
                        <Button
                          className={
                            plan.status === "active"
                              ? "bg-red-500 hover:bg-red-600 flex-1"
                              : "bg-green-500 hover:bg-green-600 flex-1"
                          }
                        >
                          {plan.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
