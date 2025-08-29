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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Artist = {
  id: number;
  user_phone: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  gender: string | null;
  date_of_birth: string | null;
  location: string | null;
  payment_status: string | null;
  status: string | null; // e.g. pending, approved, inactive
  internal_notes: string | null;
  profile_picture?: {
    file_url?: string | null;
  } | null;
  certifications?: any[];
  created_at?: string;
  my_referral_code?: string | null;
};

export default function ArtistListPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all");

  // Try to read token from sessionStorage first, fallback to the token used in your curl (if you want)
  const DEFAULT_TOKEN =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU2NzcxNDc2LCJpYXQiOjE3NTY0MTE0NzYsImp0aSI6Ijg0ODA3ZTRmMzhiMTQzNTliNWYwZWJiZTViMjA0ZjAzIiwidXNlcl9pZCI6MzR9.lGDCdX9QiSzeWGd8eYGLt5GFZBZJHxWwx7GD5hA1X_c";

  const fetchArtists = async () => {
    setLoading(true);
    setError(null);
    try {
      const tokenFromStorage = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null;
      const token = tokenFromStorage ? `Bearer ${tokenFromStorage}` : DEFAULT_TOKEN;

      // Use the same endpoint as your curl. The example curl had a small typo ' Status',
      // so we'll request the endpoint without the space and include Status=all as a query param.
      const url = new URL("https://wedmac-be.onrender.com/api/admin/artists");
      url.searchParams.set("Status", "all");

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error: ${res.status} ${text}`);
      }

      const data: Artist[] = await res.json();

      // sometimes API returns an object with a results key — handle both shapes gracefully
      let list: Artist[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data && typeof data === "object" && "results" in data && Array.isArray((data as any).results)) {
        list = (data as { results: Artist[] }).results;
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

      // booking count is not part of API response; keeping as 0 or derive from another field if present
    }
    c.total = artists.length;
    return c;
  }, [artists]);

  // Filter + search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return artists.filter((a) => {
      if (statusFilter !== "all" && (a.status || "").toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (!q) return true;
      // search in name, phone, email, location
      const name = `${a.first_name ?? ""} ${a.last_name ?? ""}`.toLowerCase();
      return (
        name.includes(q) ||
        (a.phone ?? "").toLowerCase().includes(q) ||
        (a.email ?? "").toLowerCase().includes(q) ||
        (a.location ?? "").toLowerCase().includes(q)
      );
    });
  }, [artists, search, statusFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    // If filtering/searching reduces pages, clamp current page
    if (page > pages) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages]);

  const renderBadge = (status?: string | null) => {
    const s = (status || "").toLowerCase();
    if (s === "approved" || s === "active") return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
    if (s === "pending") return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
    if (s === "rejected" || s === "inactive") return <Badge className="bg-red-100 text-red-800">{status}</Badge>;
    return <Badge className="bg-gray-100 text-gray-800">{status || "unknown"}</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Artist Management</h1>
          <p className="text-gray-600 mt-1">Manage all makeup artists on your platform</p>
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
                      <TableHead>Status</TableHead>
                      {/* <TableHead className="text-right">Actions</TableHead> */}
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
                        <TableCell> {new Date(artist.created_at?? "-").toISOString().split("T")[0]}</TableCell>
                        <TableCell>{artist.user_phone ?? "-"}</TableCell>
                        <TableCell>{renderBadge(artist.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            {/* <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger> */}
                            {/* <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => alert("View profile: " + artist.id)}>View Profile</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => alert("Edit: " + artist.id)}>Edit Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => alert("Change status for: " + artist.id)}>Change Status</DropdownMenuItem>
                          
                            </DropdownMenuContent> */}
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}

                    {paginated.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center text-gray-500">
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
    </div>
  );
}
