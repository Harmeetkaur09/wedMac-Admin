"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Crown, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";

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

const API_BASE = "https://api.wedmacindia.com";

export default function PaymentPlansPage() {
  const [plans, setPlans] = useState<ApiPlan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ApiPlan | null>(null);
  const [opLoading, setOpLoading] = useState(false);

  // form state (shared for create/edit)
  const blankForm = {
    name: "",
    total_leads: "",
    price: "",
    duration_days: "",
    description: "",
    features: "",
  };
  const [form, setForm] = useState<Record<string, any>>(blankForm);

  const AUTH_TOKEN =
    typeof window !== "undefined"
      ? sessionStorage.getItem("accessToken") || ""
      : "";

  const authHeaders = () => ({
    "Content-Type": "application/json",
    ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {}),
  });

  async function fetchPlans() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/master/list/?type=subscriptions_plan`,
        {
          headers: authHeaders(),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
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
    if (!plans)
      return {
        totalPlans: 0,
        totalLeads: 0,
        totalCreditPoints: 0,
        avgPrice: 0,
        mostPopular: null,
      };

    const totalPlans = plans.length;
    const totalLeads = plans.reduce(
      (acc, p) => acc + (Number(p.total_leads) || 0),
      0
    );
    const totalCreditPoints = plans.reduce(
      (acc, p) => acc + (Number(p.total_credit_points) || 0),
      0
    );
    const prices = plans
      .map((p) =>
        typeof p.price === "string"
          ? parseFloat(p.price.replace(/[^0-9.]/g, ""))
          : Number(p.price)
      )
      .filter((n) => !Number.isNaN(n) && isFinite(n));
    const avgPrice = prices.length
      ? prices.reduce((a, b) => a + b, 0) / prices.length
      : 0;

    const mostPopular =
      plans
        .slice()
        .sort(
          (a, b) => (Number(b.total_leads) || 0) - (Number(a.total_leads) || 0)
        )[0] || null;

    return { totalPlans, totalLeads, totalCreditPoints, avgPrice, mostPopular };
  }, [plans]);

  function formatINR(n?: number) {
    if (!n && n !== 0) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(n));
  }

  function planTypeFromDuration(days?: number | null) {
    if (!days) return "monthly";
    return days >= 365 ? "yearly" : "monthly";
  }

  // helpers for creating/updating/deleting plans
  const createPlan = async (payload: Record<string, any>) => {
    setOpLoading(true);
    try {
      const body = {
        name: payload.name,
        total_leads: payload.total_leads ? Number(payload.total_leads) : 0,
        price: payload.price ? Number(payload.price) : 0,
        duration_days: payload.duration_days ? Number(payload.duration_days) : 0,
        description: payload.description || "",
        features: (payload.features || "")
          .toString()
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
      };

      const res = await fetch(`${API_BASE}/api/admin/subscription-plans/create/`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.detail || data?.message || `Failed: ${res.status}`;
        throw new Error(msg);
      }

      toast.success("Plan created");
      // refresh list (safer than optimistic insert because server may modify shape)
      await fetchPlans();
      setShowCreateModal(false);
      setForm(blankForm);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Create failed");
    } finally {
      setOpLoading(false);
    }
  };

  const updatePlan = async (id: string, payload: Record<string, any>) => {
    setOpLoading(true);
    try {
      const body: Record<string, any> = {};
      // include all fields if present in payload
      if (payload.name !== undefined) body.name = payload.name;
      if (payload.total_leads !== undefined)
        body.total_leads = Number(payload.total_leads);
      if (payload.price !== undefined) body.price = Number(payload.price);
      if (payload.duration_days !== undefined)
        body.duration_days = Number(payload.duration_days);
      if (payload.description !== undefined) body.description = payload.description;
      if (payload.features !== undefined)
        body.features = payload.features
          .toString()
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);

      const res = await fetch(
        `${API_BASE}/api/admin/subscription-plans/${id}/update/`,
        {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(body),
        }
      );

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = data?.detail || data?.message || `Failed: ${res.status}`;
        throw new Error(msg);
      }

      toast.success("Plan updated");
      await fetchPlans();
      setShowEditModal(false);
      setEditingPlan(null);
      setForm(blankForm);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Update failed");
    } finally {
      setOpLoading(false);
    }
  };

  const deletePlan = async (id: string) => {
    const ok = window.confirm("Delete this plan permanently?");
    if (!ok) return;
    setOpLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/subscription-plans/${id}/delete/`,
        {
          method: "DELETE",
          headers: authHeaders(),
        }
      );
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Delete failed: ${res.status} ${txt}`);
      }

      toast.success("Plan deleted");
      await fetchPlans();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Delete failed");
    } finally {
      setOpLoading(false);
    }
  };

  // open create modal
  const openCreate = () => {
    setForm(blankForm);
    setShowCreateModal(true);
  };

  // open edit modal and prefill
  const openEdit = (p: ApiPlan) => {
    setEditingPlan(p);
    setForm({
      name: p.name || "",
      total_leads: String(p.total_leads ?? ""),
      price: String(p.price ?? ""),
      duration_days: String(p.duration_days ?? ""),
      description: p.description ?? "",
      features: (p.features || []).join(", "),
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Plans</h1>
          <p className="text-gray-600 mt-1">Manage subscription plans and pricing</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Plan
          </Button>
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
                const priceNum =
                  typeof plan.price === "string"
                    ? parseFloat(plan.price || "0")
                    : Number(plan.price || 0);
                const type = planTypeFromDuration(plan.duration_days || undefined);
                return (
                  <Card
                    key={plan.id}
                    className={`relative hover:shadow-lg transition-shadow ${
                      plan.name?.toLowerCase().includes("pro") ? "ring-2 ring-[#FF6B9D]" : ""
                    }`}
                  >
                    {plan.name?.toLowerCase().includes("pro") && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-[#FF6B9D] text-white px-3 py-1">
                          <Star className="h-3 w-3 mr-1" /> Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-2">
                      <div className="flex items-center justify-center gap-2">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        {plan.name?.toLowerCase().includes("Pro") && (
                          <Crown className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>

                      <div className="text-3xl font-bold text-[#FF6B9D]">
                        {isNaN(priceNum) ? "-" : formatINR(priceNum)}
                        <span className="text-sm text-gray-500 font-normal">/{type === "monthly" ? "plan" : "year"}</span>
                      </div>
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
                        <p className="text-sm text-gray-600"><span className="font-medium">{plan.total_leads ?? 0}</span> leads</p>
                        <p className="text-xs text-gray-500">Duration: {plan.duration_days ?? "-"} days</p>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(plan)}>
                          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => deletePlan(plan.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
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
                <div key={plan.id}>
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
      </Tabs>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-xl bg-white rounded p-6">
            <h3 className="text-lg font-bold mb-4">Create Subscription Plan</h3>
            <div className="grid grid-cols-1 gap-3">
              <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
              <input className="border p-2 rounded" placeholder="Total leads (number)" value={form.total_leads} onChange={(e) => setForm((s) => ({ ...s, total_leads: e.target.value }))} />
              <input className="border p-2 rounded" placeholder="Price (e.g. 5999.00)" value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))} />
              <input className="border p-2 rounded" placeholder="Duration (days)" value={form.duration_days} onChange={(e) => setForm((s) => ({ ...s, duration_days: e.target.value }))} />
              <input className="border p-2 rounded" placeholder="Description" value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
              <input className="border p-2 rounded" placeholder="Features (comma separated)" value={form.features} onChange={(e) => setForm((s) => ({ ...s, features: e.target.value }))} />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button className="bg-[#FF6B9D] text-white" disabled={opLoading} onClick={() => createPlan(form)}>{opLoading ? "Creating..." : "Create"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-xl bg-white rounded p-6">
            <h3 className="text-lg font-bold mb-4">Edit Plan: {editingPlan.name}</h3>
            <div className="grid grid-cols-1 gap-3">
              <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
              <input className="border p-2 rounded" placeholder="Total leads (number)" value={form.total_leads} onChange={(e) => setForm((s) => ({ ...s, total_leads: e.target.value }))} />
              <input className="border p-2 rounded" placeholder="Price (e.g. 5999.00)" value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))} />
              <input className="border p-2 rounded" placeholder="Duration (days)" value={form.duration_days} onChange={(e) => setForm((s) => ({ ...s, duration_days: e.target.value }))} />
              <input className="border p-2 rounded" placeholder="Description" value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
              <input className="border p-2 rounded" placeholder="Features (comma separated)" value={form.features} onChange={(e) => setForm((s) => ({ ...s, features: e.target.value }))} />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => { setShowEditModal(false); setEditingPlan(null); }}>Cancel</Button>
              <Button className="bg-[#FF6B9D] text-white" disabled={opLoading} onClick={() => updatePlan(editingPlan.id, form)}>{opLoading ? "Updating..." : "Update"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
