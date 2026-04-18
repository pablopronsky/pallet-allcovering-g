import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen bg-[var(--np-ink)] overflow-hidden">
      <Sidebar role={session?.user?.rol} sucursal={session?.user?.sucursal} />
      
      <div className="flex-1 overflow-y-auto flex flex-col bg-[var(--np-ink)] relative">
        <Topbar user={session?.user} />
        
        <main className="flex-1 p-[32px_40px_64px] max-w-[1400px] w-full mx-auto flex flex-col gap-[24px]">
          {children}
        </main>
      </div>
    </div>
  );
}
