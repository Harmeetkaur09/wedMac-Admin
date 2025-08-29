"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, Download, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PaymentRecord = {
  id: number;
  artist_id: number;
  artist_name: string;
  plan: string;
  amount: number | null;
  payment_status: string; // pending | success | failed | etc
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
  razorpay_order_id?: string | null;
  payment_method?: string | null; // optional fallback if API provides
};

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<PaymentRecord[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<PaymentRecord[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");

  // pagination
  const [page, setPage] = useState<number>(1);
  const pageSize = 20; // adjust if API returns different page size

  // filters
  const [dateRange, setDateRange] = useState<string>("last30");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [txType, setTxType] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentMethod, setPaymentMethod] = useState<string>("all");

  // token: tries sessionStorage.accessToken, otherwise use placeholder
  const AUTH_TOKEN = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") || "<PASTE_TOKEN_HERE>" : "";

  function buildFetchUrl(p = 1) {
    const url = new URL("https://api.wedmacindia.com/api/artists/admin/payments/history/");
    url.searchParams.set("page", String(p));
    // If API supports server-side filtering by payment_status or plan, include those params.
    // These are best-effort — if the backend ignores unknown params it's safe.
    if (statusFilter && statusFilter !== "all") url.searchParams.set("payment_status", statusFilter);
    if (txType && txType !== "all") url.searchParams.set("plan", txType);
    // For custom dates pass start/end as ISO if supplied
    if (dateRange === "custom" && customStart) url.searchParams.set("start_date", customStart);
    if (dateRange === "custom" && customEnd) url.searchParams.set("end_date", customEnd);
    return url.toString();
  }

  async function fetchPayments(p = 1) {
    setLoading(true);
    setError(null);
    try {
      const url = buildFetchUrl(p);

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {}),
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      // Expecting { total: number, results: PaymentRecord[] }
      setTotal(typeof json.total === "number" ? json.total : 0);
      setTransactions(Array.isArray(json.results) ? json.results : []);
    } catch (e: any) {
      console.error("fetchPayments error", e);
      setError(e?.message || String(e));
      setTransactions([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // fetch when page or server-side-able filters change
    fetchPayments(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, txType, customStart, customEnd]);

  // client-side filtering (applied after fetch). This ensures filters always work even
  // if the API doesn't support the specific query params.
  useEffect(() => {
    function applyFilters(list: PaymentRecord[]) {
      const now = new Date();
      let start: Date | null = null;
      let end: Date | null = null;

      if (dateRange === "today") {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(start);
        end.setDate(end.getDate() + 1);
      } else if (dateRange === "last7") {
        end = new Date(now);
        start = new Date(now);
        start.setDate(start.getDate() - 7);
      } else if (dateRange === "last30") {
        end = new Date(now);
        start = new Date(now);
        start.setDate(start.getDate() - 30);
      } else if (dateRange === "last90") {
        end = new Date(now);
        start = new Date(now);
        start.setDate(start.getDate() - 90);
      } else if (dateRange === "custom") {
        if (customStart) start = new Date(customStart);
        if (customEnd) {
          end = new Date(customEnd);
          // include entire day
          end.setDate(end.getDate() + 1);
        }
      }

      return list.filter((t) => {
        // search
        if (query) {
          const q = query.toLowerCase();
          const matchesSearch = String(t.id).includes(q) || (t.artist_name || "").toLowerCase().includes(q) || (t.plan || "").toLowerCase().includes(q) || (t.razorpay_order_id || "").toLowerCase().includes(q);
          if (!matchesSearch) return false;
        }

        // status
        if (statusFilter !== "all" && (t.payment_status || "").toLowerCase() !== statusFilter.toLowerCase()) return false;

        // txType -> we map 'subscriptions' to any record with plan present; 'bookings' would be if plan is empty
        if (txType !== "all") {
          if (txType === "subscriptions") {
            if (!t.plan) return false;
          } else if (txType === "bookings") {
            if (t.plan) return false;
          } else {
            // allow direct plan name match
            if ((t.plan || "").toLowerCase() !== txType.toLowerCase()) return false;
          }
        }

        // payment method (only if field exists in response)
        if (paymentMethod !== "all") {
          if (((t.payment_method || "") as string).toLowerCase() !== paymentMethod.toLowerCase()) return false;
        }

        // date range check (use created_at primarily)
        if (start || end) {
          const d = t.created_at ? new Date(t.created_at) : null;
          if (!d) return false;
          if (start && d < start) return false;
          if (end && d >= end) return false;
        }

        return true;
      });
    }

    const result = applyFilters(transactions);
    setFilteredTransactions(result);
  }, [transactions, query, dateRange, customStart, customEnd, txType, statusFilter, paymentMethod]);

  // derived stats from filtered results
  const stats = useMemo(() => {
    const totalPayments = filteredTransactions.length;
    const pending = filteredTransactions.filter((t) => t.payment_status === "pending").length;
    const success = filteredTransactions.filter((t) => t.payment_status === "success").length;
    const failed = filteredTransactions.filter((t) => t.payment_status === "failed").length;
    const active = filteredTransactions.filter((t) => t.is_active).length;
    return { totalPayments, pending, success, failed, active };
  }, [filteredTransactions]);

  function formatDate(iso?: string | null) {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  }

  function statusBadge(status: string) {
    const s = status?.toLowerCase();
    if (s === "success") return <Badge className="bg-green-100 text-green-800">Success</Badge>;
    if (s === "pending") return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    if (s === "failed") return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
    return <Badge className="bg-gray-100 text-gray-800 capitalize">{status}</Badge>;
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          {/* <p className="text-gray-600 mt-1">Payments history (filters apply to server when supported; client-side fallback always active)</p> */}
        </div>
        <div className="flex gap-2">
    
         
      
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Transaction Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Records (server)</p>
              <p className="text-2xl font-bold">{total ?? "-"}</p>
              <p className="text-xs text-gray-500">Total rows reported by API</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-gray-500">Awaiting payment (filtered)</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Successful</p>
              <p className="text-2xl font-bold">{stats.success}</p>
              <p className="text-xs text-gray-500">Completed payments (filtered)</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Active</p>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-gray-500">Active subscriptions (filtered)</p>
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
              <Select defaultValue={dateRange} onValueChange={(v) => { setDateRange(v); if (v !== 'custom') { setCustomStart(''); setCustomEnd(''); } setPage(1); }}>
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

              {dateRange === "custom" && (
                <div className="mt-2 space-y-2">
                  <input type="date" className="w-full p-2 border rounded" value={customStart} onChange={(e) => { setCustomStart(e.target.value); setPage(1); }} />
                  <input type="date" className="w-full p-2 border rounded" value={customEnd} onChange={(e) => { setCustomEnd(e.target.value); setPage(1); }} />
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Transaction Type</label>
              <Select defaultValue={txType} onValueChange={(v) => { setTxType(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
  
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select defaultValue={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
                <Search className="absolute left-2 top-2.5 text-gray-400" />
            <Input placeholder="Search by id / artist / plan..." className="pl-8" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
 
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-6 text-center text-gray-500">Loading...</div>
                ) : error ? (
                  <div className="p-6 text-center text-red-500">Error: {error}</div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No transactions found.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Record ID</TableHead>
                        <TableHead>Artist</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead>End</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Razorpay</TableHead>
                        {/* <TableHead>Method</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((t) => (
                        <TableRow key={t.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium">{t.id}</TableCell>
                          <TableCell>{t.artist_name}</TableCell>
                          <TableCell>{t.plan}</TableCell>
                          <TableCell>{statusBadge(t.payment_status)}</TableCell>
                          <TableCell>{t.is_active ? <Badge className="bg-green-100 text-green-800">Active</Badge> : <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>}</TableCell>
                          <TableCell className="text-sm">{formatDate(t.start_date)}</TableCell>
                          <TableCell className="text-sm">{formatDate(t.end_date)}</TableCell>
                          <TableCell className="text-sm">{formatDate(t.created_at)}</TableCell>
                          <TableCell className="text-sm">{t.razorpay_order_id ?? "-"}</TableCell>
                          {/* <TableCell className="text-sm">{t.payment_method ?? "-"}</TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              <div className="flex items-center justify-between space-x-2 py-4 px-4">
                <div className="text-sm text-gray-600">Showing page {page} of {totalPages} • {filteredTransactions.length} records (on current page)</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-[#FF6B9D] text-white hover:bg-[#FF5A8C]" onClick={() => setPage(1)}>
                    1
                  </Button>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardContent className="p-6">
              <p>Subscription transactions will be displayed here. Use filters above to narrow down.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardContent className="p-6">
              <p>Pending payments only. (Use filter or search to view specific records.)</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="successful">
          <Card>
            <CardContent className="p-6">
              <p>Successful payments only.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
