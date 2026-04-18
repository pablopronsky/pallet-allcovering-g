"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  ShoppingCart, 
  MinusCircle, 
  History, 
  Users, 
  Download 
} from "lucide-react";

export function Sidebar({ role, sucursal }: { role?: string, sucursal?: string | null }) {
  const isAdmin = role === "ADMIN";
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    const baseClasses = "flex items-center gap-[12px] px-[24px] py-[10px] text-[14px] font-[500] cursor-pointer border-l-[3px] border-transparent transition-colors duration-[120ms] ease-out";
    
    return isActive 
      ? `${baseClasses} bg-[rgba(0,103,48,0.12)] text-[var(--np-fg-strong)] border-l-[var(--np-green-soft)]`
      : `${baseClasses} text-[var(--np-fg)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--np-fg-strong)]`;
  };

  const iconClasses = "w-[20px] h-[20px] flex-shrink-0 stroke-[1.6]";

  return (
    <aside className="w-[240px] bg-[#101215] border-r border-[rgba(255,255,255,0.06)] flex flex-col py-[24px]">
      <div className="px-[24px] pb-[24px] border-b border-[rgba(255,255,255,0.05)] mb-[16px]">
        {/* We can use a bold text fallback if image isn't available right away */}
        <div className="text-[22px] font-black tracking-tighter text-[var(--np-fg-strong)] flex items-center gap-[4px] leading-tight">
          nuevo <span className="text-[var(--np-green)] tracking-tight">parket</span>
        </div>
        <div className="text-[10px] tracking-[0.14em] uppercase text-[var(--np-fg-faint)] mt-[6px]">
          Consignación
        </div>
      </div>

      <div className="px-[24px] pt-[18px] pb-[6px] text-[10px] tracking-[0.18em] uppercase text-[var(--np-fg-faint)]">
        Menú
      </div>

      <nav className="flex-1">
        <div className="flex flex-col">
          <Link href="/dashboard" className={getLinkClasses("/dashboard")}>
            <LayoutDashboard className={iconClasses} /> Dashboard
          </Link>
          <Link href="/dashboard/stock" className={getLinkClasses("/dashboard/stock")}>
            <Package className={iconClasses} /> Stock {isAdmin ? "actual" : "sucursal"}
          </Link>
          
          {isAdmin && (
            <Link href="/dashboard/ingresos" className={getLinkClasses("/dashboard/ingresos")}>
              <Truck className={iconClasses} /> Ingresos
            </Link>
          )}

          <Link href="/dashboard/ventas" className={getLinkClasses("/dashboard/ventas")}>
            <ShoppingCart className={iconClasses} /> Ventas
          </Link>

          {isAdmin && (
            <Link href="/dashboard/bajas" className={getLinkClasses("/dashboard/bajas")}>
              <MinusCircle className={iconClasses} /> Bajas
            </Link>
          )}

          <Link href="/dashboard/historial" className={getLinkClasses("/dashboard/historial")}>
            <History className={iconClasses} /> Historial
          </Link>

          {isAdmin && (
            <>
              <Link href="/dashboard/usuarios" className={getLinkClasses("/dashboard/usuarios")}>
                <Users className={iconClasses} /> Usuarios
              </Link>
              <Link href="/dashboard/exportar" className={getLinkClasses("/dashboard/exportar")}>
                <Download className={iconClasses} /> Exportar
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="mt-auto px-[24px] pt-[16px] border-t border-[rgba(255,255,255,0.05)] text-[11px] text-[var(--np-fg-faint)]">
        <div>Nuevo Parket · v0.1</div>
        <div className="mt-[4px] text-[var(--np-fg-faint)]">Proveedor: All Covering SRL</div>
      </div>
    </aside>
  );
}
