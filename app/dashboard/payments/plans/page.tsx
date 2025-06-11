import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Crown, Star } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PaymentPlansPage() {
  const plans = [
    {
      id: 1,
      name: "Basic Plan",
      type: "monthly",
      price: "₹999",
      features: ["Up to 5 bookings per month", "Basic profile listing", "Email support", "Standard commission rate"],
      status: "active",
      subscribers: 45,
      popular: false,
    },
    {
      id: 2,
      name: "Professional Plan",
      type: "monthly",
      price: "₹2,499",
      features: [
        "Up to 15 bookings per month",
        "Featured profile listing",
        "Priority support",
        "Reduced commission rate",
        "Analytics dashboard",
      ],
      status: "active",
      subscribers: 128,
      popular: true,
    },
    {
      id: 3,
      name: "Premium Plan",
      type: "monthly",
      price: "₹4,999",
      features: [
        "Unlimited bookings",
        "Top profile placement",
        "24/7 phone support",
        "Lowest commission rate",
        "Advanced analytics",
        "Marketing tools",
      ],
      status: "active",
      subscribers: 67,
      popular: false,
    },
    {
      id: 4,
      name: "Annual Basic",
      type: "yearly",
      price: "₹9,999",
      features: ["All Basic Plan features", "2 months free", "Annual billing discount"],
      status: "active",
      subscribers: 23,
      popular: false,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Plans</h1>
          <p className="text-gray-600 mt-1">Manage subscription plans and pricing</p>
        </div>
        <Button className="bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] hover:from-[#FF5A8C] hover:to-[#FF4979] shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Create New Plan
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Plan Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Plans</p>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-gray-500">4 active, 4 draft</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Total Subscribers</p>
              <p className="text-2xl font-bold">263</p>
              <p className="text-xs text-gray-500">+18 this month</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Monthly Revenue</p>
              <p className="text-2xl font-bold">₹4,56,780</p>
              <p className="text-xs text-gray-500">+12% from last month</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Most Popular</p>
              <p className="text-lg font-bold">Professional</p>
              <p className="text-xs text-gray-500">128 subscribers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Plans</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative hover:shadow-lg transition-shadow ${plan.popular ? "ring-2 ring-[#FF6B9D]" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#FF6B9D] text-white px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <div className="flex items-center justify-center gap-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    {plan.name.includes("Premium") && <Crown className="h-5 w-5 text-yellow-500" />}
                  </div>
                  <div className="text-3xl font-bold text-[#FF6B9D]">
                    {plan.price}
                    <span className="text-sm text-gray-500 font-normal">
                      /{plan.type === "monthly" ? "month" : "year"}
                    </span>
                  </div>
                  <Badge
                    className={plan.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {plan.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Features:</p>
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{plan.subscribers}</span> subscribers
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="monthly">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans
              .filter((plan) => plan.type === "monthly")
              .map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative hover:shadow-lg transition-shadow ${plan.popular ? "ring-2 ring-[#FF6B9D]" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#FF6B9D] text-white px-3 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-[#FF6B9D]">
                      {plan.price}
                      <span className="text-sm text-gray-500 font-normal">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Features:</p>
                      <ul className="space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{plan.subscribers}</span> subscribers
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="yearly">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans
              .filter((plan) => plan.type === "yearly")
              .map((plan) => (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-[#FF6B9D]">
                      {plan.price}
                      <span className="text-sm text-gray-500 font-normal">/year</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Features:</p>
                      <ul className="space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{plan.subscribers}</span> subscribers
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="draft">
          <Card>
            <CardContent className="p-6">
              <p>Draft plans will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
