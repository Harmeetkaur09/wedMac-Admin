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
import { Calendar, Filter, MapPin, MoreHorizontal, Plus, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";

type RawLead = Record<string, any>;
type Artist = {
  phone?: string;
  id: number | string;
  name: string;
};

type Lead = {
  event_type?: string;
  booking_date: string;
  makeup_types?: { id: number | string; name: string }[];
  id: number | string;
  name: string;
  email?: string | null;
  phone?: string | null;
  service?: string;
  location?: string;
   status: "new" | "booked" | "claimed";
   is_verified: boolean;
  source?: string;
  date?: string;
  maxClaims?: number | null;
  requested_artist?: {
    id: number;
    first_name: string;
    last_name: string;
  } | null;
  claimedCount?: number | null;
  budget?: number | null;
  budgetMax?: number | null;
  raw?: RawLead;
  assigned_to?: {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
  } | null;
};

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
  if (st.includes("book")) return "booked";
  if (st.includes("claim")) return "claimed";
  if (st.includes("new")) return "new";
  return "new"; // fallback
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
  const is_verified = raw.is_verified ?? false;

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

  const maxClaims = parseNumber(
    raw.max_claims ?? raw.maxClaims ?? raw.maxclaim ?? raw.max_claim
  );
  const claimedCount = parseNumber(
    raw.claimed_count ?? raw.claimedCount ?? raw.claims_count ?? raw.claims
  );
  const budget = parseNumber(raw.budget ?? raw.estimated_budget ?? raw.project_budget);

  const budgetMax = parseNumber(
    raw.budget_range?.min_value ?? raw.max_budget ?? raw.budgetMax
  );

  return {
    id,
    name,
    email,
    phone,
    event_type: service,
    location,
    status,
    source,
    date: date ? String(date).slice(0, 10) : "",
    maxClaims,
    claimedCount,
    budget,
    budgetMax,
    assigned_to: raw.assigned_to ?? null,
    is_verified: raw.is_verified ?? false,

        requested_artist: raw.requested_artist ?? null,   // ✅ yeh line add karo

    raw,
    booking_date: raw.booking_date ? String(raw.booking_date).slice(0, 10) : "",
    makeup_types: raw.makeup_types ?? [],   // ✅ ये add करना है
  };
};



export default function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]> | null>(null);
  const [activeTab, setActiveTab] = useState<
    | "all"
    | "new"
    | "contacted"
    | "qualified"
    | "unqualified"
    | "converted"
    | "other"
  >("all");

  const [search, setSearch] = useState("");
  const [assigningLead, setAssigningLead] = useState<Lead | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string>("");
  const [showContactedBooks, setShowContactedBooks] = useState(false);
  const hasFetched = useRef(false);
  const [availableMakeupTypes, setAvailableMakeupTypes] = useState<
  { id: number | string; name: string }[]
>([]);
const fetchMakeupTypes = async () => {
  try {
    const resp = await fetch(
      "https://api.wedmacindia.com/api/admin/master/list/?type=makeup_types",
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }
    );
    if (!resp.ok) throw new Error("Failed to fetch makeup types");
    const data = await resp.json();
    // API का format check करो → मान लो `results` array देता है
    const items = Array.isArray(data)
      ? data
      : data.results ?? data.data ?? [];
    setAvailableMakeupTypes(items);
  } catch (err) {
    console.error("Error fetching makeup types:", err);
    setAvailableMakeupTypes([]);
  }
};
useEffect(() => {
  fetchArtists();
  fetchMakeupTypes(); // 👈 यहाँ call
}, []);


  // NEW: edit modal state
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState<{
    name?: string;
    event_type?: string;
    booking_date?: string;
    location?: string;
    phone?: string;
    budget?: string;
      makeup_types?: (number | string)[];

  }>({});

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
  const handleVerifyLead = async (lead: Lead) => {
  try {
    const confirmVerify = window.confirm(`Verify lead "${lead.name}"?`);
    if (!confirmVerify) return;

    const url = `${UPDATE_URL_BASE}/admin/${lead.id}/set-verified/`;
    const resp = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ is_verified: true }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Failed to verify lead: ${resp.status} ${txt}`);
    }

    toast.success("Lead verified successfully!");
    // refresh the list so the change reflects
    await fetchLeads();
  } catch (err: any) {
    console.error(err);
    toast.error(err?.message ?? "Failed to verify lead");
  }
};


  // helper: generic PUT to update lead (keeps existing behavior)
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
      window.location.reload();
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

  // ---------- NEW: open edit modal ----------
  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setEditForm({
      name: lead.name ?? "",
      event_type: lead.event_type ?? "",
      booking_date: lead.booking_date ?? lead.date ?? "",
      location: lead.location ?? "",
      phone: lead.phone ?? "",
      budget: lead.budget != null ? String(lead.budget) : lead.budgetMax != null ? String(lead.budgetMax) : "",
      makeup_types: lead.makeup_types?.map((m) => m.id) ?? [], // ✅ add this

    });
  };

  // ---------- NEW: save edit modal ----------
  const saveEditModal = async () => {
    if (!editingLead) return;
    const leadId = editingLead.id;
    // build payload — only include fields you want to update (send nulls allowed)
    const payload: Record<string, any> = {};
    if (editForm.name !== undefined) payload.name = editForm.name;
    if (editForm.event_type !== undefined) payload.event_type = editForm.event_type;
    if (editForm.booking_date !== undefined) payload.booking_date = editForm.booking_date || null;
    if (editForm.location !== undefined) payload.location = editForm.location;
    if (editForm.phone !== undefined) payload.phone = editForm.phone;
    if (editForm.makeup_types !== undefined) {
  payload.makeup_types = editForm.makeup_types;
}

    // convert budget to number or null
    payload.budget = editForm.budget !== undefined && editForm.budget !== "" ? parseNumber(editForm.budget) : null;

try {
    const updated = await patchLead(leadId, payload);

    setLeads((prev) =>
      prev.map((p) =>
        String(p.id) !== String(leadId)
          ? p
          : mapToLead({ ...(p.raw ?? {}), ...(updated ?? payload) })
      )
    );

    toast.success("Lead updated");
    setEditingLead(null);
    setEditForm({});
    setFormErrors(null); // ✅ reset errors
  } catch (err: any) {
    console.error("Failed to update lead:", err);

    try {
      // server से response JSON parse कर लो
      const parsed = JSON.parse(
        err.message.replace(/^Update failed:\s*\d+\s*/, "")
      );
      setFormErrors(parsed); // ✅ store errors
    } catch {
      setFormErrors({ general: [err?.message ?? "Unknown error"] });
    }

    toast.error("Failed to update lead");
  }
};

  // Edit basic info (deprecated prompt-based) - replaced by modal open
  const handleEditLead = (lead: Lead) => {
    openEditModal(lead);
  };

  // Change status via prompt


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

 const counts = useMemo(() => {
  const c = {
    new: 0,
    booked: 0,
    claimed: 0,
    total: leads.length,
  };
  for (const l of leads) {
    c[l.status] = (c[l.status] ?? 0) + 1;
  }
  return c;
}, [leads]);


  const statusesPresent = useMemo(() => {
    const s = new Set<string>();
    for (const l of leads) s.add(l.status);
    return Array.from(s) as Lead["status"][];
  }, [leads]);

  const contactedLeads = useMemo(() => {
    return leads.filter((l) => l.status === "booked");
  }, [leads]);

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
    case "booked":
      return "bg-green-100 text-green-800";
    case "claimed":
      return "bg-purple-100 text-purple-800";
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

            <div className="bg-purple-50 p-4 rounded-lg relative">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Claimed</p>
                  <p className="text-2xl font-bold">{counts.claimed}</p>
                </div>
                <div className="flex flex-col items-end gap-2"></div>
              </div>

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
                              setActiveTab("contacted");
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
              <p className="text-sm text-green-600 font-medium">Booked</p>
              <p className="text-2xl font-bold">{counts.booked}</p>
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
  <TabsTrigger value="booked">Booked ({counts.booked})</TabsTrigger>
  <TabsTrigger value="claimed">Claimed ({counts.claimed})</TabsTrigger>
</TabsList>


        <TabsContent value={activeTab}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
                <CardTitle>Lead List</CardTitle>
                <div className="flex w-full sm:w-auto gap-2 items-center">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search leads..."
                      className="pl-8 w-full sm:w-64"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fetchLeads()}
                    aria-label="Refresh"
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
                  {/* ---------------- MOBILE LIST ---------------- */}
                  <div className="sm:hidden space-y-3">
                    {filteredLeads.map((lead) => (
                      <div
                        key={String(lead.id)}
                        data-lead-id={String(lead.id)}
                        className="bg-white border rounded-lg p-3 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{lead.name}</p>
                              <Badge className={badgeClassForStatus(lead.status)}>{lead.status}</Badge>
                            </div>
                            <p className="text-xs text-gray-500">{lead.email ?? "-"}</p>
                            <p className="text-xs text-gray-500">{lead.phone ?? "-"}</p>
                            <p className="text-xs text-gray-500">{lead.makeup_types?.length
    ? lead.makeup_types.map((m) => m.name).join(", ")
    : "-"}</p>
    <p className="text-xs text-gray-500">{lead.budget ?? lead.budgetMax ?? "-"}</p>
    <p className="text-xs text-gray-500">Max Claim: {lead.maxClaims ?? "-"}</p>
    <p className="text-xs text-gray-500">Claimed: {lead.claimedCount ?? "-"}</p>
    <p className="text-xs text-gray-500 break-all">Requested Artist: {lead.requested_artist ? `${lead.requested_artist.first_name} ${lead.requested_artist.last_name}` : "-"}</p>
    <p className="text-xs text-gray-500">Verification Status: {lead.is_verified ? "Verified" : "Unverified"}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-sm text-gray-500">{lead.booking_date ?? lead.date ?? "-"}</div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="p-1">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => openEditModal(lead)}>
                                  Edit Lead
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAssignTo(lead)}>
                                  Assign To
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSetMaxClaims(lead)}>
                                  Set Capping
                                </DropdownMenuItem>
                                {lead.is_verified === false && (
  <DropdownMenuItem onClick={() => handleVerifyLead(lead)}>
    Verify Lead
  </DropdownMenuItem>
)}

                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500" onClick={() => handleSoftDelete(lead)}>
                                  Delete
                                </DropdownMenuItem>
                                
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {lead.date ?? "-"}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {lead.location ?? "-"}
                            </div>
                          </div>

                          <div className="text-right">
                            <div>{lead.assigned_to?.first_name ?? "-"}</div>
                            <div className="text-xs text-gray-400">{lead.claimedCount ?? "-" } claimed</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ---------------- DESKTOP TABLE ---------------- */}
                  <div className="hidden sm:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Contact</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Requested Artist</TableHead>
                          <TableHead>Capping</TableHead>
                          <TableHead>Claimed</TableHead>
                          <TableHead>Budget</TableHead>
                          <TableHead>Assign To</TableHead>
                          <TableHead>Created Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLeads.map((lead) => (
                          <TableRow key={String(lead.id)} data-lead-id={String(lead.id)}>
                            <TableCell className="font-medium">
                                 <div className="font-medium">{lead.name}</div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
{lead.email ?? "-"}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
{lead.phone ?? "-"}
                                </div>
                            </TableCell>
                       
                            <TableCell>
                              <div className="space-y-1">
<div className="font-medium">
  {lead.makeup_types?.length
    ? lead.makeup_types.map((m) => m.name).join(", ")
    : "-"}
</div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {lead.booking_date ?? "-"}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  {lead.location ?? "-"}
                                </div>
                              </div>
                            </TableCell>

            <TableCell>
  <div className="flex flex-col">
    <div>
      {lead?.requested_artist
        ? `${lead.requested_artist.first_name} ${lead.requested_artist.last_name}`
        : "-"}
    </div>
    <div>
      {lead.is_verified ? (
        <Badge className="bg-green-100 text-green-800">Verified</Badge>
      ) : (
        <Badge className="bg-red-100 text-red-800">Unverified</Badge>
      )}
    </div>
  </div>
</TableCell>



                            <TableCell>{lead.maxClaims ?? "-"}</TableCell>
                            <TableCell>{lead.claimedCount ?? "-"}</TableCell>
                            <TableCell>{lead.budget ?? lead.budgetMax ?? "-"}</TableCell>
                            <TableCell>{lead.assigned_to?.first_name ?? "-"}</TableCell>

   <TableCell className="font-medium">
                                 <div className="font-medium">{lead.date ?? "-"}</div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
<Badge className={badgeClassForStatus(lead.status)}>
                                {lead.status}
                              </Badge>
                                </div>
                             
                            </TableCell>                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => openEditModal(lead)}>
                                    Edit Lead
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleAssignTo(lead)}>
                                    Assign To
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleSetMaxClaims(lead)}>
                                    Set Capping
                                  </DropdownMenuItem>
                                  {!lead.is_verified && (
    <DropdownMenuItem onClick={() => handleVerifyLead(lead)}>
      Verify Lead
    </DropdownMenuItem>
  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-500" onClick={() => handleSoftDelete(lead)}>
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button variant="outline" size="sm">Previous</Button>
                    <Button variant="outline" size="sm" className="bg-[#FF6B9D] text-white hover:bg-[#FF5A8C]">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {assigningLead && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 rounded-lg w-full max-w-md mx-auto sm:p-6">
            <h2 className="text-lg font-bold mb-3">Assign Lead: {assigningLead.name}</h2>

            {loadingArtists ? (
              <p>Loading artists...</p>
            ) : (
              <Command className="border rounded-md max-h-60 overflow-auto">
                <CommandInput placeholder="Search artist..." />
                <CommandList>
                  <CommandEmpty>No artist found.</CommandEmpty>
                  <CommandGroup>
                    {artists.map((a) => (
                      <CommandItem
                        key={String(a.id)}
                        value={`${a.id} ${a.name} ${a.phone}`}
                        onSelect={() => setSelectedArtist(String(a.id))}
                        className={`cursor-pointer ${selectedArtist === String(a.id) ? "bg-[#FF6B9D] text-white" : ""}`}
                      >
                        {a.name || "Unnamed"} — {a.phone || "-"}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setAssigningLead(null)}>Cancel</Button>
              <Button
                className="bg-[#FF6B9D] text-white"
                disabled={!selectedArtist}
                onClick={async () => {
                  if (!selectedArtist) return;
                  const artistId = Number(selectedArtist);
                  if (!Number.isFinite(artistId)) {
                    window.alert("Invalid artist selected. Please choose a valid artist.");
                    return;
                  }

                  try {
                    const payload = { assigned_to: artistId };
                    const updated = await patchLead(assigningLead.id, payload);

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

      {/* ---------- EDIT LEAD MODAL ---------- */}
      {editingLead && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 rounded-lg w-full max-w-lg mx-auto sm:p-6">
            <h2 className="text-lg font-bold mb-3">Edit Lead</h2>
          {formErrors?.general && (
  <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-2 rounded mb-3">
    {formErrors.general.join(", ")}
  </div>
)}


            <div className="grid grid-cols-1 gap-3">
              <label className="text-xs text-gray-600">Name</label>
              <Input
                value={editForm.name ?? ""}
                onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))}
                placeholder="Lead name"
                required
              />
              {formErrors?.name && <p className="text-red-600 text-xs mt-1">{formErrors.name.join(", ")}</p>}


        <label className="text-xs text-gray-600">Makeup Types</label>
<div className="flex flex-wrap gap-2">
  {availableMakeupTypes.map((mt) => (
    <label
      key={mt.id}
      className="flex items-center gap-1 border px-2 py-1 rounded"
    >
      <input
        type="checkbox"
        checked={editForm.makeup_types?.includes(mt.id) ?? false}
        required
        onChange={(e) => {
          setEditForm((s) => {
            const current = new Set(s.makeup_types ?? []);
            if (e.target.checked) {
              current.add(mt.id);
            } else {
              current.delete(mt.id);
            }
            return { ...s, makeup_types: Array.from(current) };
          });
        }}
      />
      {mt.name}
    </label>
  ))}
  {formErrors?.makeup_types && <p className="text-red-600 text-xs mt-1">{formErrors.makeup_types.join(", ")}</p>}

</div>



              <label className="text-xs text-gray-600">Event / Booking Date</label>
              <Input
                type="date"
                value={editForm.booking_date ?? ""}
                required
                onChange={(e) => setEditForm((s) => ({ ...s, booking_date: e.target.value }))}
              />
              {formErrors?.booking_date && <p className="text-red-600 text-xs mt-1">{formErrors.booking_date.join(", ")}</p>}


             <label className="text-xs text-gray-600">Location</label>
<Input
  value={editForm.location ?? ""}
  required
  onChange={(e) => setEditForm((s) => ({ ...s, location: e.target.value }))}
  placeholder="Event location"
/>
{formErrors?.location && (
  <p className="text-red-600 text-xs mt-1">{formErrors.location.join(", ")}</p>
)}


              <label className="text-xs text-gray-600">Phone</label>
              <Input
                value={editForm.phone ?? ""}
                required
                onChange={(e) => setEditForm((s) => ({ ...s, phone: e.target.value }))}
                placeholder="Phone number"
                inputMode="tel"
              />
              {formErrors?.phone && <p className="text-red-600 text-xs mt-1">{formErrors.phone.join(", ")}</p>}


              <label className="text-xs text-gray-600">Budget</label>
              <Input
                value={editForm.budget ?? ""}
                required
                onChange={(e) => setEditForm((s) => ({ ...s, budget: e.target.value }))}
                placeholder="Budget (numeric)"
                inputMode="numeric"
              />
              {formErrors?.budget && <p className="text-red-600 text-xs mt-1">{formErrors.budget.join(", ")}</p>}

            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setEditingLead(null);
                  setEditForm({});
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#FF6B9D] text-white"
                onClick={() => saveEditModal()}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
