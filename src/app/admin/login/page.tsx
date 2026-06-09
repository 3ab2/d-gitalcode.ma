import { redirect } from "next/navigation";
import { getLoginPath } from "@/lib/auth-urls";

export default function AdminLoginRedirect() {
  redirect(getLoginPath());
}
