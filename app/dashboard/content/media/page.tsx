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

type Claim = {
  id: number;
  claimant_name?: string | null;
  claimant_phone?: string | null;
  claimant_email?: string | null;
  lead?: number | null;
  artist?: number | null;
  reason?: string | null;
  details?: string | null;
  status?: "pending" | "approved" | "rejected" | string;
  created_at?: string | null;
  // any other fields returned by API
  [k: string]: any;
};

export default function FalseClaimsAdminPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [counts, setCounts] = useState({ all: 0, pending: 0, approved: 0, rejected: 0 });

  // simple modal state for resolve action
  const [modalOpen, setModalOpen] = useState(false);
  const [activeClaim, setActiveClaim] = useState<Claim | null>(null);
  const [resolveStatus, setResolveStatus] = useState<"approved" | "rejected">("approved");
  const [adminNote, setAdminNote] = useState("");
  const [resolving, setResolving] = useState(false);

  const DEFAULT_TOKEN =
    typeof window !== "undefined"
      ? undefined
      : ""; // no server-side token here; component will read sessionStorage at runtime

  const getAuthHeader = () => {
    if (typeof window === "undefined") return "";
    const stored = sessionStorage.getItem("accessToken") || sessionStorage.getItem("token") || sessionStorage.getItem("authToken");
    return stored ? `Bearer ${stored}` : "";
  };

  const fetchClaims = async (status: string | null = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("https://api.wedmacindia.com/api/leads/false-claims/admin/");
      if (status && status !== "all") url.searchParams.set("status", status);

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error: ${res.status} ${text}`);
      }

      const json = await res.json();

      // Expecting shape: { claims: [...], counts: { all, pending, approved, rejected } }
 let list: Claim[] = [];
if (Array.isArray(json?.claims)) {
  list = json.claims.map((c: any) => ({
    ...c,
    claimant_name: `${c.lead_first_name || ""} ${c.lead_last_name || ""}`.trim(),
    claimant_phone: c.lead_phone,
  }));
}


      setClaims(list);

      if (json?.counts) {
        setCounts({
          all: Number(json.counts.all || list.length || 0),
          pending: Number(json.counts.pending || 0),
          approved: Number(json.counts.approved || 0),
          rejected: Number(json.counts.rejected || 0),
        });
      } else {
        // derive counts client-side if counts not provided
        const c = { all: list.length, pending: 0, approved: 0, rejected: 0 };
        for (const cl of list) {
          const s = (cl.status || "").toLowerCase();
          if (s === "pending") c.pending++;
          else if (s === "approved") c.approved++;
          else if (s === "rejected") c.rejected++;
        }
        setCounts(c);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load claims");
      setClaims([]);
    } finally {
      setLoading(false);
      setPage(1);
    }
  };

  useEffect(() => {
    // On mount, fetch all claims
    fetchClaims(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return claims.filter((c) => {
      if (statusFilter !== "all" && (c.status || "").toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (!q) return true;
      const name = `${c.claimant_name ?? ""}`.toLowerCase();
      return (
        name.includes(q) ||
        String(c.claimant_phone ?? "").toLowerCase().includes(q) ||
        String(c.claimant_email ?? "").toLowerCase().includes(q) ||
        String(c.reason ?? "").toLowerCase().includes(q) ||
        String(c.details ?? "").toLowerCase().includes(q)
      );
    });
  }, [claims, search, statusFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > pages) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages]);

  const openResolveModal = (claim: Claim) => {
    setActiveClaim(claim);
    setResolveStatus("approved");
    setAdminNote("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveClaim(null);
    setResolving(false);
  };

  const resolveClaim = async () => {
    if (!activeClaim) return;
    setResolving(true);
    try {
      const url = `https://api.wedmacindia.com/api/leads/false-claims/${activeClaim.id}/resolve/`;
      const body = { status: resolveStatus, admin_note: adminNote };
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        console.error("Resolve failed", res.status, json);
        toast.error(json?.message || `Resolve failed: ${res.status}`);
        return;
      }

      toast.success("Claim updated");

      // update local state: set claim status, update counts
      setClaims((prev) => prev.map((c) => (c.id === activeClaim.id ? { ...c, status: resolveStatus } : c)));
      setCounts((prev) => {
        const next = { ...prev };
        // decrement previous status if present
        const prevStatus = (activeClaim.status || "").toLowerCase();
        if (prevStatus && prevStatus in next) {
          // @ts-ignore
          next[prevStatus] = Math.max(0, (next as any)[prevStatus] - 1);
        }
        // increment new status
        if (resolveStatus in next) {
          // @ts-ignore
          next[resolveStatus] = (next as any)[resolveStatus] + 1;
        }
        return next;
      });

      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update claim");
    } finally {
      setResolving(false);
    }
  };

  const renderBadge = (status?: string | null) => {
    const s = (status || "").toLowerCase();
    if (s === "approved") return <Badge className="bg-green-50 text-green-800">{status}</Badge>;
    if (s === "pending") return <Badge className="bg-yellow-50 text-yellow-800">{status}</Badge>;
    if (s === "rejected") return <Badge className="bg-red-50 text-red-800">{status}</Badge>;
    return <Badge className="bg-gray-50 text-gray-800">{status || "unknown"}</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">False Claims — Admin</h1>
          <p className="text-sm text-gray-600">Review and resolve reported false claims</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => fetchClaims(statusFilter === "all" ? null : statusFilter)}>Refresh</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500">All</p>
              <p className="text-xl font-bold">{counts.all}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded">
              <p className="text-xs text-yellow-600">Pending</p>
              <p className="text-xl font-bold">{counts.pending}</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-xs text-green-600">Approved</p>
              <p className="text-xl font-bold">{counts.approved}</p>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <p className="text-xs text-red-600">Rejected</p>
              <p className="text-xl font-bold">{counts.rejected}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search claims..."
                className="w-64"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
                className="px-2 py-1 rounded border"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">Loading claims…</div>
          ) : error ? (
            <div className="py-4 text-red-600">{error}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim ID</TableHead>
                      <TableHead>Claimant</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((c) => (
                      <TableRow key={c.id} className="hover:bg-gray-50">
                        <TableCell>{c.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{c.lead_first_name || "-"}</div>
                          <div className="text-xs text-gray-500">{c.lead_last_name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">{c.lead_phone ?? "-"}</div>
                          {/* <div className="text-xs text-gray-500">{c.lead_email ?? "-"}</div> */}
                        </TableCell>
<TableCell className="max-w-md break-words text-sm">
  <div>{c.reason ?? c.details ?? "-"}</div>
  {Array.isArray(c.proof_documents) && c.proof_documents.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {c.proof_documents.map((doc: any) =>
        doc.file_type === "image" ? (
          <a key={doc.id} href={doc.file_url} target="_blank" rel="noopener noreferrer">
            <img
              src={doc.file_url}
              alt={doc.file_name}
              className="w-16 h-16 object-cover rounded border"
            />
          </a>
        ) : (
          <a
            key={doc.id}
            href={doc.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 underline"
          >
            {doc.file_name}
          </a>
        )
      )}
    </div>
  )}
</TableCell>
                        <TableCell>{c.created_at ? new Date(c.created_at).toISOString().split("T")[0] : "-"}</TableCell>
                        <TableCell>{renderBadge(c.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" onClick={() => openResolveModal(c)}>Resolve</Button>
                          </div>
                        </TableCell>
                        
                      </TableRow>
                    ))}

                    {paginated.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center text-gray-500">No claims found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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

      {/* --- Simple modal for resolve --- */}
      {modalOpen && activeClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative max-w-xl w-full bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Resolve Claim #{activeClaim.id}</h3>
            <p className="text-sm text-gray-600 mb-4">Reported by: {activeClaim.claimant_name ?? "-"} — {activeClaim.claimant_phone ?? activeClaim.claimant_email ?? "-"}</p>

            <div className="space-y-2">
              <div>
                <label className="block text-sm mb-1">Action</label>
                <select value={resolveStatus} onChange={(e) => setResolveStatus(e.target.value as any)} className="w-full p-2 rounded border">
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Admin note (optional)</label>
                <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={4} className="w-full p-2 rounded border" />
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <Button variant="ghost" onClick={closeModal}>Cancel</Button>
                <Button onClick={resolveClaim} disabled={resolving}>{resolving ? "Saving..." : "Save"}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
