"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, Star, Edit, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Fully mapped Artist type based on your API response
type FileItem = {
  id: number;
  file_name: string;
  file_type: string;
  tag: string;
  created_at: string;
  file_url: string;
  public_id?: string;
  is_active?: boolean;
};

type ArtistAPI = {
  id: number;
  user_phone: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  gender: string | null;
  date_of_birth: string | null;
  location: string | null; // e.g. "meerut, uttar pradesh - None"
  payment_status: string | null;
  status: string | null; // pending, approved, etc.
  internal_notes: string | null;
  profile_picture?: FileItem | null;
  certifications?: FileItem[];
  created_at?: string;
  my_referral_code?: string | null;
  // any other unknown fields are allowed
  [key: string]: any;
};

export default function ArtistProfilesPage() {
  const [artists, setArtists] = useState<ArtistAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showJsonId, setShowJsonId] = useState<number | null>(null);
  // helper: normalize number for whatsapp / tel

  const DEFAULT_TOKEN =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU2NzcxNDc2LCJpYXQiOjE3NTY0MTE0NzYsImp0aSI6Ijg0ODA3ZTRmMzhiMTQzNTliNWYwZWJiZTViMjA0ZjAzIiwidXNlcl9pZCI6MzR9.lGDCdX9QiSzeWGd8eYGLt5GFZBZJHxWwx7GD5hA1X_c";

  const fetchArtists = async () => {
    setLoading(true);
    setError(null);
    try {
      const tokenFromStorage =
        typeof window !== "undefined"
          ? sessionStorage.getItem("accessToken")
          : null;
      const token = tokenFromStorage
        ? `Bearer ${tokenFromStorage}`
        : DEFAULT_TOKEN;

      const url = new URL("https://api.wedmacindia.com/api/admin/artists");
      url.searchParams.set("Status", "all");

      const res = await fetch(url.toString(), {
        headers: { Authorization: token, "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed to fetch artists: ${res.status} ${txt}`);
      }

      const body = await res.json();
      const list: ArtistAPI[] = Array.isArray(body)
        ? body
        : body?.results ?? [];
      setArtists(list);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to fetch artists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (d?: string | null) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  };
  function normalizeDigits(input?: string) {
    if (!input) return "";
    return input.replace(/\D/g, "");
  }

  function formatForWhatsApp(mobile?: string) {
    const digits = normalizeDigits(mobile);
    if (!digits) return "";
    // If 10 digits, assume India and prepend 91
    if (digits.length === 10) return `91${digits}`;
    // If starts with 0 and 11 digits, drop leading 0 and prepend 91
    if (digits.length === 11 && digits.startsWith("0"))
      return `91${digits.slice(1)}`;
    // If already starts with country code (like 91...), return as is
    return digits;
  }

  function formatTelHref(mobile?: string) {
    const digits = normalizeDigits(mobile);
    if (!digits) return "";
    if (digits.length === 10) return `tel:+91${digits}`;
    if (digits.startsWith("0")) return `tel:+${digits.replace(/^0+/, "")}`;
    if (!digits.startsWith("+") && digits.length > 0) return `tel:+${digits}`;
    return `tel:${mobile}`;
  }
  function openWhatsApp(mobile?: string, message?: string) {
    const waNumber = formatForWhatsApp(mobile);
    if (!waNumber) {
      alert("No valid mobile number available to send WhatsApp.");
      return;
    }
    const text = message ? encodeURIComponent(message) : "";
    const url = `https://wa.me/${waNumber}${text ? `?text=${text}` : ""}`;
    window.open(url, "_blank");
  }

  function makeCall(user_phone?: string) {
    const tel = formatTelHref(user_phone);
    if (!tel) {
      alert("No valid mobile number available to call.");
      return;
    }
    // using location.href so mobile devices will invoke dialer
    window.location.href = tel;
  }
  const parseLocation = (loc?: string | null) => {
    if (!loc) return { city: "-", state: "-", extra: "" };
    // Expected format: "city, state - postal"
    const [cityPart, rest] = loc.split(",").map((s) => s && s.trim());
    const state = rest ? rest.split("-")[0].trim() : "-";
    const extra =
      rest && rest.includes("-")
        ? rest.split("-").slice(1).join("-").trim()
        : "";
    return { city: cityPart || "-", state: state || "-", extra };
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return artists.filter((a) => {
      if (activeTab !== "all") {
        const s = (a.status || "").toLowerCase();
        if (activeTab === "active" && !(s === "approved" || s === "active"))
          return false;
        if (activeTab === "pending" && s !== "pending") return false;
        if (activeTab === "inactive" && s !== "inactive" && s !== "rejected")
          return false;
      }
      if (!q) return true;
      const name = `${a.first_name ?? ""} ${a.last_name ?? ""}`.toLowerCase();
      return (
        name.includes(q) ||
        (a.email ?? "").toLowerCase().includes(q) ||
        (a.phone ?? "").toLowerCase().includes(q) ||
        (a.location ?? "").toLowerCase().includes(q)
      );
    });
  }, [artists, search, activeTab]);

  const renderBadge = (status?: string | null) => {
    const s = (status || "").toLowerCase();
    if (s === "approved" || s === "active")
      return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
    if (s === "pending")
      return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
    if (s === "rejected" || s === "inactive")
      return <Badge className="bg-red-100 text-red-800">{status}</Badge>;
    return (
      <Badge className="bg-gray-100 text-gray-800">{status ?? "unknown"}</Badge>
    );
  };

  const changeStatus = async (
    id: number,
    newStatus: string,
    opts?: { askNotes?: boolean; notes?: string | null }
  ) => {
    // ask for notes if requested and none passed
    let notes = opts?.notes ?? null;
    if (opts?.askNotes && notes == null) {
      // use native prompt to keep UI simple (you can replace with a modal later)
      try {
        // eslint-disable-next-line no-alert
        const input = window.prompt("Internal notes (optional):", "");
        notes = input === null ? null : input; // null means the user cancelled; empty string means no notes
      } catch {
        notes = null;
      }
    }

    const prev = artists.slice();
    // optimistic update: update status and internal_notes locally immediately
    setArtists((s) =>
      s.map((a) =>
        a.id === id
          ? {
              ...a,
              status: newStatus,
              internal_notes: notes ?? a.internal_notes,
            }
          : a
      )
    );

    try {
      const tokenFromStorage =
        typeof window !== "undefined"
          ? sessionStorage.getItem("accessToken")
          : null;
      const token = tokenFromStorage
        ? `Bearer ${tokenFromStorage}`
        : DEFAULT_TOKEN;

      // try the endpoint that your curl used first (POST /api/admin/artist/:id/status/)
      const postUrl = `https://api.wedmacindia.com/api/admin/artist/${id}/status-approved/`;
      const postRes = await fetch(postUrl, {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify(
          notes != null && notes !== ""
            ? { status: newStatus, internal_notes: notes }
            : { status: newStatus }
        ),
      });

      if (postRes.ok) {
        // success: optionally update more fields from response
        try {
          const body = await postRes.json().catch(() => null);
          if (body && typeof body === "object") {
            setArtists((s) =>
              s.map((a) => (a.id === id ? { ...a, ...body } : a))
            );
          }
        } catch {}
        toast.success("Status updated successfully!"); // <--- Toast here

        return;
      }

      // if POST failed, try the older PATCH endpoint (some backends expect this)
      const patchUrl = `https://api.wedmacindia.com/api/admin/artists/${id}/`;
      const patchRes = await fetch(patchUrl, {
        method: "PATCH",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify(
          notes != null && notes !== ""
            ? { status: newStatus, internal_notes: notes }
            : { status: newStatus }
        ),
      });

      if (patchRes.ok) {
        const body = await patchRes.json().catch(() => null);
        if (body && typeof body === "object") {
          setArtists((s) =>
            s.map((a) => (a.id === id ? { ...a, ...body } : a))
          );
        }
        toast.success("Status updated successfully!"); // <--- Toast here also

        return;
      }

      // both failed -> throw to catch block
      const postText = await postRes.text().catch(() => "");
      const patchText = await patchRes.text().catch(() => "");
      throw new Error(
        `Status update failed. POST: ${postRes.status} ${postText} | PATCH: ${patchRes.status} ${patchText}`
      );
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to update status");
      // revert optimistic update
      setArtists(prev);
      // optional: show alert to user
      // eslint-disable-next-line no-alert
      alert("Failed to update status: " + (err?.message || "unknown error"));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Artist Profiles</h1>
          <p className="text-gray-600 mt-1">
            Showing every field returned by the API in a clear layout
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search profiles..."
              className="pl-8 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => fetchArtists()}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v)}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Profiles</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="inactive">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {loading ? (
            <div className="py-8 text-center">Loading artists...</div>
          ) : error ? (
            <div className="py-4 text-red-600">{error}</div>
          ) : (
            filtered.map((artist) => {
              const loc = parseLocation(artist.location);
              return (
                <Card
                  key={artist.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left column: avatar + quick stats */}
                      <div className="flex flex-col items-center space-y-3 w-full md:w-56">
                        <Avatar className="h-70 w-50 rounded-none">
                          {artist.profile_picture?.file_url ? (
                            <AvatarImage
                              src={artist.profile_picture.file_url}
                              className="h-70 w-50 rounded-none"
                            />
                          ) : (
                            <>
                              <AvatarImage
                                src={`/placeholder.svg?height=160&width=160`}
                                className="h-70 w-50 rounded-none"
                              />
                              <AvatarFallback className="bg-gradient-to-br from-[#FF6B9D] to-[#FF5A8C] text-white text-4xl h-70 w-50 rounded-none flex items-center justify-center">
                                {(artist.first_name ?? "").charAt(0) || "A"}
                              </AvatarFallback>
                            </>
                          )}
                        </Avatar>

                        <div className="text-center">
                          <div className="flex items-center justify-center">
                            {/* <Star className="h-4 w-4 text-yellow-500" /> */}
                            {/* <span className="ml-1 font-medium">{(Math.round((Math.random() * 20) / 1) / 4 + 4).toFixed(1)}</span> */}
                          </div>
                          {/* <p className="text-sm text-gray-500">{Math.floor(Math.random() * 100)} bookings</p> */}
                        </div>

                        {/* {renderBadge(artist.status)} */}
                      </div>

                      {/* Right column: full structured details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold">{`${
                              artist.first_name ?? ""
                            } ${artist.last_name ?? ""}`}</h3>
                            <p className="text-gray-600">
                              {artist.email ?? artist.phone}
                            </p>
                            <p className="text-sm text-gray-500">
                              {artist.location}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                {/* <DropdownMenuItem onClick={() => alert("View Full Profile: " + artist.id)}>View Full Profile</DropdownMenuItem> */}
                                <DropdownMenuItem
                                  onClick={() => {
                                    makeCall(artist.user_phone);
                                  }}
                                >
                                  Call
                                </DropdownMenuItem>

                                {/* NEW: WhatsApp action */}
                                <DropdownMenuItem
                                  onClick={() => {
                                    openWhatsApp(
                                      artist.user_phone,
                                      `Hi ${artist.first_name || ""},\n\n${
                                        artist.internal_notes || ""
                                      }`
                                    );
                                  }}
                                >
                                  Send WhatsApp
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {/* <DropdownMenuItem onClick={() => changeStatus(artist.id, "approved")}>Mark Approved</DropdownMenuItem> */}
                                {/* <DropdownMenuItem className="text-red-500" onClick={() => changeStatus(artist.id, "rejected")}>
                                  Deactivate
                                </DropdownMenuItem> */}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">Phone</div>
                            <div className="font-medium">
                              {artist.phone ?? "-"}
                            </div>

                            <div className="text-xs text-gray-500 mt-3">
                              DOB
                            </div>
                            <div className="font-medium">
                              {artist.date_of_birth ?? "-"}
                            </div>

                            <div className="text-xs text-gray-500 mt-3">
                              Gender
                            </div>
                            <div className="font-medium">
                              {artist.gender ?? "-"}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">
                              Location (City)
                            </div>
                            <div className="font-medium">{loc.city}</div>

                            <div className="text-xs text-gray-500 mt-3">
                              State
                            </div>
                            <div className="font-medium">{loc.state}</div>

                            <div className="text-xs text-gray-500 mt-3">
                              Postal / Extra
                            </div>
                            <div className="font-medium">
                              {loc.extra || "-"}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">
                              Payment Status
                            </div>
                            <div className="font-medium">
                              {artist.payment_status ?? "-"}
                            </div>

                            <div className="text-xs text-gray-500 mt-3">
                              Referral Code
                            </div>
                            <div className="font-medium">
                              {artist.my_referral_code ?? "-"}
                            </div>

                            <div className="text-xs text-gray-500 mt-3">
                              Created At
                            </div>
                            <div className="font-medium">
                              {formatDate(artist.created_at)}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Internal Notes / Bio
                          </h4>
                          <p className="text-sm text-gray-700">
                            {artist.internal_notes || "-"}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Certifications (
                            {(artist.certifications || []).length})
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {(artist.certifications || []).map(
                              (c: FileItem) => (
                                <a
                                  key={c.id}
                                  href={c.file_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block"
                                >
                                  <img
                                    src={c.file_url}
                                    alt={c.file_name}
                                    className="h-20 w-28 object-cover rounded-md border"
                                  />
                                  <div className="text-xs mt-1 text-gray-600">
                                    {c.tag}
                                  </div>
                                </a>
                              )
                            )}
                            {(artist.certifications || []).length === 0 && (
                              <div className="text-sm text-gray-500">
                                No certifications
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t">
                          {/* <div>
                            <p className="text-sm font-medium">Other fields</p>
                            <p className="text-sm text-gray-600">If API returns additional keys, they are shown in raw JSON.</p>
                          </div> */}

                          {/* <div className="flex gap-2">
                            <Button className="bg-[#FF6B9D] hover:bg-[#FF5A8C]" onClick={() => alert("View bookings for " + artist.id)}>
                              View Bookings
                            </Button>
                          </div> */}
                        </div>

                        {/* Raw JSON drawer using native <details> to keep it simple */}
                        {showJsonId === artist.id && (
                          <details open className="mt-4 bg-gray-50 p-3 rounded">
                            <summary className="cursor-pointer font-medium">
                              JSON (click to collapse)
                            </summary>
                            <pre className="text-xs mt-2 overflow-auto">
                              {JSON.stringify(artist, null, 2)}
                            </pre>
                            <div className="mt-2 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigator.clipboard?.writeText(
                                    JSON.stringify(artist)
                                  )
                                }
                              >
                                Copy JSON
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => setShowJsonId(null)}
                              >
                                Close
                              </Button>
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="active">
          <div className="space-y-6">
            {filtered.filter(
              (a) =>
                (a.status || "").toLowerCase() === "approved" ||
                (a.status || "").toLowerCase() === "active"
            ).length === 0 ? (
              <Card>
                <CardContent className="p-6">No active artists</CardContent>
              </Card>
            ) : (
              filtered
                .filter(
                  (a) =>
                    (a.status || "").toLowerCase() === "approved" ||
                    (a.status || "").toLowerCase() === "active"
                )
                .map((a) => (
                  <Card
                    key={a.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            {a.profile_picture?.file_url ? (
                              <AvatarImage src={a.profile_picture.file_url} />
                            ) : (
                              <AvatarFallback>
                                {(a.first_name ?? "").charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium">{`${
                              a.first_name ?? ""
                            } ${a.last_name ?? ""}`}</div>
                            <div className="text-sm text-gray-500">
                              {a.email ?? a.phone}
                            </div>
                          </div>
                        </div>
                        {renderBadge(a.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="space-y-6">
            {filtered.filter(
              (a) => (a.status || "").toLowerCase() === "pending"
            ).length === 0 ? (
              <Card>
                <CardContent className="p-6">No pending artists</CardContent>
              </Card>
            ) : (
              filtered
                .filter((a) => (a.status || "").toLowerCase() === "pending")
                .map((a) => (
                  <Card
                    key={a.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            {a.profile_picture?.file_url ? (
                              <AvatarImage src={a.profile_picture.file_url} />
                            ) : (
                              <AvatarFallback>
                                {(a.first_name ?? "").charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium">{`${
                              a.first_name ?? ""
                            } ${a.last_name ?? ""}`}</div>
                            <div className="text-sm text-gray-500">
                              {a.email ?? a.phone}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              changeStatus(a.id, "approved", { askNotes: true })
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              changeStatus(a.id, "rejected", { askNotes: true })
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="inactive">
          <div className="space-y-6">
            {filtered.filter(
              (a) =>
                (a.status || "").toLowerCase() === "inactive" ||
                (a.status || "").toLowerCase() === "rejected"
            ).length === 0 ? (
              <Card>
                <CardContent className="p-6">No inactive artists</CardContent>
              </Card>
            ) : (
              filtered
                .filter(
                  (a) =>
                    (a.status || "").toLowerCase() === "inactive" ||
                    (a.status || "").toLowerCase() === "rejected"
                )
                .map((a) => (
                  <Card
                    key={a.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            {a.profile_picture?.file_url ? (
                              <AvatarImage src={a.profile_picture.file_url} />
                            ) : (
                              <AvatarFallback>
                                {(a.first_name ?? "").charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium">{`${
                              a.first_name ?? ""
                            } ${a.last_name ?? ""}`}</div>
                            <div className="text-sm text-gray-500">
                              {a.email ?? a.phone}
                            </div>
                          </div>
                        </div>
                        {renderBadge(a.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
