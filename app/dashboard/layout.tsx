import { Sidebar } from "@/components/sidebar";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen bg-[var(--bg-main)] overflow-hidden">
      <Sidebar role={session?.user?.rol} sucursal={session?.user?.sucursal} />
      <div className="flex-1 overflow-y-auto flex flex-col">
        <main className="flex-1 p-[32px] flex flex-col gap-[24px]">
          {children}
        </main>
      </div>
    </div>
  );
}
