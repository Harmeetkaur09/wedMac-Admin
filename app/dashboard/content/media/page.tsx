"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, Upload, ImageIcon, Video, FileText, Download, Trash2, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/*
  MediaManagement page with Video Review CRUD integration.
  - GET  /api/reviews/video-reviews/get/
  - POST /api/reviews/video-reviews/create/       (multipart/form-data)
  - PUT  /api/reviews/video-reviews/update/:id/   (multipart/form-data supported)
  - DELETE /api/reviews/video-reviews/delete/:id/

  Notes:
  - Uses sessionStorage.adminToken (fallback to DEFAULT_TOKEN for dev).
  - Multipart requests SHOULD NOT set `Content-Type` header so browser adds boundary.
  - This file is an inline, minimal UI. Replace prompt/alert flows with modals if desired.
*/

type VideoReview = {
  id: number;
  comment: string;
  client_name: string;
  location?: string | null;
  used_service: string;
  video?: string | null;
  created_at?: string;
  [key: string]: any;
};

const DEFAULT_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU2NzcxNDc2LCJpYXQiOjE3NTY0MTE0NzYsImp0aSI6Ijg0ODA3ZTRmMzhiMTQzNTliNWYwZWJiZTViMjA0ZjAzIiwidXNlcl9pZCI6MzR9.lGDCdX9QiSzeWGd8eYGLt5GFZBZJHxWwx7GD5hA1X_c";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "https://wedmac-be.onrender.com";

export default function MediaManagementPage() {
  // existing static files (kept for library UI)
  const mediaFiles = [
    {
      id: 1,
      name: "hero-image.jpg",
      type: "image",
      size: "2.4 MB",
      dimensions: "1920x1080",
      uploadDate: "2023-06-10",
      url: "/placeholder.svg?height=200&width=300",
    },
    // ... (truncated for brevity) - keep the rest in your local file if needed
  ];

  // VIDEO REVIEWS state
  const [videoReviews, setVideoReviews] = useState<VideoReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // form state for create / update
  const [editingId, setEditingId] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [clientName, setClientName] = useState("");
  const [location, setLocation] = useState("");
  const [usedService, setUsedService] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVideoReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getToken = () => {
    const t = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null;
    return t ? `Bearer ${t}` : DEFAULT_TOKEN;
  };

  const fetchVideoReviews = async () => {
    setLoadingReviews(true);
    setReviewsError(null);
    try {
      const res = await fetch(`${BASE}/api/reviews/video-reviews/get/`, {
        headers: { Authorization: getToken() },
        cache: "no-store",
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed to fetch video reviews: ${res.status} ${txt}`);
      }
      const body = await res.json();
      const list: VideoReview[] = Array.isArray(body) ? body : body?.results ?? [];
      setVideoReviews(list);
    } catch (err: any) {
      console.error(err);
      setReviewsError(err?.message || "Failed to load video reviews");
    } finally {
      setLoadingReviews(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setComment("");
    setClientName("");
    setLocation("");
    setUsedService("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const populateFormForEdit = (rev: VideoReview) => {
    setEditingId(rev.id);
    setComment(rev.comment || "");
    setClientName(rev.client_name || "");
    setLocation(rev.location || "");
    setUsedService(rev.used_service || "");
    if (fileRef.current) fileRef.current.value = ""; // don't prefill file input
    // scroll into view if needed
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const createOrUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      if (!comment.trim() || !clientName.trim() || !usedService.trim()) {
        throw new Error("Please fill required fields: comment, client name and used service.");
      }

      const form = new FormData();
      form.append("comment", comment);
      form.append("client_name", clientName);
      if (location) form.append("location", location);
      form.append("used_service", usedService);

      const file = fileRef.current?.files?.[0];
      if (file) form.append("video", file);

      const token = getToken();

      if (editingId == null) {
        // CREATE
        const res = await fetch(`${BASE}/api/reviews/video-reviews/create/`, {
          method: "POST",
          headers: {
            Authorization: token,
            // DO NOT set Content-Type for multipart; browser will add boundary
          },
          body: form,
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Create failed: ${res.status} ${txt}`);
        }
        // success: refresh list
        await fetchVideoReviews();
        resetForm();
        alert("Video review created.");
      } else {
        // UPDATE (PUT)
        const res = await fetch(`${BASE}/api/reviews/video-reviews/update/${editingId}/`, {
          method: "PUT",
          headers: {
            Authorization: token,
          },
          body: form,
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Update failed: ${res.status} ${txt}`);
        }
        await fetchVideoReviews();
        resetForm();
        alert("Video review updated.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to save video review.");
    } finally {
      setSubmitting(false);
    }
  };

  const removeReview = async (id: number) => {
    if (!confirm("Delete this video review? This action cannot be undone.")) return;
    try {
      const res = await fetch(`${BASE}/api/reviews/video-reviews/delete/${id}/`, {
        method: "DELETE",
        headers: { Authorization: getToken() },
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Delete failed: ${res.status} ${txt}`);
      }
      // remove from UI
      setVideoReviews((s) => s.filter((r) => r.id !== id));
      alert("Deleted.");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to delete.");
    }
  };

  const formatDate = (d?: string) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "document":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-blue-100 text-blue-800";
      case "video":
        return "bg-purple-100 text-purple-800";
      case "document":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Management</h1>
          <p className="text-gray-600 mt-1">Upload and manage media files</p>
        </div>
        <Button className="bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] hover:from-[#FF5A8C] hover:to-[#FF4979] shadow-lg hover:shadow-xl transition-all duration-300">
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </div>

      {/* Storage overview + upload area omitted for brevity - keep your existing UI here */}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {/* ... existing media library grid ... */}
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardContent className="p-6">
              <p>Image files will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Video Reviews</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search reviews..." className="pl-8 w-64" onChange={() => {}} />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Create / Edit form */}
              <form onSubmit={createOrUpdate} className="space-y-3 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input placeholder="Client name *" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                  <Input placeholder="Used service *" value={usedService} onChange={(e) => setUsedService(e.target.value)} />
                  <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>

                <div>
                  <textarea
                    required
                    placeholder="Comment *"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input ref={fileRef} type="file" accept="video/*" />
                  <div className="flex gap-2 ml-auto">
                    {editingId && (
                      <Button variant="outline" onClick={() => resetForm()}>
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={submitting}>
                      {editingId ? (submitting ? "Updating..." : "Update Review") : submitting ? "Creating..." : "Create Review"}
                    </Button>
                  </div>
                </div>
              </form>

              {/* List of video reviews */}
              {loadingReviews ? (
                <div>Loading reviews...</div>
              ) : reviewsError ? (
                <div className="text-red-600">{reviewsError}</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {videoReviews.length === 0 && <div className="text-gray-500">No video reviews yet.</div>}
                  {videoReviews.map((r) => (
                    <Card key={r.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-4 items-start">
                          <div className="w-40">
                            {r.video ? (
                              // lightweight player fallback to link
                              <div className="aspect-video bg-black rounded overflow-hidden">
                                <video controls className="w-full h-full object-cover">
                                  <source src={r.video} />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            ) : (
                              <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                                <Video className="h-8 w-8 text-gray-500" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-sm">{r.client_name}</div>
                                <div className="text-xs text-gray-500">{r.used_service} • {r.location || "-"}</div>
                                <div className="text-sm mt-2">{r.comment}</div>
                              </div>

                              <div className="flex flex-col items-end gap-2">
                                <div className="text-xs text-gray-500">{formatDate(r.created_at)}</div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => populateFormForEdit(r)}>
                                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => removeReview(r.id)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {r.video && (
                              <div className="mt-3">
                                <a href={r.video} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 underline">
                                  Open video in a new tab
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="p-6">
              <p>Document files will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
