import { redirect } from "next/navigation";

export default async function MessagesLayoutRedirect({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/support`);
}
