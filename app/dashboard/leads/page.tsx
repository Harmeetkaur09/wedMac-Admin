"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

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
type Artist = {
  phone?: string;
  id: number | string;
  name: string;
};

type Lead = {
  booking_date: string;
  id: number | string;
  name: string;
  email?: string | null;
  phone?: string | null;
  service?: string;
  location?: string;
  status:
    | "new"
    | "contacted"
    | "qualified"
    | "unqualified"
    | "converted"
    | "other";
  source?: string;
  date?: string;
  // New fields:
  maxClaims?: number | null;
  claimedCount?: number | null;
  budget?: number | null; 
  budgetMax?: number | null; 
  raw?: RawLead;
  assigned_to?: {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
  } | null;};

const API_URL = "https://api.wedmacindia.com/api/leads/list/";
// base used for update endpoints (matches your examples)
const UPDATE_URL_BASE = "https://api.wedmacindia.com/api/leads";

const getAuthHeader = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  const token =
    sessionStorage.getItem("accessToken") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const parseNumber = (v: any): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const normalizeStatus = (s: any): Lead["status"] => {
  const st = (s ?? "").toString().toLowerCase().trim();
  if (!st) return "other";
  if (st.includes("contact")) return "contacted";
  if (st.includes("new")) return "new";
  if (st.includes("qual")) return "qualified";
  if (st.includes("unqual")) return "unqualified";
  if (st.includes("convert")) return "converted";
  return "other";
};

const mapToLead = (raw: RawLead): Lead => {
  const id =
    raw.id ??
    raw.lead_id ??
    raw.pk ??
    raw._id ??
    Math.random().toString(36).slice(2, 9);

  let name = "Unknown";
  if (
    (raw.first_name && String(raw.first_name).trim()) ||
    (raw.last_name && String(raw.last_name).trim())
  ) {
    name = `${raw.first_name ?? ""} ${raw.last_name ?? ""}`.trim();
  } else if (raw.name) {
    name = String(raw.name);
  } else if (raw.client_name) {
    name = String(raw.client_name);
  } else if (raw.lead_name) {
    name = String(raw.lead_name);
  }

  const email = raw.email ?? raw.contact_email ?? raw.client_email ?? null;
  const phone =
    raw.phone ?? raw.contact_no ?? raw.mobile ?? raw.client_phone ?? null;
  const service =
    raw.service && typeof raw.service !== "object"
      ? String(raw.service)
      : raw.event_type ?? "";
  const location =
    raw.location_name ??
    raw.location_text ??
    (raw.location ? String(raw.location) : "");
  const source = raw.source ?? raw.lead_source ?? "";
  const date =
    raw.created_at ?? raw.date ?? raw.booking_date ?? raw.lead_date ?? "";
  const status = normalizeStatus(
    raw.status ?? raw.lead_status ?? raw.state ?? ""
  );

  // New numeric fields (try multiple possible raw keys)
  const maxClaims = parseNumber(
    raw.max_claims ?? raw.maxClaims ?? raw.maxclaim ?? raw.max_claim
  );
  const claimedCount = parseNumber(
    raw.claimed_count ?? raw.claimedCount ?? raw.claims_count ?? raw.claims
  );
const budget = parseNumber(raw.budget ?? raw.estimated_budget ?? raw.project_budget);

// agar budget_range hai to uska max_value nikaal lo
const budgetMax = parseNumber(
  raw.budget_range?.max_value ?? raw.max_budget ?? raw.budgetMax
);
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
    maxClaims,
    claimedCount,
    budget,
    budgetMax,
    assigned_to: raw.assigned_to ?? null,
    raw,
    booking_date: raw.booking_date ? String(raw.booking_date).slice(0, 10) : "",
  };
};

export default function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
const [artists, setArtists] = useState<Artist[]>([]);
const [loadingArtists, setLoadingArtists] = useState(false);
  // FIXED: include "contacted" in union
  const [activeTab, setActiveTab] = useState<
    | "all"
    | "new"
    | "contacted"
    | "qualified"
    | "unqualified"
    | "converted"
    | "other"
  >("all");

  // search + (we'll keep tabs + a dynamic status row that sets the same tab)
  const [search, setSearch] = useState("");
const [assigningLead, setAssigningLead] = useState<Lead | null>(null);
const [selectedArtist, setSelectedArtist] = useState<string>("");
  // NEW: toggle to show/hide contacted books list
  const [showContactedBooks, setShowContactedBooks] = useState(false);
const hasFetched = useRef(false);

const fetchArtists = async () => {
  setLoadingArtists(true);
  try {
    const resp = await fetch(
      "https://api.wedmacindia.com/api/admin/artists/?status=approved",
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }
    );
    if (!resp.ok) throw new Error("Failed to fetch artists");
    const data = await resp.json();
    const items = Array.isArray(data)
      ? data
      : data.results ?? data.data ?? [];

  const mapped = items.map((a: any) => ({
  id: a.id ?? a.pk ?? a._id,
  name:
    a.name && a.name.trim()
      ? a.name
      : `${a.first_name ?? ""} ${a.last_name ?? ""}`.trim() || "Unnamed",
  phone: a.phone ?? a.contact_no ?? a.mobile ?? "-",
}));


    setArtists(mapped);
  } catch (err) {
    console.error(err);
    setArtists([]);
  } finally {
    setLoadingArtists(false);
  }
};

useEffect(() => {
  fetchArtists();
}, []);
  // fetch all leads once and on demand
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
      const items = Array.isArray(data)
        ? data
        : data.leads ?? data.results ?? data.data ?? [];
      const mapped = (items as RawLead[]).map((r) => mapToLead(r));
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
  if (!hasFetched.current) {
    fetchLeads();
    hasFetched.current = true;
  }
}, []);

  // helper: generic PATCH/PUT to update lead (keep method as you had; adjust if needed)
  const patchLead = async (id: string | number, body: Record<string, any>) => {
    const url = `${UPDATE_URL_BASE}/${id}/update/`;
    try {
      const resp = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Update failed: ${resp.status} ${txt}`);
      }
      const data = await resp.json().catch(() => null);
      return data ?? body;
    } catch (err) {
      throw err;
    }
  };

  // helper: set max claims endpoint
  const setMaxClaims = async (id: string | number, maxClaims: number) => {
    const url = `${UPDATE_URL_BASE}/${id}/set-max-claims/`;
    try {
      const resp = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ max_claims: maxClaims }),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Set capping failed: ${resp.status} ${txt}`);
      }
      const data = await resp.json().catch(() => null);
      return data ?? { max_claims: maxClaims };
    } catch (err) {
      throw err;
    }
  };

  // Edit basic info (first_name, notes) via prompt
  const handleEditLead = async (lead: Lead) => {
    try {
      const firstName = window.prompt(
        "Edit first_name:",
        lead.raw?.first_name ?? lead.name ?? ""
      );
      if (firstName === null) return; // cancelled
      const notes = window.prompt("Notes (optional):", lead.raw?.notes ?? "");
      if (notes === null) return;

      const payload: Record<string, any> = {};
      payload.first_name = firstName;
      if (notes) payload.notes = notes;

      const updated = await patchLead(lead.id, payload);

      setLeads((prev) =>
        prev.map((p) => {
          if (String(p.id) !== String(lead.id)) return p;
          const newRaw = { ...(p.raw ?? {}), ...(updated ?? payload) };
          return mapToLead(newRaw);
        })
      );
      window.alert("Lead updated successfully.");
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      window.alert("Failed to update lead: " + (err?.message ?? err));
    }
  };

  // Change status via prompt
  const STATUS_OPTIONS: Lead["status"][] = [
    "new",
    "contacted",
    "qualified",
    "unqualified",
    "converted",
    "other",
  ];

  const handleChangeStatus = async (lead: Lead) => {
    try {
      const cur = lead.status;
      const newStatus = window.prompt(`Change status for ${lead.name} `, cur);
      if (newStatus === null) return;
      const normalized = normalizeStatus(newStatus);
      const payload = { status: normalized };
      const updated = await patchLead(lead.id, payload);
      setLeads((prev) =>
        prev.map((p) => {
          if (String(p.id) !== String(lead.id)) return p;
          const newRaw = { ...(p.raw ?? {}), ...(updated ?? payload) };
          return mapToLead(newRaw);
        })
      );
      window.alert("Status updated.");
    } catch (err: any) {
      console.error(err);
      window.alert("Failed to change status: " + (err?.message ?? err));
    }
  };

  // Soft delete
  const handleSoftDelete = async (lead: Lead) => {
    try {
      const ok = window.confirm(
        `Are you sure you want to soft-delete lead "${lead.name}"?`
      );
      if (!ok) return;
      const payload = { is_deleted: true };
      await patchLead(lead.id, payload);
      setLeads((prev) => prev.filter((p) => String(p.id) !== String(lead.id)));
      window.alert("Lead soft-deleted.");
    } catch (err: any) {
      console.error(err);
      window.alert("Failed to delete lead: " + (err?.message ?? err));
    }
  };

  // Set max claims handler
  const handleSetMaxClaims = async (lead: Lead) => {
    try {
      const input = window.prompt(
        `Set capping for ${lead.name} (enter integer, e.g. 5):`,
        String(lead.maxClaims ?? lead.raw?.max_claims ?? "")
      );
      if (input === null) return;
      const n = parseInt(input, 10);
      if (isNaN(n) || n < 0) {
        window.alert("Please enter a valid non-negative integer.");
        return;
      }
      const updated = await setMaxClaims(lead.id, n);
      setLeads((prev) =>
        prev.map((p) => {
          if (String(p.id) !== String(lead.id)) return p;
          const newRaw = { ...(p.raw ?? {}), ...(updated ?? { max_claims: n }) };
          return mapToLead(newRaw);
        })
      );
      window.alert("Capping updated.");
    } catch (err: any) {
      console.error(err);
      window.alert("Failed to set capping: " + (err?.message ?? err));
    }
  };

  // Assign to handler
 const handleAssignTo = (lead: Lead) => {
  setAssigningLead(lead);
  setSelectedArtist("");
};
  // FIXED: counts uses 'contacted' key
  const counts = useMemo(() => {
    const c = {
      new: 0,
      contacted: 0,
      qualified: 0,
      unqualified: 0,
      converted: 0,
      other: 0,
      total: leads.length,
    } as Record<string, number>;
    for (const l of leads) {
      c[l.status] = (c[l.status] ?? 0) + 1;
    }
    return c as {
      new: number;
      contacted: number;
      qualified: number;
      unqualified: number;
      converted: number;
      other: number;
      total: number;
    };
  }, [leads]);

  // collect dynamic statuses present in leads (for above-table filters)
  const statusesPresent = useMemo(() => {
    const s = new Set<string>();
    for (const l of leads) s.add(l.status);
    return Array.from(s) as Lead["status"][];
  }, [leads]);

  // compute list of contacted leads (books) — used in overview
  const contactedLeads = useMemo(() => {
    return leads.filter((l) => l.status === "contacted");
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">New Leads</p>
              <p className="text-2xl font-bold">{counts.new}</p>
            </div>

            {/* Claimed card with Books toggle */}
            <div className="bg-purple-50 p-4 rounded-lg relative">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Claimed</p>
                  <p className="text-2xl font-bold">{counts.contacted}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
              
                </div>
              </div>

              {/* Books panel (contacted leads) */}
              {showContactedBooks && (
                <div className="mt-3 bg-white border rounded-md p-3 shadow-sm max-h-48 overflow-auto">
                  {contactedLeads.length === 0 ? (
                    <p className="text-sm text-gray-500">No contacted books yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {contactedLeads.slice(0, 6).map((c) => (
                        <li key={String(c.id)} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{c.name}</p>
                            <p className="text-xs text-gray-500">{c.date ?? "-"}</p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              // focus table to that lead by switching tab and optionally scrolling
                              setActiveTab("contacted");
                              // small delay to ensure table is updated then scroll to row (if present)
                              setTimeout(() => {
                                const row = document.querySelector(`[data-lead-id="${c.id}"]`);
                                if (row) (row as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
                              }, 150);
                            }}
                          >
                            View
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Other</p>
              <p className="text-2xl font-bold">{counts.other}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        defaultValue="all"
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">All Leads ({counts.total})</TabsTrigger>
          <TabsTrigger value="new">New ({counts.new})</TabsTrigger>
          {/* SHOW CLAIMED using contacted count */}
          <TabsTrigger value="contacted">Claimed ({counts.contacted})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
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
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fetchLeads()}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="py-6 text-center text-muted-foreground">
                  Loading leads...
                </div>
              ) : error ? (
                <div className="py-6 text-center text-red-600">{error}</div>
              ) : filteredLeads.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  No leads found.
                </div>
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
                        <TableHead>Capping</TableHead>
                        <TableHead>Claimed</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Assign To</TableHead>
                        <TableHead>Event Date</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead) => (
                        <TableRow key={String(lead.id)} data-lead-id={String(lead.id)}>
                          <TableCell className="font-medium">
                            {lead.name}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-xs">{lead.email ?? "-"}</p>
                              <p className="text-xs text-gray-500">
                                {lead.phone ?? "-"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{lead.service ?? "-"}</TableCell>
                          <TableCell>
                            {lead.location ?? String(lead.raw?.location ?? "-")}
                          </TableCell>
                          <TableCell>
                            <Badge className={badgeClassForStatus(lead.status)}>
                              {lead.status}
                            </Badge>
                          </TableCell>

                          {/* New columns */}
                          <TableCell>{lead.maxClaims ?? "-"}</TableCell>
                          <TableCell>{lead.claimedCount ?? "-"}</TableCell>
<TableCell>{lead.budgetMax ?? "-"}</TableCell>
<TableCell>{lead.assigned_to?.first_name ?? "-"}</TableCell>

<TableCell>{lead.booking_date ?? "-"}</TableCell>
                          <TableCell>{lead.date ?? "-"}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => handleEditLead(lead)}
                                >
                                  Edit Lead
                                </DropdownMenuItem>
                               
                             <DropdownMenuItem onClick={() => handleAssignTo(lead)}>
  Assign To
</DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleSetMaxClaims(lead)}
                                >
                                  Set Capping
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-500"
                                  onClick={() => handleSoftDelete(lead)}
                                >
                                   Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        /* TODO: previous page */
                      }}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-[#FF6B9D] text-white hover:bg-[#FF5A8C]"
                    >
                      1
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        /* TODO: page 2 */
                      }}
                    >
                      2
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        /* TODO: page 3 */
                      }}
                    >
                      3
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        /* TODO: next page */
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {assigningLead && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-lg font-bold mb-4">
        Assign Lead: {assigningLead.name}
      </h2>

      {loadingArtists ? (
        <p>Loading artists...</p>
      ) : (
       
<Command className="border rounded-md">
  <CommandInput placeholder="Search artist..." />
  <CommandList>
    <CommandEmpty>No artist found.</CommandEmpty>
    <CommandGroup>
      {artists.map((a) => (
     <CommandItem
  key={String(a.id)}
  value={`${a.id} ${a.name} ${a.phone}`}
  onSelect={() => setSelectedArtist(String(a.id))}
  className={`cursor-pointer ${
    selectedArtist === String(a.id)
      ? "bg-[#FF6B9D] text-white" // highlighted style
      : ""
  }`}
>
  {a.name || "Unnamed"} — {a.phone || "-"}
</CommandItem>


      ))}
    </CommandGroup>
  </CommandList>
</Command>      )}

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={() => setAssigningLead(null)}>
          Cancel
        </Button>
     <Button
  className="bg-[#FF6B9D] text-white"
  disabled={!selectedArtist}
  onClick={async () => {
    if (!selectedArtist) return;

    // convert to number and validate
    const artistId = Number(selectedArtist);
    if (!Number.isFinite(artistId)) {
      window.alert("Invalid artist selected. Please choose a valid artist.");
      return;
    }

    try {
      // send numeric id to API (most backends expect number)
      const payload = { assigned_to: artistId };
      const updated = await patchLead(assigningLead.id, payload);

      // update UI locally: attach assigned_to info (attempt to use artist details)
      const artistInfo = artists.find((a) => String(a.id) === String(artistId));
      const assignedObj = artistInfo
        ? { id: artistId, first_name: artistInfo.name, phone: artistInfo.phone }
        : { id: artistId };

      setLeads((prev) =>
        prev.map((p) =>
          String(p.id) === String(assigningLead.id)
            ? mapToLead({ ...(p.raw ?? {}), ...(updated ?? payload), assigned_to: assignedObj })
            : p
        )
      );

      setAssigningLead(null);
      window.alert("Lead assigned.");
    } catch (err: any) {
      console.error(err);
      window.alert("Failed to assign lead: " + (err?.message ?? err));
    }
  }}
>
  Assign
</Button>

      </div>
    </div>
  </div>
)}

    </div>
  );
}
