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
  my_claimed_leads: string | number | null;
  tag?: string;
  id: number;
  user_phone?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string | null;
  gender?: string | null;
  date_of_birth?: string | null;
  location?: string | { id: number; city: string; state: string; pincode: string; lat: string; lng: string } | null;
  payment_status?: string | null;
  status?: string | null;
  is_active?: boolean | null;
  internal_notes?: string | null;
  profile_picture?: {
    file_url?: string | null;
  } | null;
  certifications?: any[];
  created_at?: string;
  my_referral_code?: string | null;
  available_leads?: number;
  current_plan?: any;
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

  const [plans, setPlans] = useState<any[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ first_name?: string; last_name?: string; phone?: string }>({});
  const isAlpha = (s: string) => /^[A-Za-z\s]+$/.test(s.trim());
  const sanitizeAlpha = (s: string) => s.replace(/[^A-Za-z\s]/g, "");
  const sanitizePhone = (s: string) => s.replace(/\D/g, "").slice(0, 10);
  const isPhoneValid = (s: string) => /^\d{10}$/.test(s);
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
    subscription_plan_id: "",
  });

  // Plan modal state
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planModalArtistId, setPlanModalArtistId] = useState<number | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [planActionLoading, setPlanActionLoading] = useState<Record<number, boolean>>({});
const [createError, setCreateError] = useState<string | null>(null);

  const openPlanModal = (artistId: number, currentPlanId?: string | null) => {
    setPlanModalArtistId(artistId);
    setSelectedPlanId(currentPlanId ?? "");
    setPlanModalOpen(true);
  };

  const setArtistPlan = async (artistId: number) => {
    if (!artistId) return;
    setPlanActionLoading((p) => ({ ...p, [artistId]: true }));
    try {
      const tokenFromStorage = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null;
      const token = tokenFromStorage ? `Bearer ${tokenFromStorage}` : undefined;
      const endpoint = `${API_HOST}/api/artists/admin/${artistId}/set-current-plan/`;
      const bodyPayload = { plan_id: selectedPlanId || null };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: token } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = (json && (json.detail || json.message)) || `Request failed: ${res.status}`;
        toast.error(msg);
        return;
      }
      if (json && (json.current_plan || json.available_leads || json.id)) {
        setArtists((prev) =>
          prev.map((a) => {
            if (a.id !== artistId) return a;
            return {
              ...a,
              available_leads: typeof json.available_leads !== "undefined" ? Number(json.available_leads) : a.available_leads,
              ...(json.current_plan ? { current_plan: json.current_plan } : {}),
            };
          })
        );
      } else {
        fetchArtists();
      }
      toast.success("Plan updated for artist");
      setPlanModalOpen(false);
      setPlanModalArtistId(null);
      setSelectedPlanId("");
    } catch (err) {
      console.error("Set plan failed:", err);
      toast.error("Failed to set plan");
    } finally {
      setPlanActionLoading((p) => ({ ...p, [artistId]: false }));
    }
  };

const updateExtendedDays = async (artistId: number) => {
  // Use empty default so OK without typing = treated as skip
  const rawDays = window.prompt(
    "Enter number of days to change. Leave blank to skip:",
    ""
  );
  if (rawDays === null) return; // user cancelled

  const rawLeads = window.prompt(
    "Enter number of leads to ADD (positive integer). Leave blank to skip:",
    ""
  );
  if (rawLeads === null) return; // user cancelled

  const daysTrim = rawDays.trim();
  const leadsTrim = rawLeads.trim();

  // treat blank as skip (null)
  const daysVal = daysTrim === "" ? null : parseInt(daysTrim, 10);
  const leadsVal = leadsTrim === "" ? null : parseInt(leadsTrim, 10);

  // validations
  if (daysVal !== null && !Number.isFinite(daysVal)) {
    toast.error("Invalid days value — enter a number (can be negative).");
    return;
  }
  if (leadsVal !== null && (!Number.isFinite(leadsVal) || leadsVal <= 0)) {
    toast.error("Delta available leads must be a positive integer (or leave blank to skip).");
    return;
  }

  if (daysVal === null && leadsVal === null) {
    // nothing to update
    toast("No changes provided — nothing to update.", { icon: "ℹ️" });
    return;
  }

  // Optional: ask for confirmation if daysVal === 0 (user explicitly entered 0)
  if (daysVal === 0 && leadsVal === null) {
    // user specifically set 0 days — likely mistake
    const confirmZero = window.confirm("You entered 0 days (no change). Do you want to continue?");
    if (!confirmZero) return;
  }
  if (leadsVal === 0) { // this should already be blocked by validation, but double-check
    toast.error("0 is not allowed for leads. Use a positive number or leave blank.");
    return;
  }

  setActionLoading((p) => ({ ...p, [artistId]: true }));
  try {
    const tokenFromStorage =
      typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null;
    const token = tokenFromStorage ? `Bearer ${tokenFromStorage}` : undefined;
    const endpoint = `${API_HOST}/api/artists/admin/update-extended-days/`;

    const payload: any = { artist_id: artistId };
    if (daysVal !== null) payload.delta_extended_days = daysVal;
    if (leadsVal !== null) payload.delta_available_leads = leadsVal;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: token } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const msg = (json && (json.detail || json.message)) || `Request failed: ${res.status}`;
      toast.error(msg);
      return;
    }

    // Update local state from server response when possible
    setArtists((prev) =>
      prev.map((a) => {
        if (a.id !== artistId) return a;
        const updated: any = { ...a };

        if (json && typeof json.available_leads !== "undefined") {
          updated.available_leads = Number(json.available_leads);
        } else if (leadsVal !== null) {
          const cur = typeof a.available_leads === "number" ? a.available_leads : 0;
          updated.available_leads = Math.max(0, cur + leadsVal);
        }

        if (json && typeof json.extended_days !== "undefined") {
          updated.extended_days = Number(json.extended_days);
        } else if (daysVal !== null) {
          const curExt = typeof (a as any).extended_days === "number" ? (a as any).extended_days : 0;
          updated.extended_days = curExt + daysVal;
        }

        return updated;
      })
    );

    // Build a friendly success message using server response if available, else using delta values
    const msgs: string[] = [];
    if (typeof json?.extended_days !== "undefined") {
      msgs.push(`Extended days: ${json.extended_days}`);
    } else if (daysVal !== null) {
      msgs.push(`Delta days: ${daysVal >= 0 ? `+${daysVal}` : daysVal}`);
    }
    if (typeof json?.available_leads !== "undefined") {
      msgs.push(`Available leads: ${json.available_leads}`);
    } else if (leadsVal !== null) {
      msgs.push(`Delta leads: +${leadsVal}`);
    }

    toast.success(`Update successful — ${msgs.join(" · ")}`);
  } catch (err) {
    console.error("updateExtendedDays failed:", err);
    toast.error("Failed to update extended days");
  } finally {
    setActionLoading((p) => ({ ...p, [artistId]: false }));
  }
};



const loginAsArtist = async (artistPhone?: string, artistId?: number) => {
  if (!artistPhone) { toast.error("Artist phone not available"); return; }

  const artistOrigin = "https://artist.wedmacindia.com";
  const receivePath = "/receive-token";
  const receiveUrl = `${artistOrigin}${receivePath}`;

  let newWin: Window | null = null;
  let fallbackTimer: number | null = null;

  // tokens will be filled after API call
  let access: string | undefined;
  let refresh: string | undefined;
  let userId: number | null = null;

  // buffer the receive-ready event if it arrives before tokens
  let bufferedEvent: MessageEvent | null = null;

  const sendPayloadToSource = (source: Window | null, origin: string) => {
    if (!source) return;
    const payload = { access, refresh, user_id: userId };
    try {
      (source as any).postMessage(payload, origin);
      console.log("Sent tokens to artist window via postMessage");
    } catch (err) {
      console.warn("postMessage to artist failed:", err);
    }
  };

  const onMessage = (e: MessageEvent) => {
    try {
      if (e.origin !== artistOrigin) return;
      if (!e.data || e.data.type !== "receive-ready") return;

      // if tokens are not ready yet, buffer the event and wait
      if (!access) {
        bufferedEvent = e;
        return;
      }

      // tokens are ready -> send immediately
      if (e.source && typeof (e.source as any).postMessage === "function") {
        (e.source as Window).postMessage({ access, refresh, user_id: userId }, e.origin);
      } else if (newWin && !newWin.closed) {
        newWin.postMessage({ access, refresh, user_id: userId }, artistOrigin);
      }
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      window.removeEventListener("message", onMessage);
    } catch (err) {
      console.error("onMessage error:", err);
    }
  };

  window.addEventListener("message", onMessage, false);

  // open a blank window immediately to avoid popup blocking
  newWin = typeof window !== "undefined" ? window.open("", "_blank") : null;
  if (typeof window !== "undefined" && !newWin) {
    toast.error("Popup blocked. Please allow popups for this site.");
    window.removeEventListener("message", onMessage);
    return;
  }

  setActionLoading((p) => ({ ...p, [artistId ?? -1]: true }));
  try {
    // fetch tokens from server
    const endpoint = `${API_HOST}/api/users/admin/login-as-artist/`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(sessionStorage.getItem("accessToken") ? { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` } : {}),
      },
      body: JSON.stringify({ phone: String(artistPhone) }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = (json && (json.detail || json.message)) || `Request failed: ${res.status}`;
      toast.error(msg);
      if (newWin && !newWin.closed) newWin.close();
      window.removeEventListener("message", onMessage);
      return;
    }

    // set tokens in outer scope
    access = json?.access;
    refresh = json?.refresh;
    userId = json?.user_id ?? null;

    if (!access) {
      toast.error("Login-as-artist did not return access token");
      if (newWin && !newWin.closed) newWin.close();
      window.removeEventListener("message", onMessage);
      return;
    }

    // navigate child to receive page
    try { if (newWin && !newWin.closed) newWin.location.href = receiveUrl; }
    catch (e) { console.warn("Navigation to receive-token failed:", e); }

    // if we buffered a receive-ready earlier, reply now
    if (bufferedEvent) {
      try {
        if (bufferedEvent.source && typeof (bufferedEvent.source as any).postMessage === "function") {
          (bufferedEvent.source as Window).postMessage({ access, refresh, user_id: userId }, bufferedEvent.origin);
        } else if (newWin && !newWin.closed) {
          newWin.postMessage({ access, refresh, user_id: userId }, artistOrigin);
        }
      } catch (err) {
        console.warn("Failed to send buffered payload:", err);
      } finally {
        bufferedEvent = null;
        if (fallbackTimer) window.clearTimeout(fallbackTimer);
        window.removeEventListener("message", onMessage);
        return;
      }
    }

    // fallback after a shorter timeout (e.g. 5s)
    fallbackTimer = window.setTimeout(() => {
      try {
        const payload = { access, refresh, user_id: userId };
        if (newWin && !newWin.closed) {
          try { newWin.postMessage(payload, artistOrigin); console.log("Fallback: posted tokens to artist window"); }
          catch (err) {
            // fragment fallback if postMessage fails
            newWin.location.href = `${receiveUrl}#access=${encodeURIComponent(String(access))}${refresh ? `&refresh=${encodeURIComponent(String(refresh))}` : ""}${userId ? `&user_id=${encodeURIComponent(String(userId))}` : ""}`;
          }
        } else {
          // if the window was closed, open a new one with fragment
          window.open(`${receiveUrl}#access=${encodeURIComponent(String(access))}${refresh ? `&refresh=${encodeURIComponent(String(refresh))}` : ""}${userId ? `&user_id=${encodeURIComponent(String(userId))}` : ""}`, "_blank");
        }
      } finally {
        window.removeEventListener("message", onMessage);
      }
    }, 5000); // 5 seconds fallback
  } catch (err) {
    console.error("Login-as-artist failed:", err);
    toast.error("Failed to login as artist");
    if (newWin && !newWin.closed) newWin.close();
    window.removeEventListener("message", onMessage);
  } finally {
    setActionLoading((p) => ({ ...p, [artistId ?? -1]: false }));
  }
};
// --- Add this function near your other action functions (e.g. after toggleArtistStatus) ---
const deleteArtist = async (artistId: number) => {
  if (!window.confirm("Are you sure you want to DELETE this artist? This action cannot be undone.")) return;
  setActionLoading((p) => ({ ...p, [artistId]: true }));
  try {
    const tokenFromStorage = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null;
    const token = tokenFromStorage ? `Bearer ${tokenFromStorage}` : undefined;
    const endpoint = `${API_HOST}/api/artists/admin/${artistId}/delete-artist/`;
    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: token } : {}),
        "Content-Type": "application/json",
      },
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const msg = (json && (json.detail || json.message)) || `Request failed: ${res.status}`;
      toast.error(msg);
      return;
    }

    // remove from local state if present
    setArtists((prev) => prev.filter((a) => a.id !== artistId));
    toast.success("Artist deleted successfully");
  } catch (err) {
    console.error("Delete artist failed:", err);
    toast.error("Failed to delete artist");
  } finally {
    setActionLoading((p) => ({ ...p, [artistId]: false }));
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

    // find current tags from local state (support old `tag` string too)
    const artist = artists.find((a) => a.id === artistId) as any | undefined;
    const currentTags = Array.isArray(artist?.tags)
      ? [...artist.tags]
      : artist?.tag
      ? [String(artist.tag)]
      : [];

    let tagsToSend: string[] = [];

    if (tag && tag.trim()) {
      // ADD mode: add this tag to existing tags (no duplicates)
      const t = tag.trim();
      if (!currentTags.includes(t)) {
        tagsToSend = [...currentTags, t];
      } else {
        // already present — nothing to change
        tagsToSend = currentTags;
      }
    } else {
      // REMOVE mode: ask which tag to remove (or "all" to clear)
      if (!currentTags || currentTags.length === 0) {
        window.alert("No tags present for this artist.");
        return;
      }
      const choice = window.prompt(
        `Current tags: ${currentTags.join(", ")}.\nEnter tag to remove (comma-separated allowed), or type "all" to remove all tags:`,
        ""
      );
      if (choice === null) return; // user cancelled
      const val = choice.trim();
      if (val.toLowerCase() === "all") {
        tagsToSend = [];
      } else {
        const removeList = val
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        tagsToSend = currentTags.filter((t) => !removeList.includes(t));
      }
    }

    // send to API in new shape { tags: [...] }
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: token } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tags: tagsToSend }),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const msg = (json && (json.detail || json.message)) || `Request failed: ${res.status}`;
      toast.error(msg);
      return;
    }

    // update local state (prefer payload from server if returned)
    // try to get tags from response if provided, otherwise use tagsToSend
    const newTagsFromServer = Array.isArray(json?.tags) ? json.tags : tagsToSend;

    setArtists((prev) =>
      prev.map((a) => (a.id === artistId ? { ...a, tags: newTagsFromServer } : a))
    );

    if (tag && tag.trim()) {
      toast.success(`Tag "${tag.trim()}" applied`);
    } else {
      toast.success("Tag(s) updated");
    }

    // optionally refresh list from server to be fully in-sync
    fetchArtists();
  } catch (err) {
    console.error("Tag update failed:", err);
    toast.error("Failed to update tag");
  } finally {
    setActionLoading((p) => ({ ...p, [artistId]: false }));
  }
};

const updateArtistPhone = async (artistId: number, currentPhone?: string) => {
  const newPhone = window.prompt("Enter new phone number:", currentPhone ?? "");
  if (!newPhone) return;

  const sanitizedPhone = newPhone.replace(/\D/g, "").slice(0, 10);
  if (!/^\d{10}$/.test(sanitizedPhone)) {
    toast.error("Phone number must be exactly 10 digits");
    return;
  }

  setActionLoading((p) => ({ ...p, [artistId]: true }));

  try {
    const tokenFromStorage = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null;
    const token = tokenFromStorage ? `Bearer ${tokenFromStorage}` : undefined;
    const endpoint = `${API_HOST}/api/artists/admin/${artistId}/update-mobile/`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: token } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: sanitizedPhone }),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const msg = (json && (json.detail || json.message)) || `Request failed: ${res.status}`;
      toast.error(msg);
      return;
    }

    setArtists((prev) =>
      prev.map((a) => (a.id === artistId ? { ...a, phone: sanitizedPhone} : a))
    );
    toast.success("Phone number updated successfully");
  } catch (err) {
    console.error("Phone update failed:", err);
    toast.error("Failed to update phone number");
  } finally {
    setActionLoading((p) => ({ ...p, [artistId]: false }));
  }
};


  const fetchArtists = async () => {
    setLoading(true);
    setError(null);
    try {
      const tokenFromStorage = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null;
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
      if (Array.isArray(data)) list = data;
      else if (data && typeof data === "object" && "results" in data && Array.isArray(data.results)) list = data.results;
      setArtists(list);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch artists");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    setPlansLoading(true);
    try {
      const tokenFromStorage = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null;
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
      const list = Array.isArray(data) ? data : data && Array.isArray(data.results) ? data.results : [];
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
      if (statusFilter !== "all" && (a.status || "").toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (!q) return true;
      const name = `${a.first_name ?? ""} ${a.last_name ?? ""}`.toLowerCase();
      const loc = typeof a.location === "string" ? (a.location ?? "") : a.location ? `${(a.location as any).city ?? ""} ${(a.location as any).state ?? ""}` : "";
      return (
        name.includes(q) ||
        String(a.phone ?? a.user_phone ?? "").toLowerCase().includes(q) ||
        String(a.email ?? "").toLowerCase().includes(q) ||
        loc.toLowerCase().includes(q)
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
    if (s === "approved") return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
    if (s === "pending") return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
    if (s === "rejected") return <Badge className="bg-red-100 text-red-800">{status}</Badge>;
    return <Badge className="bg-gray-100 text-gray-800">{status || "unknown"}</Badge>;
  };

  const toggleArtistStatus = async (artistId: number, activate: boolean) => {
    const confirmMsg = activate ? "Are you sure you want to ACTIVATE this artist?" : "Are you sure you want to DEACTIVATE this artist?";
    if (!window.confirm(confirmMsg)) return;
    setActionLoading((p) => ({ ...p, [artistId]: true }));
    try {
      const tokenFromStorage = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null;
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
      const newIsActive = resJson && typeof resJson.is_active === "boolean" ? resJson.is_active : activate;
      const newStatus = resJson && typeof resJson.status === "string" ? resJson.status : activate ? "active" : "inactive";
      setArtists((prev) => prev.map((a) => (a.id !== artistId ? a : { ...a, status: newStatus, is_active: newIsActive })));
      toast.success(activate ? "Artist activated" : "Artist deactivated");
    } catch (err: any) {
      console.error(err);
      toast.error("Action failed");
    } finally {
      setActionLoading((p) => ({ ...p, [artistId]: false }));
    }
  };

const createArtist = async () => {
  // client-side validations (unchanged)
  const fn = (newArtist.first_name || "").trim();
  const ln = (newArtist.last_name || "").trim();
  const phone = (newArtist.phone || "").trim();
  const errors: typeof formErrors = {};
  if (!fn) errors.first_name = "First name is required";
  else if (!isAlpha(fn)) errors.first_name = "Name must contain only letters and spaces";
  if (ln && !isAlpha(ln)) errors.last_name = "Last name must contain only letters and spaces";
  if (!phone) errors.phone = "Phone is required";
  else if (!isPhoneValid(phone)) errors.phone = "Phone must be exactly 10 digits";
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    setCreateError(null);
    const firstError = errors.first_name || errors.last_name || errors.phone;
    toast.error(firstError || "Unknown error");
    return;
  }

  setCreateLoading(true);
  setCreateError(null);
  setFormErrors({});

  try {
    const tokenFromStorage = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null;
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
      subscription_plan_id: newArtist.subscription_plan_id && newArtist.subscription_plan_id !== "" ? String(newArtist.subscription_plan_id) : null,
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

      // parse server errors into friendly strings
      const newFieldErrors: typeof formErrors = {};
      let generalMessage: string | null = null;

      if (json) {
        // common keys
        if (typeof json === "string") {
          generalMessage = json;
        } else {
          if (json.error) {
            // {"error":"Enter..."}
            generalMessage = typeof json.error === "string" ? json.error : JSON.stringify(json.error);
          }
          if (json.detail) {
            generalMessage = typeof json.detail === "string" ? json.detail : JSON.stringify(json.detail);
          }

          // field-level errors like { phone: ["..."] } or { phone: "..." }
          for (const key of Object.keys(json)) {
            const val = (json as any)[key];
            if (!val) continue;
            const k = key.toLowerCase();
            const joinArray = (v: any) => (Array.isArray(v) ? v.join(" ") : String(v));

            if (k.includes("phone")) {
              newFieldErrors.phone = joinArray(val);
            } else if (k.includes("first") && k.includes("name")) {
              newFieldErrors.first_name = joinArray(val);
            } else if (k.includes("last") && k.includes("name")) {
              newFieldErrors.last_name = joinArray(val);
            } else if (!generalMessage && (Array.isArray(val) || typeof val === "string")) {
              // fallback to set a general message if nothing else
              generalMessage = joinArray(val);
            }
          }
        }
      }

      setFormErrors((prev) => ({ ...prev, ...newFieldErrors }));
      setCreateError(generalMessage || `Create failed: ${res.status}`);
      toast.error(generalMessage || `Create failed: ${res.status}`);
      return;
    }

    // Success path: clear and add created item (your existing logic)
    window.location.reload();
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
        location: json.city || json.location || `${payload.city || ""}`,
        payment_status: null,
        status: json.status || "pending",
        internal_notes: null,
        my_claimed_leads: json.my_claimed_leads || null,
        profile_picture: json.profile_picture ? { file_url: json.profile_picture } : null,
        certifications: json.certifications || [],
        created_at: json.created_at || new Date().toISOString(),
        my_referral_code: json.my_referral_code || null,
        available_leads: typeof json.available_leads !== "undefined" ? Number(json.available_leads) : 0,
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
    setFormErrors({});
    setCreateError(null);
  } catch (err) {
    console.error(err);
    setCreateError("Failed to create artist");
    toast.error("Failed to create artist");
  } finally {
    setCreateLoading(false);
  }
};


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
      const tokenFromStorage = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null;
      const token = tokenFromStorage ? `Bearer ${tokenFromStorage}` : undefined;
      const endpoint = `${API_HOST}/api/admin/artist/${artistId}/leads/`;
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          ...(token ? { Authorization: token } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, amount }),
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
      const updatedCount = maybeNum(json, ["available_leads", "my_claimed_leads", "available_leads_count", "leads_available"]) ?? null;
      if (updatedCount !== null) {
        setArtists((prev) => prev.map((a) => (a.id === artistId ? { ...a, available_leads: updatedCount } : a)));
      } else {
        setArtists((prev) =>
          prev.map((a) => {
            if (a.id !== artistId) return a;
            const cur = typeof a.available_leads === "number" ? a.available_leads : typeof a.my_claimed_leads === "number" ? Number(a.my_claimed_leads) : 0;
            const newVal = Math.max(0, cur + (action === "add" ? amount : -amount));
            return { ...a, available_leads: newVal, my_claimed_leads: a.my_claimed_leads !== undefined ? String(newVal) : a.my_claimed_leads };
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

  // helper to render location safely
  const renderLocation = (loc: Artist["location"]) => {
    if (!loc) return "-";
    if (typeof loc === "string") return loc;
    try {
      const o: any = loc;
      return `${o.city ?? ""}${o.state ? `, ${o.state}` : ""}${o.pincode ? ` (${o.pincode})` : ""}`.trim() || "-";
    } catch {
      return "-";
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
          <Button className="bg-[#FF6B9D] hover:bg-pink-500 text-white" onClick={() => setAddOpen(true)}>
            Add Artist
          </Button>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
            <CardTitle>Artist List</CardTitle>
            <div className="flex w-full sm:w-auto gap-2 items-center">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search artists..."
                  className="pl-8 w-full sm:w-64"
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
              {/* MOBILE: card list */}
              <div className="sm:hidden space-y-3">
                {paginated.map((artist) => {
                  const isActive = typeof artist.is_active === "boolean" ? artist.is_active : (artist.status || "").toLowerCase() === "active";
                  return (
                    <div key={artist.id} className="bg-white border rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="font-medium truncate">{`${artist.first_name ?? ""} ${artist.last_name ?? ""}`}</p>
                              <p className="text-xs text-gray-500 truncate">{artist.email ?? artist.phone ?? "-"}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm">{artist.available_leads ?? 0} leads</div>
                              <div className="text-xs mt-1">
                                {renderBadge(artist.status) /* badge component returns element */}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 text-sm text-muted-foreground">
                            <div className="truncate">{renderLocation(artist.location)}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              Joined: {new Date(artist.created_at ?? new Date().toISOString()).toISOString().split("T")[0]}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{isActive ? "Active" : "Inactive"}</span>
<span className="text-xs text-gray-500">
  {Array.isArray((artist as any).tags) && (artist as any).tags.length > 0 ? (
    (artist as any).tags.map((t: string) => (
      <Badge key={t} className="text-xs bg-indigo-50 text-indigo-800">
        {t}
      </Badge>
    ))
  ) : artist.tag ? (
    <Badge className="text-xs bg-indigo-50 text-indigo-800">{artist.tag}</Badge>
  ) : (
    <span className="text-xs text-gray-500">-</span>
  )}
</span>
                        </div>

                        <div>
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
                                onClick={(e: any) => {
                                  try { e.preventDefault(); e.stopPropagation(); } catch {}
                                  openPlanModal(artist.id, (artist as any).current_plan?.id ?? "");
                                }}
                                disabled={!!actionLoading[artist.id] || !!planActionLoading[artist.id]}
                              >
                                Assign / Set Plan
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={(e: any) => {
                                  try { e.preventDefault(); e.stopPropagation(); } catch {}
                                  updateExtendedDays(artist.id);
                                }}
                                disabled={!!actionLoading[artist.id]}
                              >
                                Extend Days
                              </DropdownMenuItem>
                              <DropdownMenuItem
  onClick={() => updateArtistPhone(artist.id, artist.phone ?? artist.user_phone)}
  disabled={!!actionLoading[artist.id]}
>
  {actionLoading[artist.id] ? "Processing..." : "Edit Phone"}
</DropdownMenuItem>


                              <DropdownMenuItem
                                onClick={() => loginAsArtist(artist.user_phone ?? artist.phone ?? `${artist.phone}`, artist.id)}
                                disabled={!!actionLoading[artist.id]}
                              >
                                {actionLoading[artist.id] ? "Processing..." : "Login as Artist"}
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => postArtistTag(artist.id, "popular")} disabled={!!actionLoading[artist.id]}>
                                {actionLoading[artist.id] ? "Processing..." : "Tag: Popular"}
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => postArtistTag(artist.id, "top")} disabled={!!actionLoading[artist.id]}>
                                {actionLoading[artist.id] ? "Processing..." : "Tag: Top"}
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => postArtistTag(artist.id, "")} disabled={!!actionLoading[artist.id]} className="text-red-600">
                                {actionLoading[artist.id] ? "Processing..." : "Remove Tag"}
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => adjustArtistLeads(artist.id, "add")} disabled={!!actionLoading[artist.id]}>
                                {actionLoading[artist.id] ? "Processing..." : "+1 Leads"}
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => adjustArtistLeads(artist.id, "remove")} disabled={!!actionLoading[artist.id]} className="text-red-600">
                                {actionLoading[artist.id] ? "Processing..." : "-1 Leads"}
                              </DropdownMenuItem>

                              {((artist.status || "").toLowerCase() === "approved" || (artist.status || "").toLowerCase() === "active") && (
                                (() => {
                                  const statusLower = (artist.status || "").toLowerCase();
                                  const isEligible = statusLower === "approved" || statusLower === "active";
                                  if (!isEligible) return null;
                                  const isAct = typeof artist.is_active === "boolean" ? artist.is_active : statusLower === "active";
                                  return isAct ? (
                                    <DropdownMenuItem onClick={() => toggleArtistStatus(artist.id, false)} disabled={!!actionLoading[artist.id]} className="text-red-600">
                                      {actionLoading[artist.id] ? "Processing..." : "Deactivate"}
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => toggleArtistStatus(artist.id, true)} disabled={!!actionLoading[artist.id]}>
                                      {actionLoading[artist.id] ? "Processing..." : "Activate"}
                                    </DropdownMenuItem>
                                  );
                                })()
                              )}
                              <DropdownMenuItem
  onClick={() => deleteArtist(artist.id)}
  disabled={!!actionLoading[artist.id]}
  className="text-red-600"
>
  {actionLoading[artist.id] ? "Processing..." : "Delete Artist"}
</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP: table */}
              <div className="hidden sm:block overflow-x-auto">
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

                        <TableCell className="break-words max-w-sm">
                          {renderLocation(artist.location)}
                        </TableCell>

                        <TableCell>
                          {new Date(artist.created_at ?? "-").toISOString().split("T")[0]}
                        </TableCell>

                        <TableCell>{artist.phone ?? "-"}</TableCell>
<TableCell>
  {Array.isArray((artist as any).tag) && (artist as any).tag.length > 0 ? (
    (artist as any).tag.join(', ')
  ) : (
    <span className="text-xs text-gray-500">-</span>
  )}
</TableCell>


                        <TableCell>{artist.my_claimed_leads ?? "-"}</TableCell>
                        <TableCell className="flex justify-center gap-2">
                          {renderBadge(artist.status)}
                          <span className="ml-2">
                            <Badge className={typeof artist.is_active === "boolean" ? (artist.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800") : "bg-gray-100 text-gray-800"}>
                              {typeof artist.is_active === "boolean" ? (artist.is_active ? "Active" : "Inactive") : ((artist.status || "").toLowerCase() === "active" ? "Active" : "Inactive")}
                            </Badge>
                          </span>
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
                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={(e: any) => {
                                  try { e.preventDefault(); e.stopPropagation(); } catch {}
                                  openPlanModal(artist.id, (artist as any).current_plan?.id ?? "");
                                }}
                                disabled={!!actionLoading[artist.id] || !!planActionLoading[artist.id]}
                              >
                                Assign / Set Plan
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={(e: any) => { try { e.preventDefault(); e.stopPropagation(); } catch {} ; updateExtendedDays(artist.id); }} disabled={!!actionLoading[artist.id]}>
                                Extend Days
                              </DropdownMenuItem>
<DropdownMenuItem
  onClick={() => updateArtistPhone(artist.id, artist.phone ?? artist.phone)}
  disabled={!!actionLoading[artist.id]}
>
  {actionLoading[artist.id] ? "Processing..." : "Edit Phone"}
</DropdownMenuItem>

                              <DropdownMenuItem onClick={() => loginAsArtist(artist.user_phone ?? artist.phone ?? `${artist.phone}`, artist.id)} disabled={!!actionLoading[artist.id]}>
                                {actionLoading[artist.id] ? "Processing..." : "Login as Artist"}
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => postArtistTag(artist.id, "popular")} disabled={!!actionLoading[artist.id]}>
                                {actionLoading[artist.id] ? "Processing..." : "Tag: Popular"}
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => postArtistTag(artist.id, "top")} disabled={!!actionLoading[artist.id]}>
                                {actionLoading[artist.id] ? "Processing..." : "Tag: Top"}
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => postArtistTag(artist.id, "")} disabled={!!actionLoading[artist.id]} className="text-red-600">
                                {actionLoading[artist.id] ? "Processing..." : "Remove Tag"}
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => adjustArtistLeads(artist.id, "add")} disabled={!!actionLoading[artist.id]}>
                                {actionLoading[artist.id] ? "Processing..." : "+1 Leads"}
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => adjustArtistLeads(artist.id, "remove")} disabled={!!actionLoading[artist.id]} className="text-red-600">
                                {actionLoading[artist.id] ? "Processing..." : "-1 Leads"}
                              </DropdownMenuItem>

                              {((artist.status || "").toLowerCase() === "approved" || (artist.status || "").toLowerCase() === "active") && (
                                (() => {
                                  const statusLower = (artist.status || "").toLowerCase();
                                  const isEligible = statusLower === "approved" || statusLower === "active";
                                  if (!isEligible) return null;
                                  const isAct = typeof artist.is_active === "boolean" ? artist.is_active : statusLower === "active";
                                  return isAct ? (
                                    <DropdownMenuItem onClick={() => toggleArtistStatus(artist.id, false)} disabled={!!actionLoading[artist.id]} className="text-red-600">
                                      {actionLoading[artist.id] ? "Processing..." : "Deactivate"}
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => toggleArtistStatus(artist.id, true)} disabled={!!actionLoading[artist.id]}>
                                      {actionLoading[artist.id] ? "Processing..." : "Activate"}
                                    </DropdownMenuItem>
                                  );
                                })()
                              )}
                              <DropdownMenuItem
  onClick={() => deleteArtist(artist.id)}
  disabled={!!actionLoading[artist.id]}
  className="text-red-600"
>
  {actionLoading[artist.id] ? "Processing..." : "Delete Artist"}
</DropdownMenuItem>
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

      {/* Add Artist modal (responsive) */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAddOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Create Artist (Admin)</h3>
            <p className="text-sm text-gray-600 mb-4">Creates an artist without OTP</p>
{createError && <div className="mb-3 p-2 rounded bg-red-50 text-red-700 text-sm">{createError}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="First name" value={newArtist.first_name} onChange={(e) => { const val = sanitizeAlpha(e.target.value); setNewArtist((p: any) => ({ ...p, first_name: val })); setFormErrors((fe) => ({ ...fe, first_name: undefined })); }} />
              {formErrors.first_name && <p className="text-xs text-red-600 mt-1">{formErrors.first_name}</p>}

              <Input placeholder="Last name" value={newArtist.last_name} onChange={(e) => { const val = sanitizeAlpha(e.target.value); setNewArtist((p: any) => ({ ...p, last_name: val })); setFormErrors((fe) => ({ ...fe, last_name: undefined })); }} />
              {formErrors.last_name && <p className="text-xs text-red-600 mt-1">{formErrors.last_name}</p>}

              <Input placeholder="Phone" value={newArtist.phone} inputMode="numeric" maxLength={10} onChange={(e) => { const val = sanitizePhone(e.target.value); setNewArtist((p: any) => ({ ...p, phone: val })); setFormErrors((fe) => ({ ...fe, phone: undefined })); }} />
              {formErrors.phone && <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>}

              <Input placeholder="Email" value={newArtist.email} onChange={(e) => setNewArtist((p: any) => ({ ...p, email: e.target.value }))} />

              <div>
                <select value={newArtist.gender ?? ""} onChange={(e) => setNewArtist((p: any) => ({ ...p, gender: e.target.value }))} className="w-full px-3 py-2 border rounded">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <Input placeholder="City" value={newArtist.city} onChange={(e) => setNewArtist((p: any) => ({ ...p, city: e.target.value }))} />
              <Input placeholder="State" value={newArtist.state} onChange={(e) => setNewArtist((p: any) => ({ ...p, state: e.target.value }))} />

              <div>
                <select value={newArtist.subscription_plan_id ?? ""} onChange={(e) => setNewArtist((p: any) => ({ ...p, subscription_plan_id: e.target.value }))} className="w-full px-3 py-2 border rounded">
                  <option value="">{plansLoading ? "Loading plans..." : "Select a plan"}</option>
                  {plans.map((pl: any) => (<option key={pl.id} value={pl.id}>{pl.name}</option>))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={createArtist} disabled={createLoading}>{createLoading ? "Creating..." : "Create Artist"}</Button>
            </div>
          </div>
          {/* ... inside the Add Artist modal before the grid of inputs ... */}

        </div>
      )}

      {/* Assign Plan Modal (responsive) */}
      {planModalOpen && planModalArtistId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setPlanModalOpen(false); setPlanModalArtistId(null); }} />
          <div className="relative w-full max-w-md bg-white rounded shadow p-6 z-10">
            <h3 className="text-lg font-semibold mb-2">Assign Plan to Artist</h3>
            <p className="text-sm text-gray-600 mb-4">Choose a subscription plan to assign (or leave blank to unset).</p>

            <div className="mb-4">
              <select value={selectedPlanId ?? ""} onChange={(e) => setSelectedPlanId(e.target.value)} className="w-full px-3 py-2 border rounded">
                <option value="">{plansLoading ? "Loading plans..." : "Select a plan (or leave empty to unset)"}</option>
                {plans.map((pl: any) => (<option key={pl.id} value={pl.id}>{pl.name} {pl.price ? `— ${pl.price}` : ""}</option>))}
              </select>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">{planModalArtistId ? `Artist ID: ${planModalArtistId}` : ""}</div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => { setPlanModalOpen(false); setPlanModalArtistId(null); setSelectedPlanId(""); }}>Cancel</Button>
                <Button onClick={() => { if (planModalArtistId !== null) setArtistPlan(planModalArtistId); }} disabled={!!planActionLoading[planModalArtistId ?? -1]}>
                  {planActionLoading[planModalArtistId ?? -1] ? "Assigning..." : "Assign Plan"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
