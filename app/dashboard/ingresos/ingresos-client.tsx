"use client";

import { useState } from "react";
import { Download, Plus } from "lucide-react";
import { IngresoModal } from "./ingreso-modal";

type Producto = { id: string; nombre: string; };

export function IngresosClient({ productos, ultimosIngresos }: { productos: Producto[], ultimosIngresos: any[] }) {
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
          <div className="np-eyebrow mb-[8px]">Mercadería</div>
          <h1 className="np-display text-[40px] m-0">Ingresos de All Covering</h1>
          <p className="text-[14px] text-[var(--np-fg-muted)] mt-[6px] m-0">
            Mercadería recibida en consignación a precio costo. Genera la deuda contra venta.
          </p>
        </div>
        <div className="flex gap-[10px] flex-wrap">
          <button className="np-btn np-btn--ghost">
            <Download className="w-[14px] h-[14px]" /> Excel
          </button>
          <button className="np-btn np-btn--primary" onClick={() => setModalOpen(true)}>
            <Plus className="w-[14px] h-[14px]" /> Nuevo ingreso
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
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)] text-right">Cajas</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)] text-right">Costo / caja</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)] text-right">Total Costo</th>
            </tr>
          </thead>
          <tbody>
            {ultimosIngresos.map(ing => (
              <tr key={ing.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                <td className="py-[12px] px-[16px] text-white">
                  {new Date(ing.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="py-[12px] px-[16px] text-[var(--np-fg-strong)] font-[500]">
                  {ing.producto.nombre}
                </td>
                <td className="py-[12px] px-[16px]">
                  {getSucursalChip(ing.sucursal)}
                </td>
                <td className="py-[12px] px-[16px] text-[var(--np-fg)] text-right font-[var(--font-mono)]">{ing.cantidadCajas}</td>
                <td className="py-[12px] px-[16px] text-[var(--np-fg)] text-right font-[var(--font-mono)]">
                  $ {ing.precioCostoPorCaja.toLocaleString('es-AR', { minimumFractionDigits: 0 })}
                </td>
                <td className="py-[12px] px-[16px] text-[var(--np-fg-strong)] font-[500] text-right font-[var(--font-mono)]">
                  $ {(ing.cantidadCajas * ing.precioCostoPorCaja).toLocaleString('es-AR', { minimumFractionDigits: 0 })}
                </td>
              </tr>
            ))}
            {ultimosIngresos.length === 0 && (
              <tr>
                <td colSpan={6} className="p-[48px] text-center text-[var(--np-fg-muted)] text-[14px]">
                  No hay ingresos registrados aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <IngresoModal open={modalOpen} onClose={() => setModalOpen(false)} productos={productos} />
    </>
  );
}
