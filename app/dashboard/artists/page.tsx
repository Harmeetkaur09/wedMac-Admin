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
  status?: string | null; // e.g. pending, approved, inactive
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

  // per-artist action loading state
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>(
    {}
  );

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
    available_leads: 0,
  });

  // POST tag to artist (add or remove). If tag is empty string, server will remove tag.
  const API_HOST = "https://api.wedmacindia.com";

  const postArtistTag = async (artistId: number, tag: string) => {
    setActionLoading((p) => ({ ...p, [artistId]: true }));
    try {
      const tokenFromStorage =
        typeof window !== "undefined"
          ? sessionStorage.getItem("accessToken")
          : null;
      const token = tokenFromStorage ? `Bearer ${tokenFromStorage}` : undefined;

      // endpoint: /api/artists/admin/<id>/tag/
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

      // refresh list so UI can reflect tag changes
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

      // sometimes API returns an object with a results key — handle both shapes
      let list: Artist[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (
        data &&
        typeof data === "object" &&
        "results" in data &&
        Array.isArray(data.results)
      ) {
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

  useEffect(() => {
    fetchArtists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived counts for overview
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

  // Filter + search
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

  // Toggle activation endpoint POSTs (activate/deactivate)
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

      // success: update local list so UI reflects change without full refetch
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

  // Create artist (admin)
  const createArtist = async () => {
    // Basic validation
    if (!newArtist.first_name || !newArtist.phone) {
      toast.error("Please provide first name and phone");
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
        available_leads:
          typeof newArtist.available_leads !== "undefined"
            ? Number(newArtist.available_leads)
            : 0,
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

      // If API returns the created artist, add it to list; otherwise refetch
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
          available_leads:
            typeof json.available_leads !== "undefined"
              ? Number(json.available_leads)
              : Number(payload.available_leads || 0),
        };
        setArtists((p) => [created, ...p]);
      } else {
        // fallback: refetch list
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
        available_leads: 0,
      });
      setAddOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create artist");
    } finally {
      setCreateLoading(false);
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
          <Button onClick={() => fetchArtists()}>Refresh</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setAddOpen(true)}>Add Artist</Button>
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

                              {/* Activate / Deactivate action depending on current status */}
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
              <Input placeholder="First name" value={newArtist.first_name} onChange={(e) => setNewArtist((p: any) => ({ ...p, first_name: e.target.value }))} />
              <Input placeholder="Last name" value={newArtist.last_name} onChange={(e) => setNewArtist((p: any) => ({ ...p, last_name: e.target.value }))} />
              <Input placeholder="Phone" value={newArtist.phone} onChange={(e) => setNewArtist((p: any) => ({ ...p, phone: e.target.value }))} />
              <Input placeholder="Email" value={newArtist.email} onChange={(e) => setNewArtist((p: any) => ({ ...p, email: e.target.value }))} />
              <Input placeholder="Gender" value={newArtist.gender} onChange={(e) => setNewArtist((p: any) => ({ ...p, gender: e.target.value }))} />
              <Input placeholder="City" value={newArtist.city} onChange={(e) => setNewArtist((p: any) => ({ ...p, city: e.target.value }))} />
              <Input placeholder="State" value={newArtist.state} onChange={(e) => setNewArtist((p: any) => ({ ...p, state: e.target.value }))} />
              <Input placeholder="Available leads" type="number" value={newArtist.available_leads} onChange={(e) => setNewArtist((p: any) => ({ ...p, available_leads: Number(e.target.value) }))} />

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
