"use client"
import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-hot-toast"

export default function LeadDistributionWithToggle() {
  const [mode, setMode] = useState<"roundrobin" | "manual">("roundrobin")
  const [loading, setLoading] = useState(false)

  const [availableMakeupTypes, setAvailableMakeupTypes] = useState<{ id: number; label: string }[]>([])
  const [makeupLoading, setMakeupLoading] = useState(false)

  const [availableEventTypes, setAvailableEventTypes] = useState<{ id: number; label: string }[]>([])
  const [eventTypesLoading, setEventTypesLoading] = useState(false)

  const [artists, setArtists] = useState<any[]>([])
  const [artistsLoading, setArtistsLoading] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState("")

  // Initialize form with all fields blank as requested
  const blankLead = {
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    service: null,
    event_type:"wedding",
    requirements: "",
    booking_date: "",
    budget_range: null,
    makeup_types: [] as number[],
    location: null,
    source: "",
    status: "",
    notes: "",
  }

  const [leadData, setLeadData] = useState<any>(blankLead)

  // static helpers (unchanged)
  const serviceOptions = [
    { id: 1, label: "Bridal Makeup" },
    { id: 2, label: "Party Makeup" },
    { id: 3, label: "Editorial" },
  ]
  const budgetOptions = [
    { id: 1, label: "Below 5k" },
    { id: 2, label: "5k - 10k" },
    { id: 3, label: "10k - 20k" },
  ]
  const locationOptions = [
    { id: 1, label: "Delhi" },
    { id: 2, label: "Mumbai" },
    { id: 3, label: "Bengaluru" },
  ]
  const sourceOptions = ["referral", "instagram", "website", "walkin"]
  const statusOptions = ["new", "contacted", "booked", "cancelled"]

  // fetch makeup types
  useEffect(() => {
    const fetchMakeupTypes = async () => {
      setMakeupLoading(true)
      try {
        const res = await fetch("https://wedmac-be.onrender.com/api/admin/master/list/?type=makeup_types", {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` },
        })
        const json = await res.json()
        const items = Array.isArray(json) ? json : json.results ?? json.makeup_types ?? []
        setAvailableMakeupTypes(items.map((it: any) => ({ id: Number(it.id), label: (it.name || it.title || "").trim() || String(it.id) })))
      } catch (err) {
        console.error("Failed to load makeup types", err)
        toast.error("Failed to load makeup types")
      } finally {
        setMakeupLoading(false)
      }
    }
    fetchMakeupTypes()
  }, [])

  // fetch event types (optional)
  useEffect(() => {
    const fetchEventTypes = async () => {
      setEventTypesLoading(true)
      try {
        const res = await fetch("https://wedmac-be.onrender.com/api/admin/master/list/?type=event_types", {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` },
        })
        const json = await res.json()
        const items = Array.isArray(json) ? json : json.results ?? json.event_types ?? []
        setAvailableEventTypes(items.map((it: any) => ({ id: Number(it.id), label: (it.name || it.title || "").trim() || String(it.id) })))
        // NOTE: removed auto-setting of leadData.event_type so the form remains blank on load
      } catch (err) {
        console.warn("No event types available, leaving form blank")
      } finally {
        setEventTypesLoading(false)
      }
    }
    fetchEventTypes()
  }, [])

  // fetch artists (only needed if manual mode is used)
  useEffect(() => {
    const fetchArtists = async () => {
      setArtistsLoading(true)
      try {
        const res = await fetch("https://wedmac-be.onrender.com/api/admin/artists/?Status=all", {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` },
        })
        const data = await res.json()
        if (Array.isArray(data)) setArtists(data)
        else if (data && data.results) setArtists(data.results)
        else if (data && data.artists) setArtists(data.artists)
        else setArtists([])
      } catch (err) {
        console.error("Error fetching artists:", err)
      } finally {
        setArtistsLoading(false)
      }
    }
    if (mode === "manual") fetchArtists() // only load when manual mode active
  }, [mode])

  const handleChange = (key: string, value: any) => setLeadData((p: any) => ({ ...p, [key]: value }))

  const toggleMakeupType = (id: number) =>
    setLeadData((p: any) => {
      const exists = Array.isArray(p.makeup_types) && p.makeup_types.includes(id)
      const newArr = exists ? p.makeup_types.filter((m: number) => m !== id) : [...(p.makeup_types || []), id]
      return { ...p, makeup_types: newArr }
    })

  const buildPayload = (includeAssigned = false) => {
    const validMakeupIds = availableMakeupTypes.map((m) => m.id)
    const makeup_types_clean = Array.isArray(leadData.makeup_types)
      ? leadData.makeup_types.map((x: any) => Number(x)).filter((n: number) => !Number.isNaN(n) && validMakeupIds.includes(n))
      : []

    // Keep event_type blank if user didn't choose one
    let event_type_clean: any = null
    if (availableEventTypes.length > 0) event_type_clean = leadData.event_type ? Number(leadData.event_type) : null
    else event_type_clean = leadData.event_type || null

    const payload: any = {
      ...leadData,
      makeup_types: makeup_types_clean,
      event_type: event_type_clean,
    }

    if (includeAssigned && selectedArtist) payload.assigned_to = Number(selectedArtist) || selectedArtist

    Object.keys(payload).forEach((k) => {
      if (payload[k] === null || payload[k] === "") delete payload[k]
    })

    // ensure roundrobin never includes assigned_to unless explicitly asked
    if (!includeAssigned && "assigned_to" in payload) delete payload.assigned_to

    return payload
  }

  const sendRoundRobin = async () => {
    if (!leadData.first_name || !leadData.phone) {
      toast.error("Please fill required fields (first name, phone)")
      return
    }
    if (availableEventTypes.length > 0 && !leadData.event_type) {
      toast.error("Please select event type")
      return
    }
    setLoading(true)
    try {
      const payload = buildPayload(false) // never include assigned_to
      console.log("ROUNDROBIN PAYLOAD ->", payload)
      const res = await fetch("https://wedmac-be.onrender.com/api/leads/admin/create/", {
        method: "POST",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      console.log("Server:", res.status, data)
      if (res.ok) {
        toast.success("Lead distributed (Round Robin)!")
        // browser alert after successful create
        window.alert("Lead distributed successfully")
        clearForm()
      } else {
        toast.error(data.message || JSON.stringify(data))
      }
    } catch (err) {
      console.error(err)
      toast.error("Error distributing lead")
    } finally {
      setLoading(false)
    }
  }

  const sendManualAssign = async () => {
    if (!leadData.first_name || !leadData.phone) {
      toast.error("Please fill required fields (first name, phone)")
      return
    }
    if (!selectedArtist) {
      toast.error("Please select an artist for manual assign")
      return
    }
    setLoading(true)
    try {
      const payload = buildPayload(true) // include assigned_to
      console.log("MANUAL PAYLOAD ->", payload)
      const res = await fetch("https://wedmac-be.onrender.com/api/leads/admin/create/", {
        method: "POST",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      console.log("Server:", res.status, data)
      if (res.ok) {
        toast.success("Lead assigned successfully!")
        // browser alert after successful assign
        window.alert("Lead assigned successfully")
        clearForm()
      } else {
        toast.error(data.message || JSON.stringify(data))
      }
    } catch (err) {
      console.error(err)
      toast.error("Error assigning lead")
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setLeadData({ ...blankLead })
    setSelectedArtist("")
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{mode === "roundrobin" ? "Round Robin — Distribute Lead" : "Manual — Assign Lead"}</h1>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-600">Mode</span>
          <button
            onClick={() => setMode(mode === "roundrobin" ? "manual" : "roundrobin")}
            className="px-3 py-1 rounded-full border bg-pink-500 text-white"
            aria-label="Toggle mode"
          >
            {mode === "roundrobin" ? "Switch to Manual" : "Switch to Round Robin"}
          </button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{mode === "roundrobin" ? "Round Robin Distribution" : "Manual Assign"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="First name" value={leadData.first_name} onChange={(e) => handleChange("first_name", e.target.value)} />
            <Input placeholder="Last name" value={leadData.last_name} onChange={(e) => handleChange("last_name", e.target.value)} />
            <Input placeholder="Phone" value={leadData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
            <Input placeholder="Email" value={leadData.email || ""} onChange={(e) => handleChange("email", e.target.value)} />

            <div>
              <label className="block text-sm mb-1">Booking date</label>
              <input type="date" className="w-full p-2 rounded border" value={leadData.booking_date || ""} onChange={(e) => handleChange("booking_date", e.target.value)} />
            </div>

            <Select onValueChange={(val) => handleChange("budget_range", Number(val))}>
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

            <Select onValueChange={(val) => handleChange("location", Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent position="popper">
                {locationOptions.map((l) => (
                  <SelectItem key={l.id} value={String(l.id)}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>

          <div>
            <label className="block text-sm mb-1">Requirements</label>
            <textarea className="w-full p-2 rounded border" value={leadData.requirements} onChange={(e) => handleChange("requirements", e.target.value)} rows={3} />
          </div>

          <div>
            <label className="block text-sm mb-2">Makeup types</label>
            <div className="flex flex-wrap gap-3">
              {availableMakeupTypes.length ? (
                availableMakeupTypes.map((m) => (
                  <label key={m.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={Array.isArray(leadData.makeup_types) && leadData.makeup_types.includes(m.id)} onChange={() => toggleMakeupType(m.id)} />
                    <span>{m.label}</span>
                  </label>
                ))
              ) : (
                <div>{makeupLoading ? "Loading..." : "No makeup types found"}</div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Notes</label>
            <textarea className="w-full p-2 rounded border" value={leadData.notes} onChange={(e) => handleChange("notes", e.target.value)} rows={2} />
          </div>

          {mode === "manual" && (
            <div>
              <label className="block text-sm mb-1">Select Artist</label>
              <Select onValueChange={(val) => setSelectedArtist(val)}>
                <SelectTrigger>
                  <SelectValue placeholder={artistsLoading ? "Loading artists..." : "Select Artist"} />
                </SelectTrigger>
                <SelectContent position="popper">
                  {artists.length > 0 ? (
                    artists.map((artist: any) => <SelectItem key={artist.id} value={String(artist.id)}>{artist.first_name} {artist.last_name}{artist.phone ? ` - ${artist.phone}` : ""}</SelectItem>)
                  ) : (
                    <div className="p-2 text-gray-500">{artistsLoading ? "Loading..." : "No artists found"}</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-2">
            {mode === "roundrobin" ? (
              <Button onClick={sendRoundRobin} disabled={loading} className="bg-green-500 hover:bg-green-600 w-full">
                {loading ? "Distributing..." : "Distribute Lead (Round Robin)"}
              </Button>
            ) : (
              <Button onClick={sendManualAssign} disabled={loading} className="bg-pink-500 hover:bg-pink-600 w-full">
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
  )
}
