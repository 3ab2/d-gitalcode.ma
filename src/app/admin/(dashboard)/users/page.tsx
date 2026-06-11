"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Trash2, UserX, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "CLIENT" | "USER";
  active: boolean;
  createdAt: string;
  _count: { messages: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);
    const res = await fetch(`/api/admin/users?${params}`);
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, [search, roleFilter]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      const res = await fetch(`/api/admin/users?${params}`);
      if (cancelled) return;
      if (res.ok) setUsers(await res.json());
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [search, roleFilter]);

  const toggleActive = async (user: AdminUser) => {
    setBusyId(user.id);
    await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !user.active }),
    });
    await fetchUsers();
    setBusyId(null);
  };

  const deleteUser = async (user: AdminUser) => {
    if (!confirm(`Delete account ${user.email}? This cannot be undone.`)) return;
    setBusyId(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.error || "Failed to delete user.");
    }
    await fetchUsers();
    setBusyId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="mt-1 text-sm text-white/50">Manage client accounts and access</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="CLIENT">Client</option>
          <option value="USER">User</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-white/10 bg-white/[0.02] text-left text-white/50">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Messages</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-white">{user.name || "—"}</p>
                  <p className="text-white/45">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.role === "ADMIN" ? "purple" : "default"}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.active ? "green" : "default"}>
                    {user.active ? "Active" : "Disabled"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-white/60">{user._count.messages}</td>
                <td className="px-4 py-3 text-white/50">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {user.role !== "ADMIN" && (
                      <>
                        <button
                          type="button"
                          disabled={busyId === user.id}
                          onClick={() => toggleActive(user)}
                          className="rounded-lg border border-white/10 p-2 text-white/50 hover:text-brand-green"
                          aria-label={user.active ? "Disable user" : "Enable user"}
                        >
                          {user.active ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === user.id}
                          onClick={() => deleteUser(user)}
                          className="rounded-lg border border-white/10 p-2 text-white/50 hover:text-red-400"
                          aria-label="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="py-12 text-center text-sm text-white/40">No users found</p>
        )}
      </div>
    </div>
  );
}
