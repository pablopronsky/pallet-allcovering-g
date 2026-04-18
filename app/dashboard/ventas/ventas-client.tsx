"use client";

import { useState } from "react";
import { Download, Plus } from "lucide-react";
import { VentaModal } from "./venta-modal";

export type ProductoConStock = {
  id: string;
  nombre: string;
  lotes: {
    ingresoId: string;
    fecha: Date;
    sucursal: string;
    disponible: number;
  }[];
};

export function VentasClient({
  productos,
  ultimasVentas,
  userRole,
  userSucursal,
}: {
  productos: ProductoConStock[];
  ultimasVentas: any[];
  userRole: string;
  userSucursal?: string | null;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const getSucursalChip = (suc: string) => {
    const mod = suc === 'LA_PLATA' ? 'laplata' : suc === 'GONNET' ? 'gonnet' : 'quilmes';
    const label = suc === 'LA_PLATA' ? 'La Plata' : suc === 'GONNET' ? 'Gonnet' : 'Quilmes';
    return (
      <span className={`inline-flex items-center gap-[5px] text-[11px] px-[8px] py-[2px] rounded-[2px] bg-[rgba(255,255,255,0.06)] text-[var(--np-fg)] tracking-[0.04em] relative before:content-[''] before:w-[5px] before:h-[5px] before:rounded-full before:bg-current
        ${mod === 'laplata' ? 'text-[#ffad5c]' : mod === 'gonnet' ? 'text-[#7aa6ff]' : 'text-[var(--np-green-soft)]'}
      `}>
        {label}
      </span>
    );
  };

  return (
    <>
      <div className="flex items-end justify-between mb-[28px] gap-[24px]">
        <div>
          <div className="np-eyebrow mb-[8px]">Movimientos</div>
          <h1 className="np-display text-[40px] m-0">Ventas</h1>
          <p className="text-[14px] text-[var(--np-fg-muted)] mt-[6px] m-0">
            {userRole === "ADMIN" ? "Todas las ventas de las tres sucursales." : `Ventas registradas en ${userSucursal}.`}
          </p>
        </div>
        <div className="flex gap-[10px] flex-wrap">
          <button className="np-btn np-btn--ghost">
            <Download className="w-[14px] h-[14px]" /> Excel
          </button>
          <button className="np-btn np-btn--primary bg-[var(--np-green)]" onClick={() => setModalOpen(true)}>
            <Plus className="w-[14px] h-[14px]" /> Registrar venta
          </button>
        </div>
      </div>

      <div className="rounded-[2px] bg-[var(--np-charcoal-2)] border border-[rgba(255,255,255,0.05)] p-0 overflow-hidden">
        <table className="np-table w-full text-left">
          <thead className="bg-[#24272b]">
            <tr>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)]">Fecha</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)]">Modelo</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)]">Sucursal</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)]">Vendedor</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)] text-right">Cajas</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)] text-right">Precio venta</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)] text-right">Total</th>
              {userRole === "ADMIN" && (
                <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)] text-right">Utilidad</th>
              )}
            </tr>
          </thead>
          <tbody>
            {ultimasVentas.length === 0 && (
              <tr>
                <td colSpan={8} className="p-[48px] text-center text-[var(--np-fg-muted)] text-[14px]">
                  Caja en blanco. Aún no se han registrado ventas {userRole !== "ADMIN" && "en esta sucursal."}
                </td>
              </tr>
            )}
            {ultimasVentas.map((venta) => {
              const util = venta.cantidadCajas * (venta.precioVentaPorCaja - venta.ingreso.precioCostoPorCaja);
              return (
                <tr key={venta.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-[12px] px-[16px] text-white">
                    {new Date(venta.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-[12px] px-[16px] text-[var(--np-fg-strong)] font-[500]">{venta.producto.nombre}</td>
                  <td className="py-[12px] px-[16px]">{getSucursalChip(venta.sucursal)}</td>
                  <td className="py-[12px] px-[16px] text-[var(--np-fg-muted)]">{venta.user.nombre.split(" ")[0]}</td>
                  <td className="py-[12px] px-[16px] text-[var(--np-fg)] text-right font-[var(--font-mono)]">{venta.cantidadCajas}</td>
                  <td className="py-[12px] px-[16px] text-[var(--np-fg)] text-right font-[var(--font-mono)]">
                    $ {venta.precioVentaPorCaja.toLocaleString('es-AR', { minimumFractionDigits: 0 })}
                  </td>
                  <td className="py-[12px] px-[16px] text-[var(--np-fg-strong)] font-[500] text-right font-[var(--font-mono)]">
                    $ {(venta.cantidadCajas * venta.precioVentaPorCaja).toLocaleString('es-AR', { minimumFractionDigits: 0 })}
                  </td>
                  {userRole === "ADMIN" && (
                    <td className="py-[12px] px-[16px] text-[var(--np-orange)] text-right font-[var(--font-mono)]">
                      $ {util.toLocaleString('es-AR', { minimumFractionDigits: 0 })}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <VentaModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        productos={productos}
        userRole={userRole}
        userSucursal={userSucursal}
      />
    </>
  );
}
