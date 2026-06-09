import { redirect } from "next/navigation";

export default async function MessagesRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/support`);
}
