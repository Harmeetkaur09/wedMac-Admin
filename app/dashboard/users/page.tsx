"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, Plus, MoreHorizontal } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Contact = {
  id: number;
  name: string;
  mobile: string;
  message: string;
  created_at: string;
};

export default function UserManagementPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    let mounted = true;
    async function fetchContacts() {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem("accessToken"); // get token from session storage
        const res = await fetch(
          "https://wedmac-be.onrender.com/api/public/get-contact-submissions/",
          {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }), // add token if present
            },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        // Expecting { status: "success", data: [...] }
        if (mounted) setContacts(Array.isArray(json.data) ? json.data : []);
      } catch (err: any) {
        console.error("Failed to fetch contacts:", err);
        if (mounted) setError(err.message || "Failed to fetch");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchContacts();
    return () => {
      mounted = false;
    };
  }, []);

  // helper: normalize number for whatsapp / tel
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
    if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
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

  function makeCall(mobile?: string) {
    const tel = formatTelHref(mobile);
    if (!tel) {
      alert("No valid mobile number available to call.");
      return;
    }
    // using location.href so mobile devices will invoke dialer
    window.location.href = tel;
  }

  // Quick stats derived from contacts
  const stats = useMemo(() => {
    const now = new Date();
    const total = contacts.length;
    const thisMonth = contacts.filter((c) => {
      const d = new Date(c.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const thisWeek = contacts.filter((c) => {
      const d = new Date(c.created_at);
      const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    }).length;
    const latest = contacts
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    return { total, thisMonth, thisWeek, latest };
  }, [contacts]);

  const filtered = useMemo(() => {
    if (!query) return contacts;
    const q = query.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.mobile.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q)
    );
  }, [contacts, query]);

  function formatDate(iso?: string) {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          {/* <p className="text-gray-600 mt-1">Live submissions from public contact form</p> */}
        </div>
        {/* <Button
          className="bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] hover:from-[#FF5A8C] hover:to-[#FF4979] shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => {
            // re-fetch manually
            setLoading(true);
            setError(null);
            fetch("https://wedmac-be.onrender.com/api/public/get-contact-submissions/")
              .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
              })
              .then((json) => setContacts(Array.isArray(json.data) ? json.data : []))
              .catch((e) => setError(String(e)))
              .finally(() => setLoading(false));
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Refresh
        </Button> */}
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>User Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Submissions</p>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-gray-500">All time</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">This Month</p>
              <p className="text-2xl font-bold">{stats.thisMonth}</p>
              <p className="text-xs text-gray-500">Entries in current month</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">This Week</p>
              <p className="text-2xl font-bold">{stats.thisWeek}</p>
              <p className="text-xs text-gray-500">Last 7 days</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Latest Submission</p>
              <p className="text-2xl font-bold">{stats.latest ? stats.latest.name : "-"}</p>
              <p className="text-xs text-gray-500">{stats.latest ? formatDate(stats.latest.created_at) : "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
            <CardTitle>User List</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search name / mobile / message..."
                  className="pl-8 w-64"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">Error: {error}</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No submissions found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => (
                    <TableRow key={c.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                            <AvatarFallback className="bg-gradient-to-br from-[#FF6B9D] to-[#FF5A8C] text-white">
                              {c.name?.charAt(0) ?? "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{c.name}</p>
                            <p className="text-xs text-gray-500">ID: {c.id}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="text-sm">{c.mobile}</p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="text-sm truncate max-w-[28ch]" title={c.message}>
                          {c.message}
                        </p>
                      </TableCell>

                      <TableCell className="text-sm">{formatDate(c.created_at)}</TableCell>

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
                              onClick={() => {
                                navigator.clipboard?.writeText(c.mobile || "");
                                // small UI hint would be better in real app
                                alert("Mobile copied to clipboard");
                              }}
                            >
                              Copy Mobile
                            </DropdownMenuItem>

                            {/* NEW: Call action */}
                            <DropdownMenuItem
                              onClick={() => {
                                makeCall(c.mobile);
                              }}
                            >
                              Call
                            </DropdownMenuItem>

                            {/* NEW: WhatsApp action */}
                            <DropdownMenuItem
                              onClick={() => {
                                openWhatsApp(c.mobile, `Hi ${c.name || ""},\n\n${c.message || ""}`);
                              }}
                            >
                              Send WhatsApp
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            {/* <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            {/* simple pagination placeholders */}
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-[#FF6B9D] text-white hover:bg-[#FF5A8C]">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
