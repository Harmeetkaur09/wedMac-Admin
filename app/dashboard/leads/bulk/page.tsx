"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Search } from "lucide-react";

type LeadRow = Record<string, any>;

type ResultItem = {
  assigned_to: any;
  success: boolean;
  lead?: any;
  errors?: any;
};

export default function LeadBulkUploaderpage() {
  const [fileName, setFileName] = useState("");
  const [parsing, setParsing] = useState(false);
  const [previewRows, setPreviewRows] = useState<LeadRow[]>([]);
  const [results, setResults] = useState<ResultItem[] | null>(null);
  const [uploading, setUploading] = useState(false);

  // Default mapping: tries to map many common header variants to API keys
  const normalizeHeader = (h: string) =>
    String(h || "").toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");

  const headerToKey = (hdr: string) => {
    const h = normalizeHeader(hdr);
    if (!h) return null;
    // common synonyms
    const map: Record<string, string> = {
      firstname: "first_name",
      first_name: "first_name",
      last_name: "last_name",
      lastname: "last_name",
      phone: "phone",
      mobile: "phone",
      phone_number: "phone",
      email: "email",
      eventtype: "event_type",
      event_type: "event_type",
      bookingdate: "booking_date",
      booking_date: "booking_date",
      requirements: "requirements",
      service: "service",
      service_id: "service",
      budget: "budget_range",
      budget_range: "budget_range",
      location: "location",
      city: "location",
      requestedartist: "requested_artist",
      requested_artist: "requested_artist",
      source: "source",
      maxclaims: "max_claims",
      max_claims: "max_claims",
      notes: "notes",
      status: "status",
      makeup_types: "makeup_types",
      makeuptypes: "makeup_types",
    };
    return map[h] || h; // fallback to normalized header if not in map
  };

  const parseFile = async (file: File) => {
    setParsing(true);
    setPreviewRows([]);
    setResults(null);
    try {
      const ab = await file.arrayBuffer();
      const workbook = XLSX.read(ab, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // Convert to JSON using header row
      const raw: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      if (!raw || !raw.length) {
        toast.error("File empty or couldn't parse rows");
        setParsing(false);
        return;
      }

      // Build normalized rows
      const normalized: LeadRow[] = raw.map((row) => {
        const out: any = {};
        Object.keys(row).forEach((origHdr) => {
          const key = headerToKey(origHdr);
          if (!key) return;
          let val = row[origHdr];
          if (typeof val === "string") val = val.trim();
          // simple conversions for numeric fields
          if (["service", "budget_range", "requested_artist", "max_claims"].includes(key) && val !== "") {
            const n = Number(val);
            val = Number.isFinite(n) ? n : val;
          }
          // handle comma separated makeup_types
        if (key === "makeup_types" && val !== "") {
  if (typeof val === "string") {
    const arr = val.split(/[,;|]/).map((s) => s.trim()).filter(Boolean);
    val = arr;
  }
}


          // normalize date to YYYY-MM-DD if possible
          if (key === "booking_date" && val) {
            // If Excel serial date (number), convert
            if (typeof val === "number") {
              const date = XLSX.SSF.parse_date_code(val);
              if (date) {
                const y = date.y;
                const m = String(date.m).padStart(2, "0");
                const d = String(date.d).padStart(2, "0");
                val = `${y}-${m}-${d}`;
              }
            } else {
              // try creating Date
              const d = new Date(String(val));
              if (!Number.isNaN(d.getTime())) {
                val = d.toISOString().slice(0, 10);
              }
            }
          }

          out[key] = val;
        });
        // remove empty keys
        Object.keys(out).forEach((k) => {
          if (out[k] === "" || out[k] === null || out[k] === undefined) delete out[k];
        });
        return out;
      });

      setPreviewRows(normalized);
      setFileName(file.name);
      toast.success(`${normalized.length} rows parsed`);
    } catch (err) {
      console.error("Parse error", err);
      toast.error("Failed to parse file");
    } finally {
      setParsing(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    parseFile(f);
  };

  const doUpload = async () => {
    if (!previewRows || !previewRows.length) {
      toast.error("No rows to upload");
      return;
    }

    setUploading(true);
    setResults(null);
    try {
      const payload = { leads: previewRows };
      const token = sessionStorage.getItem("accessToken") || sessionStorage.getItem("token") || sessionStorage.getItem("authToken");
      const res = await fetch("api/leads/admin/create-multiple/".replace(/^\/?/, "https://api.wedmacindia.com/").replace(/([^:]\/\/)[\/]*/, "$1"), {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        console.error("Server error", res.status, data);
        toast.error(data?.message || `Upload failed: ${res.status}`);
        setResults(null);
      } else {
        toast.success("Bulk lead creation completed");
        // expected structure: { message: "..", results: [ { success: true, lead: {...} } ] }
        setResults(Array.isArray(data?.results) ? data.results : null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload request failed");
      setResults(null);
    } finally {
      setUploading(false);
    }
  };

  const downloadErrorsCsv = () => {
    if (!results) return;
    const rows = results.map((r, idx) => {
      return {
        row: idx + 1,
        success: r.success,
        errors: r.success ? "" : JSON.stringify(r.errors || r),
        assigned_to: r.success ? JSON.stringify(r.assigned_to || r.lead || "") : "",
      };
    });
    const header = Object.keys(rows[0] || {}).join(",") + "\n";
    const csv = header + rows.map((r) => Object.values(r).map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lead_upload_results_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Card>
            <CardHeader className="pb-8">
              <div className="flex justify-between items-center">
                <CardTitle>Bulk Lead Create</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                
                  </div>
                 
                </div>
              </div>
            </CardHeader>
      </Card>
      <div className="flex items-center gap-3">
        <label className="block text-sm font-medium">Upload Excel / CSV</label>
        <Input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} />
        <div className="text-sm text-gray-500">{fileName}</div>
      </div>

      {parsing && <div>Parsing file...</div>}

      {previewRows && previewRows.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <strong>Preview:</strong> {previewRows.length} rows parsed
            </div>
            <div className="flex gap-2">
              <Button onClick={() => { setPreviewRows([]); setResults(null); setFileName(""); }} variant="ghost">Clear</Button>
              <Button onClick={doUpload} disabled={uploading}>{uploading ? "Uploading..." : "Upload all leads"}</Button>
            </div>
          </div>

          <div className="overflow-auto max-h-80 border rounded p-2">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">#</th>
                  {Object.keys(previewRows[0]).slice(0, 10).map((k) => (
                    <th key={k} className="text-left pr-4">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.slice(0, 200).map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="pr-4">{i + 1}</td>
                    {Object.keys(previewRows[0]).slice(0, 10).map((k) => (
                      <td key={k} className="pr-4">{Array.isArray(r[k]) ? r[k].join(",") : String(r[k] ?? "")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {previewRows.length > 200 && <div className="text-xs text-gray-500">Showing first 200 rows</div>}
          </div>
        </div>
      )}

    {results && (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div>
        <strong>Results:</strong> {results.length} rows processed
      </div>
      <div className="flex gap-2">
        <Button onClick={downloadErrorsCsv}>Download results CSV</Button>
      </div>
    </div>

    <div className="overflow-auto max-h-96 border rounded p-2">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">#</th>
            <th className="text-left">Status</th>
            <th className="text-left">Message</th>
            <th className="text-left">Error</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} className={`border-t ${r.success ? "bg-green-50" : "bg-red-50"}`}>
              <td className="pr-4">{i + 1}</td>
              <td className="pr-4">{r.success ? "OK" : "Error"}</td>
              <td className="pr-4">
                {r.success ? "Lead submitted successfully" : "-"}
              </td>
              <td className="pr-4">
                {!r.success && (
                  <pre className="whitespace-pre-wrap text-xs">
                    {JSON.stringify(r.errors || r, null, 2)}
                  </pre>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

    </div>
  );
}
