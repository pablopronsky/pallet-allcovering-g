"use client";

import { useState } from "react";

type StockRow = {
  id: string;
  productoId: string;
  producto: string;
  sucursal: string;
  ingresadas: number;
  vendidas: number;
  dadas: number;
  disponibles: number;
};

export function StockTable({ initialData, isAdmin, userSucursal }: { initialData: StockRow[], isAdmin: boolean, userSucursal?: string | null }) {
  const [sucursalFilter, setSucursalFilter] = useState<string>(isAdmin ? "Todas" : userSucursal || "Todas");

  const rows = initialData.filter(r => sucursalFilter === "Todas" || r.sucursal === sucursalFilter);

  const getSucursalChip = (suc: string) => {
    const mod = suc === 'La Plata' ? 'laplata' : suc === 'Gonnet' ? 'gonnet' : 'quilmes';
    return (
      <span className={`inline-flex items-center gap-[5px] text-[11px] px-[8px] py-[2px] rounded-[2px] bg-[rgba(255,255,255,0.06)] text-[var(--np-fg)] tracking-[0.04em] relative before:content-[''] before:w-[5px] before:h-[5px] before:rounded-full before:bg-current
        ${mod === 'laplata' ? 'text-[#ffad5c]' : mod === 'gonnet' ? 'text-[#7aa6ff]' : 'text-[var(--np-green-soft)]'}
      `}>
        {suc}
      </span>
    );
  };

  return (
    <>
      {isAdmin && (
        <div className="flex gap-[10px] items-center flex-wrap p-[14px_16px] bg-[var(--np-charcoal-2)] border border-[rgba(255,255,255,0.05)] rounded-[2px] mb-[20px]">
          <span className="text-[11px] tracking-[0.14em] uppercase text-[var(--np-fg-muted)] mr-[4px]">Sucursal</span>
          <select 
            className="np-form-input text-[13px] py-[6px] px-[10px]"
            value={sucursalFilter} 
            onChange={(e) => setSucursalFilter(e.target.value)}
          >
            <option>Todas</option>
            <option>Quilmes</option>
            <option>La Plata</option>
            <option>Gonnet</option>
          </select>
        </div>
      )}

      <div className="rounded-[2px] bg-[var(--np-charcoal-2)] border border-[rgba(255,255,255,0.05)] p-0 overflow-hidden">
        <table className="np-table w-full text-left">
          <thead className="bg-[#24272b]">
            <tr>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)]">Modelo</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)]">Sucursal</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)] text-right">Ingresadas</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)] text-right">Vendidas</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)] text-right">Bajas</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)] text-right">Disponibles</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-[48px] text-center text-[var(--np-fg-muted)] text-[14px]">
                  Sin movimientos en esta sucursal.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                <td className="py-[12px] px-[16px] text-[var(--np-fg-strong)] font-[500]">{row.producto}</td>
                <td className="py-[12px] px-[16px]">{getSucursalChip(row.sucursal)}</td>
                <td className="py-[12px] px-[16px] text-[var(--np-fg)] text-right font-[var(--font-mono)]">{row.ingresadas}</td>
                <td className="py-[12px] px-[16px] text-[var(--np-fg)] text-right font-[var(--font-mono)]">{row.vendidas}</td>
                <td className="py-[12px] px-[16px] text-[var(--np-fg)] text-right font-[var(--font-mono)]">{row.dadas}</td>
                <td className="py-[12px] px-[16px] text-right font-[var(--font-mono)] text-[14px]">
                  <span className={`inline-flex items-center gap-[4px] font-[500] ${row.disponibles < 10 ? 'text-[#ff8080]' : 'text-[var(--np-fg-strong)]'}`}>
                    {row.disponibles}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
