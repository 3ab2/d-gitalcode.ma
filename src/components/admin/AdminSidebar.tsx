"use client";

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
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { getLogoutPath } from "@/lib/auth-urls";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/portfolio", label: "Portfolio", icon: FolderOpen },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/submissions", label: "Submissions", icon: MessageSquare },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/social", label: "Social Media", icon: Share2 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/10 bg-brand-card flex flex-col">
      <div className="flex items-center gap-3 p-6 border-b border-white/10">
        <Logo size="sm" />
        <span className="text-sm font-bold text-brand-green tracking-wider">ADMIN</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
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
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors",
                isActive
                  ? "bg-brand-green/10 text-brand-green"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: getLogoutPath() })}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-red-400 hover:bg-red-400/5 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
