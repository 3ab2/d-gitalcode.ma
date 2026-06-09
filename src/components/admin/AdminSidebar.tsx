"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  FolderOpen,
  MessageSquare,
  Inbox,
  Share2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutToLogin } from "@/lib/auth-client";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/portfolio", label: "Portfolio", icon: FolderOpen },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/submissions", label: "Submissions", icon: MessageSquare },
  { href: "/admin/messages", label: "Support", icon: Inbox },
  { href: "/admin/social", label: "Social Media", icon: Share2 },
];

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
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
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <button
          type="button"
          onClick={() => logoutToLogin()}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white/60 hover:bg-red-400/5 hover:text-red-400"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
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
          <button
            type="button"
            onClick={closeMobile}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/5 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <SidebarNav pathname={pathname} onNavigate={closeMobile} />

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
