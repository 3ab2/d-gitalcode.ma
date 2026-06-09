import { redirect } from "next/navigation";

export default function AdminMessageDetailRedirect() {
  redirect("/admin/messages");
}
