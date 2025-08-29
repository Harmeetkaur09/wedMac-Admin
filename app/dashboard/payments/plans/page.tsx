"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Crown, Star, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ApiPlan = {
  id: string;
  name: string;
  total_leads: number | null;
  total_credit_points: number | null;
  price: string | number | null;
  duration_days: number | null;
  description?: string | null;
  features?: string[];
  created_at?: string | null;
};

export default function PaymentPlansPage() {
  const [plans, setPlans] = useState<ApiPlan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If you already store token in sessionStorage use that key. Otherwise paste token below.
  // NOTE: Replace '<PASTE_TOKEN_IF_NEEDED>' with your actual token or keep sessionStorage approach.
  const AUTH_TOKEN =
    typeof window !== "undefined"
      ? sessionStorage.getItem("accessToken") || "<PASTE_TOKEN_IF_NEEDED>"
      : "";

  async function fetchPlans() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://wedmac-be.onrender.com/api/admin/master/list/?type=subscriptions_plan",
        {
          headers: {
            "Content-Type": "application/json",
            ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {}),
          },
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      // API returns an array — guard against different shapes
      if (Array.isArray(json)) setPlans(json as ApiPlan[]);
      else if (Array.isArray(json.data)) setPlans(json.data as ApiPlan[]);
      else setPlans([]);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || String(e));
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    if (!plans) return { totalPlans: 0, totalLeads: 0, totalCreditPoints: 0, avgPrice: 0, mostPopular: null };

    const totalPlans = plans.length;
    const totalLeads = plans.reduce((acc, p) => acc + (Number(p.total_leads) || 0), 0);
    const totalCreditPoints = plans.reduce((acc, p) => acc + (Number(p.total_credit_points) || 0), 0);
    const prices = plans
      .map((p) => (typeof p.price === "string" ? parseFloat(p.price.replace(/[^0-9.]/g, "")) : Number(p.price)))
      .filter((n) => !Number.isNaN(n) && isFinite(n));
    const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

    // pick most popular by total_leads (fallback to price if no leads)
    const mostPopular = plans
      .slice()
      .sort((a, b) => (Number(b.total_leads) || 0) - (Number(a.total_leads) || 0))[0] || null;

    return { totalPlans, totalLeads, totalCreditPoints, avgPrice, mostPopular };
  }, [plans]);

  function formatINR(n?: number) {
    if (!n && n !== 0) return "-";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
      Math.round(n)
    );
  }

  function planTypeFromDuration(days?: number | null) {
    if (!days) return "monthly";
    return days >= 365 ? "yearly" : "monthly";
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Plans</h1>
          <p className="text-gray-600 mt-1">Manage subscription plans and pricing</p>
        </div>
      
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Plan Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Plans</p>
              <p className="text-2xl font-bold">{plans ? stats.totalPlans : "-"}</p>
              <p className="text-xs text-gray-500">Fetched from API</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Total Leads (sum)</p>
              <p className="text-2xl font-bold">{plans ? stats.totalLeads : "-"}</p>
              <p className="text-xs text-gray-500">Sum of <code>total_leads</code> from plans</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Average Price</p>
              <p className="text-2xl font-bold">{plans ? formatINR(stats.avgPrice) : "-"}</p>
              <p className="text-xs text-gray-500">Average of plan prices</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Most Popular</p>
              <p className="text-lg font-bold">{plans && stats.mostPopular ? stats.mostPopular.name : "-"}</p>
              <p className="text-xs text-gray-500">Based on highest <code>total_leads</code></p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Plans</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
          {/* <TabsTrigger value="draft">Draft</TabsTrigger> */}
        </TabsList>

        <TabsContent value="all">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading plans...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">Error: {error}</div>
          ) : !plans || plans.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No plans found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const priceNum = typeof plan.price === "string" ? parseFloat(plan.price || "0") : Number(plan.price || 0);
                const type = planTypeFromDuration(plan.duration_days || undefined);
                return (
                  <Card
                    key={plan.id}
                    className={`relative hover:shadow-lg transition-shadow ${plan.name?.toLowerCase().includes("pro") ? "ring-2 ring-[#FF6B9D]" : ""}`}
                  >
                    {plan.name?.toLowerCase().includes("pro") && (
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
                        {plan.name?.toLowerCase().includes("Pro") && <Crown className="h-5 w-5 text-yellow-500" />}
                      </div>

                      <div className="text-3xl font-bold text-[#FF6B9D]">
                        {isNaN(priceNum) ? "-" : formatINR(priceNum)}
                        <span className="text-sm text-gray-500 font-normal">/{type === "monthly" ? "plan" : "year"}</span>
                      </div>

                      {/* <Badge className={"bg-green-100 text-green-800 mt-2"}>active</Badge> */}
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Features:</p>
                        <ul className="space-y-1">
                          {(plan.features || []).map((feature, index) => (
                            <li key={index} className="text-sm flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{plan.total_leads ?? 0}</span> leads
                        </p>
                        <p className="text-xs text-gray-500">Duration: {plan.duration_days ?? "-"} days</p>
                      </div>

                      {/* <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => alert(`Edit plan ${plan.name} (implement edit UI)`)}
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => alert(`Delete plan ${plan.name} (implement API call)`)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div> */}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="monthly">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(plans || [])
              .filter((p) => planTypeFromDuration(p.duration_days) === "monthly")
              .map((plan) => (
                <div key={plan.id}>{/* reuse same card UI as above - simplified for brevity */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-[#FF6B9D]">{formatINR(Number(plan.price) || 0)}<span className="text-sm text-gray-500 font-normal">/plan</span></div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="yearly">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(plans || [])
              .filter((p) => planTypeFromDuration(p.duration_days) === "yearly")
              .map((plan) => (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-[#FF6B9D]">{formatINR(Number(plan.price) || 0)}<span className="text-sm text-gray-500 font-normal">/year</span></div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{plan.description}</p>
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
  );
}
