"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Users, UserPlus, Activity, CreditCard, DollarSign } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function AdminDashboard() {
  const [totalArtists, setTotalArtists] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalContacts, setTotalContacts] = useState(0);
  const [recentPayments, setRecentPayments] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    // Fetch artists
    fetch("https://api.wedmacindia.com/api/admin/artists/?Status=all", {
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then(res => res.json())
      .then(data => setTotalArtists(data.length))
      .catch(err => console.error("Error fetching artists:", err));

    // Fetch leads
    fetch("https://api.wedmacindia.com/api/leads/list/", {
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then(res => res.json())
      .then(data => setTotalLeads(data.count))
      .catch(err => console.error("Error fetching leads:", err));

    // Fetch contact submissions
    fetch("https://api.wedmacindia.com/api/public/get-contact-submissions/", {
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then(res => res.json())
      .then(data => setTotalContacts(data.data.length))
      .catch(err => console.error("Error fetching contacts:", err));

    // Fetch recent payments
    fetch("https://api.wedmacindia.com/api/artists/admin/payments/history/?page=1", {
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then(res => res.json())
      .then(data => {
        // Take latest 5 transactions
        setRecentPayments(data.results.slice(0, 5));
      })
      .catch(err => console.error("Error fetching payments:", err));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business today.</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Artists */}
        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Active Artists</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 text-white group-hover:scale-110 transition-transform duration-300">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">{totalArtists}</div>
            <Progress value={100} className="h-2 mt-3" />
          </CardContent>
        </Card>

        {/* Total Leads */}
        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 text-white group-hover:scale-110 transition-transform duration-300">
                <UserPlus className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">{totalLeads}</div>
            <Progress value={100} className="h-2 mt-3" />
          </CardContent>
        </Card>

        {/* Contact Submissions */}
        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Contact Submissions</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">{totalContacts}</div>
            <Progress value={100} className="h-2 mt-3" />
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 group">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">Total Payments</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ₹{totalPayments.toLocaleString()}
            </div>
            <Progress value={100} className="h-2 mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-[#FF6B9D]" />
              <span>Recent Transactions</span>
            </CardTitle>
            <CardDescription>Latest 5 payment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-[#FF6B9D] to-[#FF5A8C] text-white">
                        {payment.artist_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{payment.artist_name}</p>
                      <p className="text-xs text-gray-500">{new Date(payment.created_at).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Plan: {payment.plan}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        payment.payment_status === "success"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : payment.payment_status === "pending"
                          ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }
                    >
                      {payment.payment_status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
