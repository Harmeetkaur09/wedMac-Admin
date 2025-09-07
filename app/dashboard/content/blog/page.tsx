"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  Calendar,
  ImageIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/*
  Blog Management page with CRUD integration + Comments per blog

  New features in this file:
  - "Comments" button on each blog card
  - Comments modal that lists comments for the selected blog (GET /blogs/admin/comments/<project_id>/)
  - Edit-comment modal (PUT /blogs/admin/update-comment/<comment_id>/)
  - Delete-comment action (DELETE /blogs/admin/delete-comment/<comment_id>/)

  NOTES:
  - Uses sessionStorage.accessToken (falls back to DEFAULT_TOKEN for development).
  - Ensure CORS and server auth allow the admin endpoints.
  - Adjust BASE if your API root differs.
*/

type BlogPost = {
  id: number;
  project_id: string;
  title: string;
  content: string;
  hashtags: string;
  category: string;
  author_name?: string;
  created_on?: string;
  photos?: string[];
  [key: string]: any;
};

type CommentItem = {
  id: number;
  blog_id: number | string;
  blog_title?: string;
  name: string;
  phone_number?: string;
  location?: string;
  comment: string;
  created_at?: string;
};

const DEFAULT_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU2NzcxNDc2LCJpYXQiOjE3NTY0MTE0NzYsImp0aSI6Ijg0ODA3ZTRmMzhiMTQzNTliNWYwZWJiZTViMjA0ZjAzIiwidXNlcl9pZCI6MzR9.lGDCdX9QiSzeWGd8eYGLt5GFZBZJHxWwx7GD5hA1X_c";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.wedmacindia.com";

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [category, setCategory] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [photosToDelete, setPhotosToDelete] = useState<Set<string>>(new Set());

  // --- comments related state ---
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [activePostForComments, setActivePostForComments] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  // edit comment modal
  const [editingComment, setEditingComment] = useState<CommentItem | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone_number: "", location: "", comment: "" });

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getToken = () => {
    const t = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null;
    return t ? `Bearer ${t}` : DEFAULT_TOKEN;
  };

  const fetchPosts = async (categoryFilter?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${BASE}/api/blogs/get/`);
      if (categoryFilter) url.searchParams.set("category", categoryFilter);
      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed to fetch blogs: ${res.status} ${txt}`);
      }
      const body = await res.json();
      const list: BlogPost[] = Array.isArray(body) ? body : body?.results ?? [];
      setPosts(list);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Comments APIs ----------------
  const openCommentsForPost = async (post: BlogPost) => {
    setActivePostForComments(post);
    setComments([]);
    setCommentsError(null);
    setCommentsModalOpen(true);
    await fetchComments(post.project_id || post.id);
  };

  const fetchComments = async (projectIdForComments: string | number) => {
    setCommentsLoading(true);
    setCommentsError(null);
    try {
      const url = `${BASE}/api/blogs/admin/comments/${encodeURIComponent(String(projectIdForComments))}/`;
      const res = await fetch(url, { headers: { Authorization: getToken() } });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed to fetch comments: ${res.status} ${txt}`);
      }
      const body = await res.json();
      const list: CommentItem[] = Array.isArray(body) ? body : body?.results ?? [];
      setComments(list);
    } catch (err: any) {
      console.error(err);
      setCommentsError(err?.message || "Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  };

  const openEditCommentModal = (c: CommentItem) => {
    // close comments modal to avoid overlap when opening the edit modal
    setCommentsModalOpen(false);
    setEditingComment(c);
    setEditForm({ name: c.name || "", phone_number: c.phone_number || "", location: c.location || "", comment: c.comment || "" });
  };


  const closeEditModal = () => {
    setEditingComment(null);
    setEditForm({ name: "", phone_number: "", location: "", comment: "" });
  };

  const submitEditComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingComment) return;
    setEditSubmitting(true);
    try {
      const url = `${BASE}/api/blogs/admin/update-comment/${encodeURIComponent(String(editingComment.id))}/`;
      const res = await fetch(url, {
        method: "PUT",
        headers: { Authorization: getToken(), "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Update failed: ${res.status} ${txt}`);
      }
      // refresh comments
      if (activePostForComments) await fetchComments(activePostForComments.project_id || activePostForComments.id);
      closeEditModal();
      alert("Comment updated.");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to update comment");
    } finally {
      setEditSubmitting(false);
    }
  };

  const deleteComment = async (c: CommentItem) => {
    if (!confirm("Delete this comment?")) return;
    try {
      const url = `${BASE}/api/blogs/admin/delete-comment/${encodeURIComponent(String(c.id))}/`;
      const res = await fetch(url, { method: "DELETE", headers: { Authorization: getToken() } });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Delete failed: ${res.status} ${txt}`);
      }
      // remove locally
      setComments((prev) => prev.filter((x) => x.id !== c.id));
      alert("Deleted comment.");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to delete comment");
    }
  };

  // ---------------- End Comments APIs ----------------

  const resetForm = () => {
    setProjectId("");
    setProjectId("");
    setTitle("");
    setContent("");
    setHashtags("");
    setCategory("");
    setExistingPhotos([]);
    setPhotosToDelete(new Set());
    if (fileRef.current) fileRef.current.value = "";
  };

  const populateForEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setProjectId(post.project_id || "");
    setTitle(post.title || "");
    setContent(post.content || "");
    setHashtags(post.hashtags || "");
    setCategory(post.category || "");
    setExistingPhotos(Array.isArray(post.photos) ? post.photos : []);
    setPhotosToDelete(new Set());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onTogglePhotoDelete = (url: string) => {
    setPhotosToDelete((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const createOrUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      if (!title.trim() || !content.trim() || !hashtags.trim() || !category.trim()) {
        throw new Error("Please fill required fields: title, content, hashtags, category.");
      }

      const files = fileRef.current?.files ?? null;
      const newFilesCount = files ? files.length : 0;
      const keptExistingCount = existingPhotos.filter((p) => !photosToDelete.has(p)).length;
      if (keptExistingCount + newFilesCount > 3) {
        throw new Error("Total images (existing + new) cannot exceed 3.");
      }

      const form = new FormData();
      form.append("title", title);
      form.append("content", content);
      form.append("hashtags", hashtags);
      form.append("category", category);

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) form.append("images", files[i]);
      }

      if (editingId && photosToDelete.size > 0) {
        form.append("images_to_delete", JSON.stringify(Array.from(photosToDelete)));
      }

      const token = getToken();

      if (!editingId) {
        if (!projectId.trim()) throw new Error("project_id is required for create.");
        form.append("project_id", projectId);

        const res = await fetch(`${BASE}/api/blogs/create/`, {
          method: "POST",
          headers: { Authorization: token },
          body: form,
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Create failed: ${res.status} ${txt}`);
        }

        await fetchPosts();
        resetForm();
        alert("Blog post created.");
      } else {
        const res = await fetch(`${BASE}/api/blogs/edit/${projectId}/`, {
          method: "PUT",
          headers: { Authorization: token },
          body: form,
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Update failed: ${res.status} ${txt}`);
        }

        await fetchPosts();
        resetForm();
        alert("Blog post updated.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to save blog post.");
    } finally {
      setSubmitting(false);
    }
  };

  const removePost = async (projectIdToDelete: string) => {
    if (!confirm("Delete this blog post? This action cannot be undone.")) return;

    try {
      const token = getToken();
      const url = `${BASE}/api/blogs/delete/${encodeURIComponent(projectIdToDelete)}/`;

      const res = await fetch(url, { method: "DELETE", headers: { Authorization: token } });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Delete failed: ${res.status} ${txt}`);
      }

      setPosts((s) => s.filter((p) => p.project_id !== projectIdToDelete));
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">Create and manage blog posts</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Blog Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Posts</p>
              <p className="text-2xl font-bold">{posts.length}</p>
              <p className="text-xs text-gray-500">All blog posts</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Published</p>
              <p className="text-2xl font-bold">{posts.filter((p) => p["status"] === "published").length}</p>
              <p className="text-xs text-gray-500">Published posts</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Categories</p>
              <p className="text-2xl font-bold">{Array.from(new Set(posts.map((p) => p.category))).length}</p>
              <p className="text-xs text-gray-500">Unique categories</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Latest</p>
              <p className="text-2xl font-bold">{posts[0]?.title ?? "-"}</p>
              <p className="text-xs text-gray-500">Most recent post</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create / Edit form */}
      <Card>
        <CardContent>
          <form onSubmit={createOrUpdate} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Project ID (required for create)" value={projectId} onChange={(e) => setProjectId(e.target.value)} />
              <Input placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <textarea placeholder="Content *" required value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded" rows={6} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Hashtags (comma separated) *" value={hashtags} onChange={(e) => setHashtags(e.target.value)} />
              <Input placeholder="Category *" value={category} onChange={(e) => setCategory(e.target.value)} />
              <div className="flex items-center gap-2">
                <input ref={fileRef} type="file" accept="image/*" multiple />
              </div>
            </div>

            {/* existing photos (edit mode) */}
            {editingId && existingPhotos.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Existing Photos</div>
                <div className="flex gap-3">
                  {existingPhotos.map((url) => (
                    <div key={url} className="relative w-24 h-24 bg-gray-100 rounded overflow-hidden">
                      <img src={url} alt="photo" className="w-full h-full object-cover" />
                      <label className="absolute top-1 right-1 bg-white rounded p-1 text-xs cursor-pointer">
                        <input type="checkbox" checked={photosToDelete.has(url)} onChange={() => onTogglePhotoDelete(url)} /> Delete
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              {editingId && (
                <Button variant="outline" onClick={() => resetForm()}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={submitting}>
                {editingId ? (submitting ? "Updating..." : "Update Post") : submitting ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Posts list */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>All Blog Posts</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search posts..." className="pl-8 w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {loading ? (
                  <div className="py-6 text-center">Loading posts...</div>
                ) : error ? (
                  <div className="py-4 text-red-600">{error}</div>
                ) : posts.length === 0 ? (
                  <div className="py-6 text-center text-gray-500">No posts yet.</div>
                ) : (
                  posts
                    .filter((post) => {
                      if (!searchTerm.trim()) return true;
                      const term = searchTerm.toLowerCase();
                      return (
                        post.title?.toLowerCase().includes(term) ||
                        post.content?.toLowerCase().includes(term) ||
                        post.hashtags?.toLowerCase().includes(term) ||
                        post.category?.toLowerCase().includes(term) ||
                        post.author_name?.toLowerCase().includes(term)
                      );
                    })
                    .map((post) => (
                      <Card key={post.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-48 flex-shrink-0">
                              <div className="w-full h-100 md:h-60 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                {post.photos && post.photos.length > 0 ? (
                                  <img src={post.photos[0]} alt={post.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="flex flex-col items-center text-gray-400">
                                    <ImageIcon className="h-6 w-6" />
                                    <div className="text-xs">No image</div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-xl font-bold hover:text-[#FF6B9D] cursor-pointer">{post.title}</h3>
                                  <p className="text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                 
                                  <span>{post.author_name ?? "Unknown"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(post.created_on)}</span>
                                </div>
                                <span>{post.category}</span>
                              </div>

                              <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm" onClick={() => populateForEdit(post)}>
                                  <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => window.open(`https://wed-mac-qsxz.vercel.app/blog/${post.project_id || post.id}`, "_blank")}>
                                  <Eye className="h-3.5 w-3.5 mr-1" /> View
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => removePost(post.project_id)}>
                                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                                </Button>

                                {/* NEW: Comments button */}
                                <Button variant="outline" size="sm" onClick={() => openCommentsForPost(post)}>
                                  <span className="mr-1">💬</span> Comments
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published">
          <Card>
            <CardContent className="p-6">Published blog posts will be displayed here.</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft">
          <Card>
            <CardContent className="p-6">Draft blog posts will be displayed here.</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardContent className="p-6">Scheduled blog posts will be displayed here.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Comments Modal */}
      {commentsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCommentsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-auto max-h-[80vh] z-10">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Comments for: {activePostForComments?.title ?? activePostForComments?.project_id}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{comments.length} comments</span>
                <Button variant="ghost" onClick={() => setCommentsModalOpen(false)}>Close</Button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {commentsLoading ? (
                <div>Loading comments...</div>
              ) : commentsError ? (
                <div className="text-red-600">{commentsError}</div>
              ) : comments.length === 0 ? (
                <div className="text-gray-500">No comments for this post.</div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-gray-500">{c.phone_number}</div>
                          <div className="text-xs text-gray-500">{c.location}</div>
                        </div>
                        <div className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{c.comment}</div>
                        <div className="text-xs text-gray-400 mt-2">{c.created_at ? formatDate(c.created_at) : "-"}</div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditCommentModal(c)}>
                          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteComment(c)}>
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Comment Modal */}
      {editingComment && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => closeEditModal()} />
          <div className="relative bg-white w-full max-w-xl rounded-lg shadow-lg overflow-auto z-10">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Edit Comment</h3>
              <Button variant="ghost" onClick={() => closeEditModal()}>Close</Button>
            </div>
            <form className="p-4 space-y-3" onSubmit={submitEditComment}>
              <Input placeholder="Name" value={editForm.name} onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))} />
              <Input placeholder="Phone number" value={editForm.phone_number} onChange={(e) => setEditForm((s) => ({ ...s, phone_number: e.target.value }))} />
              <Input placeholder="Location" value={editForm.location} onChange={(e) => setEditForm((s) => ({ ...s, location: e.target.value }))} />
              <textarea placeholder="Comment" value={editForm.comment} onChange={(e) => setEditForm((s) => ({ ...s, comment: e.target.value }))} className="w-full p-2 border rounded" rows={5} />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => closeEditModal()}>Cancel</Button>
                <Button type="submit" disabled={editSubmitting}>{editSubmitting ? "Saving..." : "Save"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
