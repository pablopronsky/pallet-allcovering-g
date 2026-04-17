"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { formActionSignOut } from "@/server/auth.actions";
import { LogOut, Home, Package, Box, TrendingDown, Users } from "lucide-react";

export function Sidebar({ role, sucursal }: { role?: string, sucursal?: string | null }) {
  const isAdmin = role === "ADMIN";
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    const baseClasses = "px-[24px] py-[10px] text-[0.9rem] font-medium flex items-center gap-[12px] cursor-pointer";
    return isActive 
      ? `${baseClasses} text-[var(--accent)] bg-[#eff6ff] border-r-[3px] border-[var(--accent)]`
      : `${baseClasses} text-[var(--text-muted)] hover:bg-gray-50`;
  };

  return (
    <aside className="w-[240px] bg-[var(--sidebar-bg)] border-r border-[var(--border)] flex flex-col py-[24px]">
      <div className="px-[24px] pb-[32px] font-[800] text-[1.25rem] tracking-[-0.025em] text-[var(--accent)] flex flex-col items-start gap-1">
        <div>NUEVO PARKET</div>
        <div className="text-xs font-normal tracking-normal text-[var(--text-muted)]">
          {isAdmin ? "Administrador General" : `Sucursal: ${sucursal}`}
        </div>
      </div>

      <nav className="flex-1">
        <ul className="list-none flex flex-col">
          <li>
            <Link href="/dashboard" className={getLinkClasses("/dashboard")}>
              <Home className="w-[18px] h-[18px]" /> Panel de Control
            </Link>
          </li>
          <li>
            <Link href="/dashboard/ventas" className={getLinkClasses("/dashboard/ventas")}>
              <Package className="w-[18px] h-[18px]" /> Registro de Ventas
            </Link>
          </li>

          {isAdmin && (
            <>
              <li>
                <Link href="/dashboard/ingresos" className={getLinkClasses("/dashboard/ingresos")}>
                  <Box className="w-[18px] h-[18px]" /> Ingresos de Stock
                </Link>
              </li>
              <li>
                <Link href="/dashboard/bajas" className={getLinkClasses("/dashboard/bajas")}>
                  <TrendingDown className="w-[18px] h-[18px]" /> Bajas Administrativas
                </Link>
              </li>
              <li>
                <Link href="/dashboard/usuarios" className={getLinkClasses("/dashboard/usuarios")}>
                  <Users className="w-[18px] h-[18px]" /> Usuarios y Roles
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="mt-auto">
        <form action={formActionSignOut}>
          <button type="submit" className="w-full text-left px-[24px] py-[10px] text-[0.9rem] font-medium text-red-600 flex items-center gap-[12px] hover:bg-red-50">
            <LogOut className="w-[18px] h-[18px]" /> Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
