"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  FolderOpen,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutToLogin } from "@/lib/auth-client";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/portfolio", label: "Portfolio", icon: FolderOpen },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/submissions", label: "Leads", icon: MessageSquare, showNewBadge: true },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarNav({
  pathname,
  onNavigate,
  newLeadsCount,
}: {
  pathname: string;
  onNavigate?: () => void;
  newLeadsCount: number;
}) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto p-4">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors",
              isActive
                ? "bg-brand-green/10 text-brand-green"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="flex-1">{link.label}</span>
            {link.showNewBadge && newLeadsCount > 0 && (
              <span className="rounded-full bg-brand-green px-2 py-0.5 text-xs font-semibold text-brand-dark">
                {newLeadsCount > 99 ? "99+" : newLeadsCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/admin/submissions/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || data?.newLeads == null) return;
        setNewLeadsCount(data.newLeads);
      })
      .catch(() => {
        /* optional badge */
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-brand-card px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white/80 hover:bg-white/5"
          aria-label="Open admin menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Logo size="sm" />
        <div className="flex items-center gap-1">
          <NotificationBell localeTag="en-US" />
          <button
            type="button"
            onClick={() => logoutToLogin()}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/60 hover:bg-red-400/5 hover:text-red-400"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-white/10 bg-brand-card transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-sm font-bold tracking-wider text-brand-green">ADMIN</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="hidden lg:block">
              <NotificationBell localeTag="en-US" />
            </div>
            <button
              type="button"
              onClick={closeMobile}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/5 lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <SidebarNav pathname={pathname} onNavigate={closeMobile} newLeadsCount={newLeadsCount} />

        <div className="hidden border-t border-white/10 p-4 lg:block">
          <button
            type="button"
            onClick={() => logoutToLogin()}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition-colors hover:bg-red-400/5 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
