import { redirect } from "next/navigation";

export default function AdminSocialRedirectPage() {
  redirect("/admin/settings");
}
