export const metadata = {
  title: "Admin | D-GITALCODE",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-brand-dark">{children}</div>;
}
