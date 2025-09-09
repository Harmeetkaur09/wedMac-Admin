"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";

type Artist = {
  my_claimed_leads: string;
  tag?: string;
  id: number;
  user_phone?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string | null;
  gender?: string | null;
  date_of_birth?: string | null;
  location?: string | null;
  payment_status?: string | null;
  status?: string | null;
  internal_notes?: string | null;
  profile_picture?: {
    file_url?: string | null;
  } | null;
  certifications?: any[];
  created_at?: string;
  my_referral_code?: string | null;
  available_leads?: number;
};

export default function ArtistListPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all");

  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({});

  const API_HOST = "https://api.wedmacindia.com";

  // New: subscription plans
  const [plans, setPlans] = useState<any[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
const [formErrors, setFormErrors] = useState<{ first_name?: string; last_name?: string; phone?: string }>({});
const isAlpha = (s: string) => /^[A-Za-z\s]+$/.test(s.trim());
const sanitizeAlpha = (s: string) => s.replace(/[^A-Za-z\s]/g, "");
const sanitizePhone = (s: string) => s.replace(/\D/g, "").slice(0, 10);
const isPhoneValid = (s: string) => /^\d{10}$/.test(s);
  // Add Artist modal state + form
  const [addOpen, setAddOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newArtist, setNewArtist] = useState<any>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    gender: "",
    city: "",
    state: "",
    pincode: "",
    lat: "",
    lng: "",
    // subscription_plan_id will hold the selected plan's id (string GUID)
    subscription_plan_id: "",
  });

// inside your component (e.g., near toggleArtistStatus / postArtistTag functions)

const loginAsArtist = async (artistPhone?: string, artistId?: number) => {
  if (!artistPhone) {
    toast.error("Artist phone not available");
    return;
  }

  // 1) open blank tab synchronously to avoid popup blockers
  const newWin = typeof window !== "undefined"
    ? window.open("", "_blank")
    : null;

  if (typeof window !== "undefined" && !newWin) {
    toast.error("Popup blocked. Please allow popups for this site.");
    return;
  }

  setActionLoading((p) => ({ ...p, [artistId ?? -1]: true }));
  try {
    const endpoint = `${API_HOST}/api/users/admin/login-as-artist/`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(typeof window !== "undefined" && sessionStorage.getItem("accessToken")
          ? { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` }
          : {}),
      },
      body: JSON.stringify({ phone: String(artistPhone) }),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const msg = (json && (json.detail || json.message)) || `Request failed: ${res.status}`;
      toast.error(msg);
      // close the blank tab if opened
      if (newWin && !newWin.closed) newWin.close();
      return;
    }

    const access = json?.access;
    const refresh = json?.refresh;
    const userId = json?.user_id ?? null;

    if (!access) {
      toast.error("Login-as-artist did not return access token");
      if (newWin && !newWin.closed) newWin.close();
      return;
    }

    // Optional: keep a copy on admin origin (not required for new tab)
 
    toast.success(json?.message || "Logged in as artist");

    // build artist URL + fragment (fragment won't be sent to server)
    const artistProfileUrl = "https://wedmac-artist.vercel.app/"; // change if you want /profile
    const frag = `#access=${encodeURIComponent(access)}${refresh ? `&refresh=${encodeURIComponent(refresh)}` : ""}${userId ? `&user_id=${encodeURIComponent(String(userId))}` : ""}`;

    // navigate the previously opened tab to the final URL
    if (newWin && !newWin.closed) {
      try {
        newWin.location.href = `${artistProfileUrl}${frag}`;
        // for security, you can also remove reference (optional)
        // newWin.opener = null;
      } catch (e) {
        // setting location might fail in some strict environments; fallback: open new URL
        window.open(`${artistProfileUrl}${frag}`, "_blank", "noopener,noreferrer");
        if (!newWin.closed) newWin.close();
      }
    } else {
      // fallback: open normally (might be blocked)
      window.open(`${artistProfileUrl}${frag}`, "_blank", "noopener,noreferrer");
    }
  } catch (err) {
    console.error("Login-as-artist failed:", err);
    toast.error("Failed to login as artist");
    if (newWin && !newWin.closed) newWin.close();
  } finally {
    setActionLoading((p) => ({ ...p, [artistId ?? -1]: false }));
  }
};



  const postArtistTag = async (artistId: number, tag: string) => {
    setActionLoading((p) => ({ ...p, [artistId]: true }));
    try {
      const tokenFromStorage =
        typeof window !== "undefined"
          ? sessionStorage.getItem("accessToken")
          : null;
      const token = tokenFromStorage ? `Bearer ${tokenFromStorage}` : undefined;

      const endpoint = `${API_HOST}/api/artists/admin/${artistId}/tag/`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: token } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tag }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = (json && (json.detail || json.message)) || `Request failed: ${res.status}`;
        toast.error(msg);
        return;
      }

      if (tag && tag.trim()) toast.success(`Tag "${tag}" applied`);
      else toast.success("Tag removed");

      fetchArtists();
    } catch (err) {
      console.error("Tag update failed:", err);
      toast.error("Failed to update tag");
    } finally {
      setActionLoading((p) => ({ ...p, [artistId]: false }));
    }
  };

  const fetchArtists = async () => {
    setLoading(true);
    setError(null);
    try {
      const tokenFromStorage =
        typeof window !== "undefined"
          ? sessionStorage.getItem("accessToken")
          : null;
      const token = tokenFromStorage ? `Bearer ${tokenFromStorage}` : undefined;

      const url = new URL(`${API_HOST}/api/admin/artists`);
      url.searchParams.set("Status", "all");

      const res = await fetch(url.toString(), {
        headers: {
          ...(token ? { Authorization: token } : {}),
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error: ${res.status} ${text}`);
      }

      const data: any = await res.json();

      let list: Artist[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data && typeof data === "object" && "results" in data && Array.isArray(data.results)) {
        list = data.results;
      }

      setArtists(list);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch artists");
    } finally {
      setLoading(false);
    }
  };

  // New: fetch subscription plans
  const fetchPlans = async () => {
    setPlansLoading(true);
    try {
      const tokenFromStorage =
        typeof window !== "undefined"
          ? sessionStorage.getItem("accessToken")
          : null;
      const token = tokenFromStorage ? `Bearer ${tokenFromStorage}` : undefined;

      const url = `${API_HOST}/api/admin/master/list/?type=subscriptions_plan`;
      const res = await fetch(url, {
        headers: {
          ...(token ? { Authorization: token } : {}),
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.warn("Failed to fetch plans:", res.status, txt);
        setPlans([]);
        return;
      }

      const data = await res.json().catch(() => null);
      // handle array or { results: [...] } shapes
      const list = Array.isArray(data) ? data : (data && Array.isArray(data.results) ? data.results : []);
      setPlans(list);
    } catch (err) {
      console.error("Plans fetch error:", err);
      setPlans([]);
    } finally {
      setPlansLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => {
    const c = { active: 0, pending: 0, inactive: 0, totalBookings: 0 } as any;
    for (const a of artists) {
      const s = (a.status || "").toLowerCase();
      if (s === "approved" || s === "active") c.active++;
      else if (s === "pending") c.pending++;
      else c.inactive++;
    }
    c.total = artists.length;
    return c;
  }, [artists]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return artists.filter((a) => {
      if (
        statusFilter !== "all" &&
        (a.status || "").toLowerCase() !== statusFilter.toLowerCase()
      )
        return false;
      if (!q) return true;
      const name = `${a.first_name ?? ""} ${a.last_name ?? ""}`.toLowerCase();
      return (
        name.includes(q) ||
        String(a.phone ?? a.user_phone ?? "").toLowerCase().includes(q) ||
        String(a.email ?? "").toLowerCase().includes(q) ||
        String(a.location ?? "").toLowerCase().includes(q)
      );
    });
  }, [artists, search, statusFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > pages) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages]);

  const renderBadge = (status?: string | null) => {
    const s = (status || "").toLowerCase();
    if (s === "approved" || s === "active")
      return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
    if (s === "pending")
      return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
    if (s === "rejected" || s === "inactive")
      return <Badge className="bg-red-100 text-red-800">{status}</Badge>;
    return <Badge className="bg-gray-100 text-gray-800">{status || "unknown"}</Badge>;
  };

  const toggleArtistStatus = async (artistId: number, activate: boolean) => {
    const confirmMsg = activate
      ? "Are you sure you want to ACTIVATE this artist?"
      : "Are you sure you want to DEACTIVATE this artist?";
    if (!window.confirm(confirmMsg)) return;

    setActionLoading((p) => ({ ...p, [artistId]: true }));
    try {
      const tokenFromStorage =
        typeof window !== "undefined"
          ? sessionStorage.getItem("accessToken")
          : null;
      const token = tokenFromStorage ? `Bearer ${tokenFromStorage}` : undefined;

      const endpoint = `${API_HOST}/api/admin/artist/${artistId}/${activate ? "activate" : "deactivate"}/`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: token } : {}),
          "Content-Type": "application/json",
        },
      });

      const resJson = await res.json().catch(() => null);

      if (!res.ok) {
        const errMsg = (resJson && (resJson.detail || resJson.message)) || `Request failed: ${res.status}`;
        toast.error(errMsg);
        return;
      }

      setArtists((prev) =>
        prev.map((a) => {
          if (a.id !== artistId) return a;
          return {
            ...a,
            status: activate ? "active" : "inactive",
          };
        })
      );

      toast.success(activate ? "Artist activated" : "Artist deactivated");
    } catch (err: any) {
      console.error(err);
      toast.error("Action failed");
    } finally {
      setActionLoading((p) => ({ ...p, [artistId]: false }));
    }
  };

  // Create artist (admin) - modified to send subscription_plan_id
  const createArtist = async () => {
   // Basic required checks
  const fn = (newArtist.first_name || "").trim();
  const ln = (newArtist.last_name || "").trim();
  const phone = (newArtist.phone || "").trim();

  const errors: typeof formErrors = {};

  if (!fn) errors.first_name = "First name is required";
  else if (!isAlpha(fn)) errors.first_name = "Name must contain only letters and spaces";

  // last name optional but if provided must be alphabetic
  if (ln && !isAlpha(ln)) errors.last_name = "Last name must contain only letters and spaces";

  if (!phone) errors.phone = "Phone is required";
  else if (!isPhoneValid(phone)) errors.phone = "Phone must be exactly 10 digits";

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    // show first error as toast too
    const firstError = errors.first_name || errors.last_name || errors.phone;
    toast.error(firstError || "Unknown error");
    return;
  }


    setCreateLoading(true);
    try {
      const tokenFromStorage =
        typeof window !== "undefined"
          ? sessionStorage.getItem("accessToken")
          : null;
      const token = tokenFromStorage ? `Bearer ${tokenFromStorage}` : undefined;

      const payload: any = {
        first_name: newArtist.first_name,
        last_name: newArtist.last_name || "",
        phone: newArtist.phone,
        email: newArtist.email || null,
        gender: newArtist.gender || null,
        city: newArtist.city || null,
        state: newArtist.state || null,
        pincode: newArtist.pincode || null,
        // Instead of available_leads, include subscription_plan_id (or null)
        subscription_plan_id:
          newArtist.subscription_plan_id && newArtist.subscription_plan_id !== ""
            ? String(newArtist.subscription_plan_id)
            : null,
      };

      if (newArtist.lat) payload.lat = Number(newArtist.lat);
      if (newArtist.lng) payload.lng = Number(newArtist.lng);

      const res = await fetch(`${API_HOST}/api/users/admin/create-artist/`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: token } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        console.error("Create artist failed", res.status, json);
        const msg = (json && (json.detail || json.message)) || `Create failed: ${res.status}`;
        toast.error(msg);
        return;
      }

      toast.success("Artist created");

      if (json && (json.id || json.user_id)) {
        const created: Artist = {
          id: json.id || json.user_id,
          user_phone: json.phone || String(json.user_phone || payload.phone),
          first_name: json.first_name || payload.first_name,
          last_name: json.last_name || payload.last_name,
          phone: json.phone || payload.phone,
          email: json.email || payload.email,
          gender: json.gender || payload.gender,
          date_of_birth: json.date_of_birth || null,
          location: (json.city || json.location) || `${payload.city || ""}`,
          payment_status: null,
          status: json.status || "pending",
          internal_notes: null,
          my_claimed_leads: json.my_claimed_leads || null,
          profile_picture: json.profile_picture ? { file_url: json.profile_picture } : null,
          certifications: json.certifications || [],
          created_at: json.created_at || new Date().toISOString(),
          my_referral_code: json.my_referral_code || null,
          tag: "",
          // server may return available_leads; fallback to 0 if not provided
          available_leads:
            typeof json.available_leads !== "undefined"
              ? Number(json.available_leads)
              : 0,
        };
        setArtists((p) => [created, ...p]);
      } else {
        fetchArtists();
      }

      // reset form
      setNewArtist({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        gender: "",
        city: "",
        state: "",
        pincode: "",
        lat: "",
        lng: "",
        subscription_plan_id: "",
      });
      setAddOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create artist");
    } finally {
      setCreateLoading(false);
    }
  };

  // ... (keep adjustArtistLeads and other helpers as-is if needed)
  const adjustArtistLeads = async (artistId: number, action: "add" | "remove") => {
    const raw = window.prompt(`Enter amount to ${action} (numeric):`, "1");
    if (raw === null) return;
    const amount = Number(raw);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Invalid amount");
      return;
    }

    setActionLoading((p) => ({ ...p, [artistId]: true }));
    try {
      const tokenFromStorage =
        typeof window !== "undefined"
          ? sessionStorage.getItem("accessToken")
          : null;
      const token = tokenFromStorage ? `Bearer ${tokenFromStorage}` : undefined;

      const endpoint = `${API_HOST}/api/admin/artist/${artistId}/leads/`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          ...(token ? { Authorization: token } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          amount,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = (json && (json.detail || json.message)) || `Request failed: ${res.status}`;
        toast.error(msg);
        return;
      }

      const maybeNum = (obj: any, keys: string[]) => {
        for (const k of keys) {
          if (obj && Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== null && obj[k] !== undefined) {
            const n = Number(obj[k]);
            if (Number.isFinite(n)) return n;
          }
        }
        return null;
      };

      const updatedCount =
        maybeNum(json, ["available_leads", "my_claimed_leads", "available_leads_count", "leads_available"]) ?? null;

      if (updatedCount !== null) {
        setArtists((prev) =>
          prev.map((a) => (a.id === artistId ? { ...a, available_leads: updatedCount } : a))
        );
      } else {
        setArtists((prev) =>
          prev.map((a) => {
            if (a.id !== artistId) return a;
            const cur = typeof a.available_leads === "number" ? a.available_leads : (typeof a.my_claimed_leads === "number" ? Number(a.my_claimed_leads) : 0);
            const newVal = Math.max(0, cur + (action === "add" ? amount : -amount));
            return {
              ...a,
              available_leads: newVal,
              my_claimed_leads: (a.my_claimed_leads !== undefined) ? String(newVal) : a.my_claimed_leads,
            };
          })
        );
      }

      toast.success(`Successfully ${action === "add" ? "added" : "removed"} ${amount} lead(s)`);
    } catch (err) {
      console.error("Adjust leads failed:", err);
      toast.error("Failed to adjust leads");
    } finally {
      setActionLoading((p) => ({ ...p, [artistId]: false }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Artist Management</h1>
          <p className="text-gray-600 mt-1">Manage all makeup artists on your platform</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#FF6B9D] hover:bg-pink-500 text-white" onClick={() => setAddOpen(true)}>Add Artist</Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Artist Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Active Artists</p>
              <p className="text-2xl font-bold">{counts.active}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Pending Approval</p>
              <p className="text-2xl font-bold">{counts.pending}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Rejected Artists</p>
              <p className="text-2xl font-bold">{counts.inactive}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Artists</p>
              <p className="text-2xl font-bold">{counts.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
            <CardTitle>Artist List</CardTitle>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search artists..."
                  className="pl-8 w-64"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded border"
                >
                  <option value="all">All</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">Loading artists...</div>
          ) : error ? (
            <div className="py-4 text-red-600">{error}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Artist</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Join date</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Tag</TableHead>
                      <TableHead>Claimed Lead</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((artist) => (
                      <TableRow key={artist.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div className="flex items-center">
                            <div>
                              <p className="font-medium">{`${artist.first_name ?? ""} ${artist.last_name ?? ""}`}</p>
                              <p className="text-xs text-gray-500">{artist.email ?? artist.phone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="break-words max-w-sm">{artist.location ?? "-"}</TableCell>
                        <TableCell>{new Date(artist.created_at ?? "-").toISOString().split("T")[0]}</TableCell>
                        <TableCell>{artist.user_phone ?? "-"}</TableCell>
                        <TableCell>{artist.tag ?? "-"}</TableCell>
                        <TableCell>{artist.my_claimed_leads ?? "-"}</TableCell>
                        <TableCell>{renderBadge(artist.status)}</TableCell>
                        <TableCell className="text-right">


                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          
                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={() => postArtistTag(artist.id, "popular")}
                                disabled={!!actionLoading[artist.id]}
                              >
                                {actionLoading[artist.id] ? "Processing..." : "Tag: Popular"}
                              </DropdownMenuItem>
<DropdownMenuItem
  onClick={() => loginAsArtist(artist.user_phone || artist.phone || `${artist.phone}` , artist.id)}
  disabled={!!actionLoading[artist.id]}
>
  {actionLoading[artist.id] ? "Processing..." : "Login as Artist"}
</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => postArtistTag(artist.id, "top")}
                                disabled={!!actionLoading[artist.id]}
                              >
                                {actionLoading[artist.id] ? "Processing..." : "Tag: Top"}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => postArtistTag(artist.id, "")}
                                disabled={!!actionLoading[artist.id]}
                                className="text-red-600"
                              >
                                {actionLoading[artist.id] ? "Processing..." : "Remove Tag"}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => adjustArtistLeads(artist.id, "add")}
                                disabled={!!actionLoading[artist.id]}
                              >
                                {actionLoading[artist.id] ? "Processing..." : "+1 Leads"}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => adjustArtistLeads(artist.id, "remove")}
                                disabled={!!actionLoading[artist.id]}
                                className="text-red-600"
                              >
                                {actionLoading[artist.id] ? "Processing..." : "-1 Leads"}
                              </DropdownMenuItem>

                              {((artist.status || "").toLowerCase() === "active" || (artist.status || "").toLowerCase() === "approved") ? (
                                <DropdownMenuItem
                                  onClick={() => toggleArtistStatus(artist.id, false)}
                                  disabled={!!actionLoading[artist.id]}
                                >
                                  {actionLoading[artist.id] ? "Processing..." : "Deactivate"}
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => toggleArtistStatus(artist.id, true)}
                                  disabled={!!actionLoading[artist.id]}
                                >
                                  {actionLoading[artist.id] ? "Processing..." : "Activate"}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}

                    {paginated.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                          No artists found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  Previous
                </Button>
                <div className="px-3 py-2 rounded bg-[#FF6B9D] text-white">{page}</div>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Artist modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAddOpen(false)} />
          <div className="relative max-w-lg w-full bg-white rounded shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Create Artist (Admin)</h3>
            <p className="text-sm text-gray-600 mb-4">Creates an artist without OTP</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
           <Input
  placeholder="First name"
  value={newArtist.first_name}
  onChange={(e) => {
    const val = sanitizeAlpha(e.target.value);
    setNewArtist((p: any) => ({ ...p, first_name: val }));
    setFormErrors((fe) => ({ ...fe, first_name: undefined }));
  }}
/>
{formErrors.first_name && <p className="text-xs text-red-600 mt-1">{formErrors.first_name}</p>}

<Input
  placeholder="Last name"
  value={newArtist.last_name}
  onChange={(e) => {
    const val = sanitizeAlpha(e.target.value);
    setNewArtist((p: any) => ({ ...p, last_name: val }));
    setFormErrors((fe) => ({ ...fe, last_name: undefined }));
  }}
/>
{formErrors.last_name && <p className="text-xs text-red-600 mt-1">{formErrors.last_name}</p>}

<Input
  placeholder="Phone"
  value={newArtist.phone}
  inputMode="numeric"
  maxLength={10}
  onChange={(e) => {
    const val = sanitizePhone(e.target.value);
    setNewArtist((p: any) => ({ ...p, phone: val }));
    setFormErrors((fe) => ({ ...fe, phone: undefined }));
  }}
/>
{formErrors.phone && <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>}
              <Input placeholder="Email" value={newArtist.email} onChange={(e) => setNewArtist((p: any) => ({ ...p, email: e.target.value }))} />

              {/* Gender dropdown */}
              <div>
                {/* <label className="block text-xs font-medium mb-1">Gender</label> */}
                <select
                  value={newArtist.gender ?? ""}
                  onChange={(e) => setNewArtist((p: any) => ({ ...p, gender: e.target.value }))}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <Input placeholder="City" value={newArtist.city} onChange={(e) => setNewArtist((p: any) => ({ ...p, city: e.target.value }))} />
              <Input placeholder="State" value={newArtist.state} onChange={(e) => setNewArtist((p: any) => ({ ...p, state: e.target.value }))} />
              {/* <Input placeholder="Pincode" value={newArtist.pincode} onChange={(e) => setNewArtist((p: any) => ({ ...p, pincode: e.target.value }))} /> */}

              {/* Subscription plan select (shows name, sends id) */}
              <div>
                {/* <label className="block text-xs font-medium mb-1">Subscription Plan</label> */}
                <select
                  value={newArtist.subscription_plan_id ?? ""}
                  onChange={(e) => setNewArtist((p: any) => ({ ...p, subscription_plan_id: e.target.value }))}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">{plansLoading ? "Loading plans..." : "Select a plan"}</option>
                  {plans.map((pl: any) => (
                    <option key={pl.id} value={pl.id}>
                      {pl.name}
                    </option>
                  ))}
                </select>
              </div>

         
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={createArtist} disabled={createLoading}>{createLoading ? "Creating..." : "Create Artist"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
