"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, Plus, Edit, Eye, Trash2, Calendar, ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/*
  Blog Management page with CRUD integration.

  Endpoints used (adjust BASE if your API path differs):
    GET    ${BASE}/api/blogs/get/?category=...        -> public
    POST   ${BASE}/api/blogs/create/                  -> IsSuperAdmin, multipart/form-data
    PUT    ${BASE}/api/blogs/edit/:project_id/       -> IsSuperAdmin, multipart/form-data
    DELETE ${BASE}/api/blogs/delete/:project_id/     -> IsSuperAdmin

  Notes:
  - Uses sessionStorage.adminToken (fallback to DEFAULT_TOKEN during dev).
  - Multipart requests MUST NOT set Content-Type header manually so browser sets boundary.
  - The edit flow supports adding new images (total existing+new <= 3) and marking existing images for deletion via a `images_to_delete` JSON field (server must support it; if not, adapt backend).
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
  photos?: string[]; // array of image URLs
  [key: string]: any;
};

const DEFAULT_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU2NzcxNDc2LCJpYXQiOjE3NTY0MTE0NzYsImp0aSI6Ijg0ODA3ZTRmMzhiMTQzNTliNWYwZWJiZTViMjA0ZjAzIiwidXNlcl9pZCI6MzR9.lGDCdX9QiSzeWGd8eYGLt5GFZBZJHxWwx7GD5hA1X_c";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "https://wedmac-be.onrender.com";

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
  // track existing photos for edit flow and which ones to delete
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [photosToDelete, setPhotosToDelete] = useState<Set<string>>(new Set());

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
    // validation
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

    // images
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        form.append("images", files[i]);
      }
    }

    // images to delete (edit only)
    if (editingId && photosToDelete.size > 0) {
      form.append("images_to_delete", JSON.stringify(Array.from(photosToDelete)));
    }

    const token = getToken();

    if (!editingId) {
      // ✅ CREATE
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
      // ✅ UPDATE
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


const removePost = async (projectId: string) => {
  if (!confirm("Delete this blog post? This action cannot be undone.")) return;

  try {
    const token = getToken();
    const url = `${BASE}/api/blogs/delete/${encodeURIComponent(projectId)}/`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: token },
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Delete failed: ${res.status} ${txt}`);
    }

    // filter by project_id
    setPosts((s) => s.filter((p) => p.project_id !== projectId));
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
              <p className="text-2xl font-bold">{posts.filter(p => p['status'] === 'published').length}</p>
              <p className="text-xs text-gray-500">Published posts</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Categories</p>
              <p className="text-2xl font-bold">{Array.from(new Set(posts.map(p => p.category))).length}</p>
              <p className="text-xs text-gray-500">Unique categories</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Latest</p>
              <p className="text-2xl font-bold">{posts[0]?.title ?? '-'}</p>
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
                {/* <div className="text-xs text-gray-500">Up to 3 images total</div> */}
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
              <Button type="submit" disabled={submitting}>{editingId ? (submitting ? 'Updating...' : 'Update Post') : (submitting ? 'Creating...' : 'Create Post')}</Button>
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
                    <Input
                      placeholder="Search posts..."
                      className="pl-8 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)} // ✅ update
                    />
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
      if (!searchTerm.trim()) return true; // agar search khaali hai to sab dikhao
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
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src="/placeholder.svg?height=24&width=24" />
                                  <AvatarFallback className="bg-gradient-to-br from-[#FF6B9D] to-[#FF5A8C] text-white text-xs">{(post.author_name || 'A').charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{post.author_name ?? 'Unknown'}</span>
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
                              <Button variant="outline" size="sm" onClick={() => window.open(`https://wed-mac-qsxz.vercel.app/blog/${post.project_id || post.id}`, '_blank')}>
                                <Eye className="h-3.5 w-3.5 mr-1" /> View
                              </Button>
                           <Button
  variant="outline"
  size="sm"
  className="text-red-600 hover:bg-red-50"
  onClick={() => removePost(post.project_id)}
>
  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
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
    </div>
  );
}
