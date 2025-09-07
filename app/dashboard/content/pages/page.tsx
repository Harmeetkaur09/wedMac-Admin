"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, MoreHorizontal, Edit, Info } from "lucide-react";
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
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type Comment = {
  id: number;
  artist_id: number;
  artist_name: string;
  name: string;
  phone_number: string;
  location: string;
  comment: string;
  rating: number;
  created_at: string;
};

type Artist = {
  id: number;
  first_name: string;
  last_name: string;
};

export default function ArtistCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone_number: "",
    location: "",
    comment: "",
    rating: 1,
  });

  const token = sessionStorage.getItem("accessToken");

  // Fetch approved artists
  useEffect(() => {
    async function fetchArtists() {
      try {
        const res = await fetch(
          "https://api.wedmacindia.com/api/admin/artists/?Status=approved",
          {
            headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
          }
        );
        const data = await res.json();
        setArtists(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchArtists();
  }, [token]);

  // Fetch comments
  useEffect(() => {
    async function fetchComments() {
      setLoading(true);
      setError(null);
      try {
        const url = selectedArtist
          ? `https://api.wedmacindia.com/api/artist-comments/admin/comments/${selectedArtist}/`
          : "https://api.wedmacindia.com/api/artist-comments/admin/comments/";

        const res = await fetch(url, {
          headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch comments");
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [selectedArtist, token]);

  const filtered = useMemo(() => {
    if (!query) return comments;
    const q = query.toLowerCase();
    return comments.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone_number.toLowerCase().includes(q) ||
        c.comment.toLowerCase().includes(q)
    );
  }, [comments, query]);

  function formatDate(iso?: string) {
    if (!iso) return "-";
    return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  }

  // Delete
async function deleteComment(id: number) {
  if (!confirm("Are you sure you want to delete this comment?")) return;
  try {
    const res = await fetch(
      `https://api.wedmacindia.com/api/artist-comments/admin/delete-comment/${id}/`,
      { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    setComments((prev) => prev.filter((c) => c.id !== id));
    alert("Comment deleted successfully!"); // Success message
  } catch {
    alert("Failed to delete comment");
  }
}

  // Open edit dialog
  function openEdit(comment: Comment) {
    setEditingComment(comment);
    setEditForm({
      name: comment.name,
      phone_number: comment.phone_number,
      location: comment.location,
      comment: comment.comment,
      rating: comment.rating,
    });
    setEditDialogOpen(true);
  }

  // Submit update
 async function submitEdit() {
  if (!editingComment) return;
  try {
    const res = await fetch(
      `https://api.wedmacindia.com/api/artist-comments/admin/update-comment/${editingComment.id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const updated = await res.json();
    setComments((prev) =>
      prev.map((c) => (c.id === editingComment.id ? { ...c, ...editForm } : c))
    );
    setEditDialogOpen(false);
    alert("Comment updated successfully!"); // Success message
  } catch {
    alert("Failed to update comment");
  }
}

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Artist Comments Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Comments</p>
              <p className="text-2xl font-bold">{comments.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Artists</p>
              <p className="text-2xl font-bold">{artists.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Comments</CardTitle>
          <div className="flex gap-2 items-center">
            <select
              className="border px-2 py-1 rounded"
              value={selectedArtist ?? ""}
              onChange={(e) => setSelectedArtist(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">All Artists</option>
              {artists.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.first_name} {a.last_name}
                </option>
              ))}
            </select>

            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search name / phone / comment..."
                className="pl-8 w-64"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">Error: {error}</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No comments found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Artist</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => (
                    <TableRow key={c.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>{c.artist_name}</TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.phone_number}</TableCell>
                      <TableCell>
             <div className="relative group flex items-center gap-1">
  <span className="truncate max-w-[28ch]">{c.comment}</span>
  <Info className="h-4 w-4 text-gray-400" />
  <div className="absolute top-full mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1 z-10 w-max max-w-xs">
    {c.comment}
  </div>
</div>
</TableCell>

                      <TableCell>
                        <Badge variant="secondary">{c.rating}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(c.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEdit(c)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteComment(c.id)}>
                              Delete
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
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Input
              placeholder="Name"
              value={editForm.name}
              onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))}
            />
            <Input
              placeholder="Phone Number"
              value={editForm.phone_number}
              onChange={(e) => setEditForm((s) => ({ ...s, phone_number: e.target.value }))}
            />
            <Input
              placeholder="Location"
              value={editForm.location}
              onChange={(e) => setEditForm((s) => ({ ...s, location: e.target.value }))}
            />
            <Input
              placeholder="Comment"
              value={editForm.comment}
              onChange={(e) => setEditForm((s) => ({ ...s, comment: e.target.value }))}
            />
            <Input
              type="number"
              min={1}
              max={5}
              placeholder="Rating"
              value={editForm.rating}
              onChange={(e) => setEditForm((s) => ({ ...s, rating: Number(e.target.value) }))}
            />
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
