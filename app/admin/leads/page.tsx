"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Filter, MoreHorizontal, Plus, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RawLead = Record<string, any>;

type Lead = {
  id: number | string;
  name: string;
  email?: string;
  phone?: string;
  service?: string;
  location?: string;
  status: "new" | "contacted" | "qualified" | "unqualified" | "converted" | "other";
  source?: string;
  date?: string;
  raw?: RawLead;
};

const API_URL = "http://localhost:8000/api/leads/list/";

const getAuthHeader = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  const token = sessionStorage.getItem("accessToken") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizeStatus = (s: any): Lead["status"] => {
  const st = (s || "").toString().toLowerCase().trim();
  if (!st) return "other";
  if (st.includes("contact")) return "contacted";
  if (st.includes("new")) return "new";
  if (st.includes("qual")) return "qualified";
  if (st.includes("unqual")) return "unqualified";
  if (st.includes("convert")) return "converted";
  return "other";
};

const mapToLead = (raw: RawLead): Lead => {
  // Try common field names (safe fallback to raw object)
  const id = raw.id ?? raw.lead_id ?? raw.pk ?? raw._id ?? Math.random().toString(36).slice(2, 9);
  const name =
    raw.name ??
    raw.client_name ??
    raw.first_name
      ? `${raw.first_name ?? ""} ${raw.last_name ?? ""}`.trim()
      : raw.lead_name ?? raw.full_name ?? raw.customer_name ?? "Unknown";
  const email = raw.email ?? raw.contact_email ?? raw.client_email ?? "";
  const phone = raw.phone ?? raw.contact_no ?? raw.mobile ?? raw.client_phone ?? "";
  const service = raw.service ?? raw.service_name ?? raw.event ?? raw.product ?? "";
  const location = raw.location ?? raw.city ?? raw.address ?? "";
  const source = raw.source ?? raw.lead_source ?? "";
  const date = raw.created_at ?? raw.date ?? raw.booking_date ?? raw.lead_date ?? "";
  const status = normalizeStatus(raw.status ?? raw.lead_status ?? raw.state ?? "");
  return {
    id,
    name,
    email,
    phone,
    service,
    location,
    status,
    source,
    date: date ? String(date).slice(0, 10) : "",
    raw,
  };
};

export default function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    "all" | "new" | "contacted" | "qualified" | "unqualified" | "converted" | "other"
  >("all");

  const [search, setSearch] = useState("");

  // fetch all leads once and on demand (you can add polling or manual refresh)
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        } as Record<string, string>,
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Failed to fetch leads: ${resp.status} ${txt}`);
      }
      const data = await resp.json();
      // backend might return array or paginated object
      const items = Array.isArray(data) ? data : data.results ?? data.data ?? [];
      const mapped = items.map((r: RawLead) => mapToLead(r));
      setLeads(mapped);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to load leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // computed counts
  const counts = useMemo(() => {
    const c = {
      new: 0,
      contacted: 0,
      qualified: 0,
      unqualified: 0,
      converted: 0,
      other: 0,
      total: leads.length,
    };
    for (const l of leads) {
      c[l.status] = (c as any)[l.status] + 1;
    }
    return c;
  }, [leads]);

  // filtered list according to active tab and search
  const filteredLeads = useMemo(() => {
    const byTab =
      activeTab === "all" ? leads : leads.filter((l) => l.status === activeTab);
    if (!search.trim()) return byTab;
    const q = search.trim().toLowerCase();
    return byTab.filter(
      (l) =>
        (l.name || "").toLowerCase().includes(q) ||
        (l.email || "").toLowerCase().includes(q) ||
        (l.phone || "").toLowerCase().includes(q) ||
        (l.service || "").toLowerCase().includes(q) ||
        (l.location || "").toLowerCase().includes(q)
    );
  }, [leads, activeTab, search]);

  const badgeClassForStatus = (s: Lead["status"]) => {
    switch (s) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-purple-100 text-purple-800";
      case "qualified":
        return "bg-green-100 text-green-800";
      case "unqualified":
        return "bg-red-100 text-red-800";
      case "converted":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lead Management</h1>
     
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Lead Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">New Leads</p>
              <p className="text-2xl font-bold">{counts.new}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Contacted</p>
              <p className="text-2xl font-bold">{counts.contacted}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Qualified</p>
              <p className="text-2xl font-bold">{counts.qualified}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Unqualified</p>
              <p className="text-2xl font-bold">{counts.unqualified}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Converted</p>
              <p className="text-2xl font-bold">{counts.converted}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Leads ({counts.total})</TabsTrigger>
          <TabsTrigger value="new">New ({counts.new})</TabsTrigger>
          <TabsTrigger value="contacted">Contacted ({counts.contacted})</TabsTrigger>
          <TabsTrigger value="qualified">Qualified ({counts.qualified})</TabsTrigger>
          <TabsTrigger value="unqualified">Unqualified ({counts.unqualified})</TabsTrigger>
          <TabsTrigger value="converted">Converted ({counts.converted})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader className="pb-2">
              <div className="md:flex block justify-between items-center">
                <CardTitle>Lead List</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search leads..."
                      className="pl-8 w-64"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon" onClick={() => fetchLeads()}>
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="py-6 text-center text-muted-foreground">Loading leads...</div>
              ) : error ? (
                <div className="py-6 text-center text-red-600">{error}</div>
              ) : filteredLeads.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">No leads found.</div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead) => (
                        <TableRow key={String(lead.id)}>
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-xs">{lead.email}</p>
                              <p className="text-xs text-gray-500">{lead.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>{lead.service}</TableCell>
                          <TableCell>{lead.location}</TableCell>
                          <TableCell>
                            <Badge className={badgeClassForStatus(lead.status)}>{lead.status}</Badge>
                          </TableCell>
                          <TableCell>{lead.source}</TableCell>
                          <TableCell>{lead.date}</TableCell>
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
                                <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Change Status</DropdownMenuItem>
                                <DropdownMenuItem>Assign to Artist</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">Delete Lead</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button variant="outline" size="sm" onClick={() => { /* TODO: previous page */ }}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="bg-[#FF6B9D] text-white hover:bg-[#FF5A8C]">
                      1
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { /* TODO: page 2 */ }}>
                      2
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { /* TODO: page 3 */ }}>
                      3
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { /* TODO: next page */ }}>
                      Next
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
