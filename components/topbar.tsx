"use client";

import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { formActionSignOut } from "@/server/auth.actions";

export function Topbar({ user }: { user: any }) {
  const pathname = usePathname();

  // Create a simple map for breadcrumbs based on pathname
  const pathMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/stock': 'Stock actual',
    '/dashboard/ingresos': 'Ingresos',
    '/dashboard/ventas': 'Ventas',
    '/dashboard/bajas': 'Bajas',
    '/dashboard/historial': 'Historial',
    '/dashboard/usuarios': 'Usuarios',
    '/dashboard/exportar': 'Exportar',
  };

  const crumb = pathMap[pathname] || 'Dashboard';
  const isAdmin = user.rol === "ADMIN";

  const initials = user?.name ? user.name.split(" ").map((n: string) => n[0]).join("") : "U";

  return (
    <header className="flex items-center justify-between px-[32px] h-[64px] bg-[#14161a] border-b border-[rgba(255,255,255,0.06)] sticky top-0 z-10">
      <div className="flex items-center gap-[10px] text-[13px] text-[var(--np-fg-muted)]">
        <span>Control de Consignación</span>
        <span className="opacity-40">/</span>
        <strong className="text-[var(--np-fg-strong)] font-[500]">{crumb}</strong>
      </div>

      <div className="flex items-center gap-[16px]">
        {/* User Chip */}
        <div className="flex items-center gap-[10px] py-[6px] pl-[6px] pr-[12px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] rounded-full cursor-pointer">
          <div className="w-[30px] h-[30px] rounded-full bg-[var(--np-green)] text-white flex items-center justify-center font-[600] text-[11px] tracking-[0.05em]">
            {initials}
          </div>
          <div>
            <div className="text-[13px] font-[500] text-[var(--np-fg-strong)] leading-tight">{user.name}</div>
            <div className="text-[11px] text-[var(--np-fg-muted)] leading-tight">
              {isAdmin ? "Administrador" : `Vendedor · ${user.sucursal}`}
            </div>
          </div>
        </div>

        {/* Logout Form */}
        <form action={formActionSignOut}>
          <button type="submit" className="np-btn np-btn--ghost np-btn--sm">
            <LogOut className="w-[14px] h-[14px]" />
            Salir
          </button>
        </form>
      </div>
    </header>
  );
}
