import { redirect } from "next/navigation";

export default async function NewMessageRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/support`);
}
