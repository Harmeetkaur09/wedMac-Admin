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
import { toast } from "react-hot-toast";
import { Trash, Edit } from "lucide-react";

type Ticket = {
  id: number;
  artist_username?: string | null;
  artist_email?: string | null;
  subject?: string | null;
  category?: string | null;
  priority?: "low" | "medium" | "high" | "urgent" | string;
  description?: string | null;
  status?: "open" | "in_progress" | "resolved" | "closed" | string;
  created_at?: string | null;
  updated_at?: string | null;
  admin_response?: string | null;
  resolved_at?: string | null;
  artist?: number | null;
  [k: string]: any;
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | string>("all");
  const [page, setPage] = useState(1);
  const perPage = 12;
  const [counts, setCounts] = useState<Record<string, number>>({ all: 0, open: 0, in_progress: 0, resolved: 0, closed: 0 });

  const [editOpen, setEditOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [newStatus, setNewStatus] = useState<Ticket["status"]>("open");
  const [adminResponse, setAdminResponse] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // helper to read auth from sessionStorage (adjust keys as needed)
  const getAuthHeader = () => {
    if (typeof window === "undefined") return "";
    const stored =
      sessionStorage.getItem("accessToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken");
    return stored ? `Bearer ${stored}` : "";
  };

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.wedmacindia.com";

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${API_BASE}/api/support/admin/tickets/`);
      // we fetch all; filtering & pagination done client-side for simplicity
      const auth = getAuthHeader();
      const res = await fetch(url.toString(), {
        headers: {
          ...(auth ? { Authorization: auth } : {}),
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API error: ${res.status} ${txt}`);
      }

      const json = await res.json();
      const list: Ticket[] = Array.isArray(json) ? json : json?.tickets || [];
      setTickets(list);

      // counts
      const c: Record<string, number> = { all: list.length, open: 0, in_progress: 0, resolved: 0, closed: 0 };
      for (const t of list) {
        const s = (t.status || "").toLowerCase();
        if (s in c) c[s] = (c[s] || 0) + 1;
      }
      setCounts(c);
      setPage(1);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) => {
      if (statusFilter !== "all" && (t.status || "").toLowerCase() !== statusFilter) return false;
      if (priorityFilter !== "all" && (t.priority || "").toLowerCase() !== priorityFilter) return false;
      if (!q) return true;
      return (
        String(t.id).includes(q) ||
        (t.artist_username || "").toLowerCase().includes(q) ||
        (t.artist_email || "").toLowerCase().includes(q) ||
        (t.subject || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q)
      );
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > pages) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages]);

  // open edit modal
  const openEdit = (t: Ticket) => {
    setActiveTicket(t);
    setNewStatus((t.status as Ticket["status"]) || "open");
    setAdminResponse(t.admin_response || "");
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setActiveTicket(null);
    setSaving(false);
  };

  // PATCH update
  const saveTicket = async () => {
    if (!activeTicket) return;
    setSaving(true);
    try {
      const url = `${API_BASE}/api/support/admin/tickets/${activeTicket.id}/`;
      const body = { status: newStatus, admin_response: adminResponse };
      const auth = getAuthHeader();
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          ...(auth ? { Authorization: auth } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        console.error("Update failed", res.status, json);
        toast.error(json?.message || `Failed to update: ${res.status}`);
        return;
      }

      toast.success("Ticket updated");
      // update local
      setTickets((prev) => prev.map((p) => (p.id === activeTicket.id ? { ...p, status: newStatus, admin_response: adminResponse, updated_at: new Date().toISOString() } : p)));
      // recalc counts
      setCounts((prev) => {
        const next = { ...prev } as Record<string, number>;
        const prevStatus = (activeTicket.status || "").toLowerCase();
        if (prevStatus && prevStatus in next) next[prevStatus] = Math.max(0, (next[prevStatus] || 1) - 1);
        const ns = (newStatus || "").toLowerCase();
        if (ns in next) next[ns] = (next[ns] || 0) + 1;
        return next;
      });

      closeEdit();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update ticket");
    } finally {
      setSaving(false);
    }
  };

  const openDelete = (t: Ticket) => {
    setActiveTicket(t);
    setDeleteOpen(true);
  };
  const closeDelete = () => {
    setDeleteOpen(false);
    setActiveTicket(null);
    setDeleting(false);
  };

  const confirmDelete = async () => {
    if (!activeTicket) return;
    setDeleting(true);
    try {
      const url = `${API_BASE}/api/support/admin/tickets/${activeTicket.id}/delete/`;
      const auth = getAuthHeader();
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          ...(auth ? { Authorization: auth } : {}),
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error("Delete failed", res.status, txt);
        toast.error(`Failed to delete: ${res.status}`);
        return;
      }
      toast.success("Ticket deleted");
      setTickets((prev) => prev.filter((p) => p.id !== activeTicket.id));
      // recalc counts simply
      setCounts((prev) => ({ ...prev, all: Math.max(0, (prev.all || 1) - 1) }));
      closeDelete();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete ticket");
    } finally {
      setDeleting(false);
    }
  };

  const renderStatusBadge = (s?: string | null) => {
    const v = (s || "").toLowerCase();
    if (v === "open") return <Badge className="bg-blue-50 text-blue-800">Open</Badge>;
    if (v === "in_progress") return <Badge className="bg-yellow-50 text-yellow-800">In Progress</Badge>;
    if (v === "resolved") return <Badge className="bg-green-50 text-green-800">Resolved</Badge>;
    if (v === "closed") return <Badge className="bg-gray-50 text-gray-800">Closed</Badge>;
    return <Badge className="bg-gray-50 text-gray-800">{s || "-"}</Badge>;
  };

  const renderPriorityBadge = (p?: string | null) => {
    const v = (p || "").toLowerCase();
    if (v === "urgent") return <Badge className="bg-red-50 text-red-800">Urgent</Badge>;
    if (v === "high") return <Badge className="bg-red-100 text-red-800">High</Badge>;
    if (v === "medium") return <Badge className="bg-yellow-50 text-yellow-800">Medium</Badge>;
    if (v === "low") return <Badge className="bg-green-50 text-green-800">Low</Badge>;
    return <Badge className="bg-gray-50 text-gray-800">{p || "-"}</Badge>;
  };

  const formatDate = (iso?: string | null) => (iso ? new Date(iso).toISOString().split("T")[0] : "-");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Support Tickets </h1>
        </div>
        <div className="flex gap-2">
          {/* <Button onClick={() => fetchTickets()}>Refresh</Button> */}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500">All</p>
              <p className="text-xl font-bold">{counts.all}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-xs text-blue-600">Open</p>
              <p className="text-xl font-bold">{counts.open}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded">
              <p className="text-xs text-yellow-600">In Progress</p>
              <p className="text-xl font-bold">{counts.in_progress}</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-xs text-green-600">Resolved</p>
              <p className="text-xl font-bold">{counts.resolved}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-600">Closed</p>
              <p className="text-xl font-bold">{counts.closed}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none">
                <Input
                  placeholder="Search tickets by id, username, email, subject..."
                  className="w-full"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setPage(1);
                }}
                className="px-2 py-1 rounded border"
              >
                <option value="all">All status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value as any);
                  setPage(1);
                }}
                className="px-2 py-1 rounded border"
              >
                <option value="all">All priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-8 text-center">Loading tickets…</div>
          ) : error ? (
            <div className="py-4 text-red-600">{error}</div>
          ) : (
            <>
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Subject / Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((t) => (
                      <TableRow key={t.id} className="hover:bg-gray-50">
                        <TableCell>#{t.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{t.artist_username ?? "-"}</div>
                          <div className="text-xs text-gray-500">{t.artist}</div>
                        </TableCell>
                        <TableCell className="text-xs">{t.artist_email ?? "-"}</TableCell>
                        <TableCell className="max-w-md break-words text-sm">
                          <div className="font-medium">{t.subject ?? "-"}</div>
                          <div className="text-xs text-gray-500">{t.category ?? "-"}</div>
                          <div className="mt-1 text-sm text-gray-700 line-clamp-2">{t.description ?? "-"}</div>
                        </TableCell>
                        <TableCell>{renderPriorityBadge(t.priority)}</TableCell>
                        <TableCell>{formatDate(t.created_at)}</TableCell>
                        <TableCell>{renderStatusBadge(t.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" onClick={() => openEdit(t)}>
                              <Edit size={14} />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => openDelete(t)}>
                              <Trash size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                    {paginated.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="py-8 text-center text-gray-500">No tickets found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* mobile cards */}
              <div className="sm:hidden space-y-3">
                {paginated.map((t) => (
                  <div key={t.id} className="bg-white border rounded-lg p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium">#{t.id} — {t.artist_username}</p>
                            <p className="text-xs text-gray-500">{t.artist_email ?? "-"}</p>
                          </div>
                          <div>{renderStatusBadge(t.status)}</div>
                        </div>

                        <div className="mt-2 text-sm text-gray-700 line-clamp-2">{t.subject ?? t.description ?? "-"}</div>
                        <div className="mt-2">{renderPriorityBadge(t.priority)}</div>
                        <div className="mt-2 text-xs text-gray-400">{formatDate(t.created_at)}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div />
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => openEdit(t)}>Update</Button>
                        <Button size="sm" variant="destructive" onClick={() => openDelete(t)}>Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                <div className="px-3 py-2 rounded bg-[#FF6B9D] text-white">{page}</div>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>Next</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit modal */}
      {editOpen && activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeEdit} />
          <div className="relative max-w-xl w-full bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Update Ticket #{activeTicket.id}</h3>
            <p className="text-sm text-gray-600 mb-4">Subject: {activeTicket.subject}</p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as any)} className="w-full p-2 rounded border">
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Admin response (optional)</label>
                <textarea value={adminResponse} onChange={(e) => setAdminResponse(e.target.value)} rows={5} className="w-full p-2 rounded border" />
              </div>

              <div className="flex justify-between items-center gap-2 mt-3">
                <div className="text-sm text-gray-500">Updated: {formatDate(activeTicket.updated_at)}</div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={closeEdit}>Cancel</Button>
                  <Button onClick={saveTicket} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteOpen && activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeDelete} />
          <div className="relative max-w-md w-full bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Delete Ticket #{activeTicket.id}?</h3>
            <p className="text-sm text-gray-600 mb-4">This will permanently delete the ticket. Use with caution.</p>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={closeDelete}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
