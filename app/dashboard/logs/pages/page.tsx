"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, MoreHorizontal, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type LogDetails = Record<string, any>;

type ActivityLog = {
  id: number;
  activity_type: string;
  timestamp: string;
  leads_before?: number;
  leads_after?: number;
  details?: LogDetails;
  artist_name?: string;
  artist_phone?: string;
  [k: string]: any;
};

export default function ArtistActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // pagination/meta from API
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  const [query, setQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState<string>("");

  const [rawOpen, setRawOpen] = useState(false);
  const [rawJson, setRawJson] = useState<any>(null);

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [activeDetail, setActiveDetail] = useState<LogDetails | null>(null);

  const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});

  const getToken = () => (typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null);

  async function fetchLogs(page = 1) {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      // adjust base URL if your API lives elsewhere
      const url = `https://api.wedmacindia.com/api/artists/activity-logs/?page=${page}&page_size=${pageSize}`;
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // The API you showed returns { logs: [...], total_count, total_pages, current_page, page_size }
      setRawJson(data);
      setLogs(Array.isArray(data.logs) ? data.logs : []);
      setTotalCount(data.total_count ?? data.count ?? 0);
      setTotalPages(data.total_pages ?? data.total_pages ?? 1);
      setCurrentPage(data.current_page ?? page);
      setPageSize(data.page_size ?? pageSize);
    } catch (err: any) {
      console.error("fetchLogs:", err);
      setError(err?.message || "Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const filtered = useMemo(() => {
    let arr = logs;
    if (activityFilter) arr = arr.filter((l) => l.activity_type === activityFilter);
    if (!query) return arr;
    const q = query.toLowerCase();
    return arr.filter(
      (l) =>
        String(l.artist_name || "").toLowerCase().includes(q) ||
        String(l.artist_phone || "").toLowerCase().includes(q) ||
        String(l.activity_type || "").toLowerCase().includes(q) ||
        JSON.stringify(l.details || "").toLowerCase().includes(q)
    );
  }, [logs, query, activityFilter]);

  function formatDate(iso?: string) {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return iso;
    }
  }

  function openDetails(details: LogDetails | undefined) {
    setActiveDetail(details ?? null);
    setDetailDialogOpen(true);
  }

  function toggleExpand(id: number) {
    setExpandedIds((s) => ({ ...s, [id]: !s[id] }));
  }

  function downloadRawJson() {
    if (!rawJson) return;
    const blob = new Blob([JSON.stringify(rawJson, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `artist-activity-logs-page-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const activityTypes = useMemo(() => Array.from(new Set(logs.map((l) => l.activity_type).filter(Boolean))), [logs]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Artist Activity Logs Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Logs</p>
              <p className="text-2xl font-bold">{totalCount}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Total Pages</p>
              <p className="text-2xl font-bold">{totalPages}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-700 font-medium">Current Page</p>
              <p className="text-2xl font-bold">{currentPage}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Page Size</p>
              <p className="text-2xl font-bold">{pageSize}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Activity Logs</CardTitle>

          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
            <select
              className="w-full sm:w-auto border px-2 py-1 rounded"
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
            >
              <option value="">All Types</option>
              {activityTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <div className="relative flex-1 sm:flex-none w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search name / phone / activity / details..."
                className="pl-8 w-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <Button variant="outline" size="icon" className="self-start" onClick={() => setRawOpen((s) => !s)}>
              <Filter className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={downloadRawJson}>
              Download JSON
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* RAW JSON panel toggle */}
          {rawOpen && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">Raw API response (full)</div>
                <div className="text-xs text-gray-500">Fetched at: {new Date().toLocaleString()}</div>
              </div>
              <pre className="max-h-64 overflow-auto bg-black/5 p-3 rounded text-xs">{JSON.stringify(rawJson, null, 2)}</pre>
            </div>
          )}

          {/* MOBILE: cards */}
          <div className="sm:hidden space-y-3">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">Error: {error}</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No logs found.</div>
            ) : (
              filtered.map((l) => (
                <div key={l.id} className="bg-white border rounded-lg p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{l.activity_type} • {l.artist_name}</p>
                      <p className="text-sm text-gray-600 truncate">{l.artist_phone}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(l.timestamp)}</p>

                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gray-100 text-gray-800">{l.leads_before ?? "-"} → {l.leads_after ?? "-"}</Badge>
                          <button
                            aria-label={expandedIds[l.id] ? "Collapse" : "Expand"}
                            onClick={() => toggleExpand(l.id)}
                            className="text-sm text-[#FF6B9D] hover:underline"
                          >
                            {expandedIds[l.id] ? "Hide" : "Read"}
                          </button>
                        </div>

                        {expandedIds[l.id] && (
                          <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{JSON.stringify(l.details, null, 2)}</pre>
                        )}

                        {!expandedIds[l.id] && (
                          <p className="mt-2 text-sm text-gray-700 line-clamp-2" title={JSON.stringify(l.details || "")}>
                            {typeof l.details === "string" ? l.details : JSON.stringify(l.details ?? {}, null, 0)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openDetails(l.details)}>
                              <Info className="mr-2 h-4 w-4" /> Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigator.clipboard?.writeText(JSON.stringify(l, null, 2))}>
                              Copy JSON
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DESKTOP: table */}
          <div className="hidden sm:block overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">Error: {error}</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No logs found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Leads (before → after)</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((l) => (
                    <TableRow key={l.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>{l.id}</TableCell>
                      <TableCell>
                        <Badge className="bg-gray-100 text-gray-800">{l.activity_type}</Badge>
                      </TableCell>
                      <TableCell>{l.artist_name}</TableCell>
                      <TableCell>{l.artist_phone}</TableCell>
                      <TableCell>{l.leads_before ?? "-"} → {l.leads_after ?? "-"}</TableCell>
                      <TableCell>{formatDate(l.timestamp)}</TableCell>
                      <TableCell>
                        <div className="relative group flex items-center gap-1">
                          <span className="truncate max-w-[28ch]">{typeof l.details === "string" ? l.details : JSON.stringify(l.details ?? {}, null, 0)}</span>
                          <Info className="h-4 w-4 text-gray-400" />
                          <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1 z-10 w-max max-w-xs">
                            {typeof l.details === "string" ? l.details : JSON.stringify(l.details ?? {}, null, 2)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openDetails(l.details)}>
                              <Info className="mr-2 h-4 w-4" /> Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigator.clipboard?.writeText(JSON.stringify(l, null, 2))}>
                              Copy JSON
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing {filtered.length} of {totalCount} logs</div>
            <div className="flex items-center gap-2">
              <Button disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Prev</Button>
              <div className="px-3 py-1 rounded border">{currentPage} / {totalPages}</div>
              <Button disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-auto">
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(activeDetail ?? {}, null, 2)}</pre>
          </div>

          <DialogFooter className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
