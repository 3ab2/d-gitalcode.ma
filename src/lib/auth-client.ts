"use client";

import { signOut } from "next-auth/react";
import { getLogoutPath } from "@/lib/auth-urls";

/** Sign out and navigate to the admin login page on the current origin. */
export async function logoutToLogin() {
  await signOut({ redirect: false });
  window.location.assign(getLogoutPath());
}
