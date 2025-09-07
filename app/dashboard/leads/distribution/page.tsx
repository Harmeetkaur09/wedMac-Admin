"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";

export default function LeadDistributionWithToggle() {
  const [mode, setMode] = useState<"roundrobin" | "manual">("roundrobin");
  const [loading, setLoading] = useState(false);

  const [availableMakeupTypes, setAvailableMakeupTypes] = useState<
    { id: number; label: string }[]
  >([]);
  const [makeupLoading, setMakeupLoading] = useState(false);

  const [availableEventTypes, setAvailableEventTypes] = useState<
    { id: number; label: string }[]
  >([]);
  const [eventTypesLoading, setEventTypesLoading] = useState(false);

  const [artists, setArtists] = useState<any[]>([]);
  const [artistsLoading, setArtistsLoading] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState("");

  // NEW: control for round-robin max_claim_lead (visible only in roundrobin mode)
  const [maxClaimLead, setMaxClaimLead] = useState<number>(1);

  // Initialize form with all fields blank as requested
  const blankLead = {
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    service: null,
    event_type: "", // now blank string (user types)
    requirements: "",
    booking_date: "",
    budget_range: null,
    makeup_types: [] as number[],
    location: "", // now string input
    source: "",
    status: "",
    notes: "",
  };

  const [leadData, setLeadData] = useState<any>(blankLead);

  // static helpers (unchanged)
  const serviceOptions = [
    { id: 1, label: "Bridal Makeup" },
    { id: 2, label: "Party Makeup" },
    { id: 3, label: "Editorial" },
  ];
  const budgetOptions = [
    { id: 1, label: "Below 5k" },
    { id: 2, label: "5k - 10k" },
    { id: 3, label: "10k - 20k" },
  ];
  const sourceOptions = ["referral", "instagram", "website", "walkin"];
  const statusOptions = ["new", "contacted", "booked", "cancelled"];

  // fetch makeup types
  useEffect(() => {
    const fetchMakeupTypes = async () => {
      setMakeupLoading(true);
      try {
        const res = await fetch(
          "https://api.wedmacindia.com/api/admin/master/list/?type=makeup_types",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          }
        );
        const json = await res.json();
        const items = Array.isArray(json)
          ? json
          : json.results ?? json.makeup_types ?? [];
        setAvailableMakeupTypes(
          items.map((it: any) => ({
            id: Number(it.id),
            label: (it.name || it.title || "").trim() || String(it.id),
          }))
        );
      } catch (err) {
        console.error("Failed to load makeup types", err);
        toast.error("Failed to load makeup types");
      } finally {
        setMakeupLoading(false);
      }
    };
    fetchMakeupTypes();
  }, []);

  // fetch event types (kept as suggestions but not required)
  useEffect(() => {
    const fetchEventTypes = async () => {
      setEventTypesLoading(true);
      try {
        const res = await fetch(
          "https://api.wedmacindia.com/api/admin/master/list/?type=event_types",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          }
        );
        const json = await res.json();
        const items = Array.isArray(json)
          ? json
          : json.results ?? json.event_types ?? [];
        setAvailableEventTypes(
          items.map((it: any) => ({
            id: Number(it.id),
            label: (it.name || it.title || "").trim() || String(it.id),
          }))
        );
      } catch (err) {
        console.warn("No event types available, leaving form free-text");
      } finally {
        setEventTypesLoading(false);
      }
    };
    fetchEventTypes();
  }, []);

  // fetch artists (only needed if manual mode is used)
  useEffect(() => {
    const fetchArtists = async () => {
      setArtistsLoading(true);
      try {
        const res = await fetch(
          "https://api.wedmacindia.com/api/admin/artists/?Status=all",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await res.json();
        if (Array.isArray(data)) setArtists(data);
        else if (data && data.results) setArtists(data.results);
        else if (data && data.artists) setArtists(data.artists);
        else setArtists([]);
      } catch (err) {
        console.error("Error fetching artists:", err);
      } finally {
        setArtistsLoading(false);
      }
    };
    if (mode === "manual") fetchArtists(); // only load when manual mode active
  }, [mode]);

  const handleChange = (key: string, value: any) =>
    setLeadData((p: any) => ({ ...p, [key]: value }));

  const toggleMakeupType = (id: number) =>
    setLeadData((p: any) => {
      const exists =
        Array.isArray(p.makeup_types) && p.makeup_types.includes(id);
      const newArr = exists
        ? p.makeup_types.filter((m: number) => m !== id)
        : [...(p.makeup_types || []), id];
      return { ...p, makeup_types: newArr };
    });

  const buildPayload = (includeAssigned = false) => {
    const validMakeupIds = availableMakeupTypes.map((m) => m.id);
    const makeup_types_clean = Array.isArray(leadData.makeup_types)
      ? leadData.makeup_types
          .map((x: any) => Number(x))
          .filter((n: number) => !Number.isNaN(n) && validMakeupIds.includes(n))
      : [];

    // EVENT TYPE and LOCATION are now treated as free-text strings
    const event_type_clean =
      leadData.event_type && String(leadData.event_type).trim() !== ""
        ? String(leadData.event_type).trim()
        : null;

    const location_clean =
      leadData.location && String(leadData.location).trim() !== ""
        ? String(leadData.location).trim()
        : null;

    const payload: any = {
      ...leadData,
      makeup_types: makeup_types_clean,
      event_type: event_type_clean,
      location: location_clean,
    };

    if (includeAssigned && selectedArtist) {
      const artistId = Number(selectedArtist);
      payload.assigned_to = Number.isFinite(artistId) ? artistId : selectedArtist;
      // if status booked, also send booked_artist
      if ((leadData.status || "").toString().toLowerCase() === "booked") {
        payload.booked_artist = Number.isFinite(artistId)
          ? artistId
          : selectedArtist;
      }
    }

    Object.keys(payload).forEach((k) => {
      if (payload[k] === null || payload[k] === "") delete payload[k];
    });

    if (!includeAssigned && "assigned_to" in payload) delete payload.assigned_to;
    if (!includeAssigned && "booked_artist" in payload)
      delete payload.booked_artist;

    return payload;
  };

  const sendRoundRobin = async () => {
    if (!leadData.first_name || !leadData.phone) {
      toast.error("Please fill required fields (first name, phone)");
      return;
    }

    if (!Number.isFinite(maxClaimLead) || maxClaimLead < 1) {
      toast.error("Please provide a valid Capping Lead (>= 1)");
      return;
    }

    setLoading(true);
    try {
      const payload = buildPayload(false); // never include assigned_to for roundrobin
      // attach max_claim_lead for round robin distribution
      payload.max_claims = Number(maxClaimLead);

      console.log("ROUNDROBIN PAYLOAD ->", payload);
      const res = await fetch(
        "https://api.wedmacindia.com/api/leads/admin/create/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      console.log("Server:", res.status, data);
      if (res.ok) {
        toast.success("Lead distributed (Round Robin)!");
        window.alert("Lead distributed successfully");
        clearForm();
      } else {
        toast.error(data.message || JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      toast.error("Error distributing lead");
    } finally {
      setLoading(false);
    }
  };

  const sendManualAssign = async () => {
    if (!leadData.first_name || !leadData.phone) {
      toast.error("Please fill required fields (first name, phone)");
      return;
    }
    if (!selectedArtist) {
      toast.error("Please select an artist for manual assign");
      return;
    }

    setLoading(true);
    try {
      const payload = buildPayload(true); // include assigned_to

      // IMPORTANT: manual mode must have hidden default max_claim_lead = 1
      payload.max_claim_lead = 1;

      console.log("MANUAL PAYLOAD ->", payload);

      const res = await fetch(
        "https://api.wedmacindia.com/api/leads/admin/create/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("Server:", res.status, data);

      if (!res.ok) {
        toast.error(data.message || JSON.stringify(data));
        return;
      }

      toast.success("Lead created successfully");

      const createdLeadId = data?.lead?.id ?? data?.id ?? null;
      const serverAssigned = data?.assigned_to ?? null;
      const serverBooked = data?.booked_artist ?? data?.booked_artist_id ?? null;

      if (createdLeadId) {
        const needAssign = !serverAssigned || serverAssigned === null;
        const needBooked =
          !serverBooked ||
          serverBooked === null ||
          (leadData.status || "").toString().toLowerCase() === "booked";

        if (needAssign || needBooked) {
          const patchBody: any = {};
          const artistId = Number(selectedArtist);
          if (needAssign) patchBody.assigned_to = Number.isFinite(artistId) ? artistId : selectedArtist;
          if (needBooked && (leadData.status || "").toString().toLowerCase() === "booked") {
            patchBody.booked_artist = Number.isFinite(artistId) ? artistId : selectedArtist;
          }

          if (Object.keys(patchBody).length > 0) {
            try {
              const assignRes = await fetch(
                `https://api.wedmacindia.com/api/leads/${createdLeadId}/update/`,
                {
                  method: "PATCH",
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(patchBody),
                }
              );
              const assignData = await assignRes.json().catch(() => null);
              console.log("Assign after create:", assignRes.status, assignData);
              if (assignRes.ok) {
                toast.success("Lead assigned to artist after create.");
              } else {
                console.warn("Assign failed after create:", assignData);
                toast.error("Created but assignment (or booked_artist set) failed.");
              }
            } catch (err) {
              console.error("Assign-after-create error:", err);
              toast.error("Created but assignment request failed.");
            }
          }
        }
      }

      clearForm();
    } catch (err) {
      console.error(err);
      toast.error("Error assigning lead");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setLeadData({ ...blankLead });
    setSelectedArtist("");
    setMaxClaimLead(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {mode === "roundrobin"
            ? "Round Robin — Distribute Lead"
            : "Manual — Assign Lead"}
        </h1>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-600">Mode</span>
          <button
            onClick={() =>
              setMode(mode === "roundrobin" ? "manual" : "roundrobin")
            }
            className="px-3 py-1 rounded-full border bg-pink-500 text-white"
            aria-label="Toggle mode"
          >
            {mode === "roundrobin" ? "Switch to Manual" : "Switch to Round Robin"}
          </button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "roundrobin" ? "Round Robin Distribution" : "Manual Assign"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="First name"
              value={leadData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
            <Input
              placeholder="Last name"
              value={leadData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
            <Input
              placeholder="Phone"
              value={leadData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <Input
              placeholder="Email"
              value={leadData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <div>
              <label className="block text-sm mb-1">Booking date</label>
              <input
                type="date"
                className="w-full p-2 rounded border"
                value={leadData.booking_date || ""}
                onChange={(e) => handleChange("booking_date", e.target.value)}
              />
            </div>

            <Select
              onValueChange={(val) => handleChange("budget_range", Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Budget range" />
              </SelectTrigger>
              <SelectContent position="popper">
                {budgetOptions.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* ---------- CHANGED: Event type as free-text input ---------- */}
            <Input
              placeholder="Event type (e.g. Wedding, Engagement)"
              value={leadData.event_type || ""}
              onChange={(e) => handleChange("event_type", e.target.value)}
            />

            {/* ---------- CHANGED: Location as free-text input ---------- */}
            <Input
              placeholder="Location (city / area as text)"
              value={leadData.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Requirements</label>
            <textarea
              className="w-full p-2 rounded border"
              value={leadData.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Makeup types</label>
            <div className="flex flex-wrap gap-3">
              {availableMakeupTypes.length ? (
                availableMakeupTypes.map((m) => (
                  <label key={m.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(leadData.makeup_types) &&
                        leadData.makeup_types.includes(m.id)
                      }
                      onChange={() => toggleMakeupType(m.id)}
                    />
                    <span>{m.label}</span>
                  </label>
                ))
              ) : (
                <div>
                  {makeupLoading ? "Loading..." : "No makeup types found"}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Notes</label>
            <textarea
              className="w-full p-2 rounded border"
              value={leadData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={2}
            />
          </div>

          {/* NEW: show max_claim_lead input only for roundrobin mode */}
          {mode === "roundrobin" && (
            <div className="w-48">
              <label className="block text-sm mb-1">Capping</label>
              <Input
                type="number"
                min={1}
                value={String(maxClaimLead)}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setMaxClaimLead(Number.isFinite(v) && v >= 1 ? Math.floor(v) : 1);
                }}
                aria-label="Capping lead for round robin"
                placeholder="1"
              />
              <p className="text-xs text-gray-500 mt-1">How many artists can claim this lead (round-robin)</p>
            </div>
          )}

          {mode === "manual" && (
            <div>
              <label className="block text-sm mb-1">Select Artist</label>
              <Select onValueChange={(val) => setSelectedArtist(val)}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={artistsLoading ? "Loading artists..." : "Select Artist"}
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  {artists.length > 0 ? (
                    artists.map((artist: any) => (
                      <SelectItem key={artist.id} value={String(artist.id)}>
                        {artist.first_name} {artist.last_name}
                        {artist.phone ? ` - ${artist.phone}` : ""}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">
                      {artistsLoading ? "Loading..." : "No artists found"}
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-2">
            {mode === "roundrobin" ? (
              <Button
                onClick={sendRoundRobin}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 w-full"
              >
                {loading ? "Distributing..." : "Distribute Lead (Round Robin)"}
              </Button>
            ) : (
              <Button
                onClick={sendManualAssign}
                disabled={loading}
                className="bg-pink-500 hover:bg-pink-600 w-full"
              >
                {loading ? "Assigning..." : "Assign Lead (Manual)"}
              </Button>
            )}
            <Button onClick={clearForm} variant="ghost">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
