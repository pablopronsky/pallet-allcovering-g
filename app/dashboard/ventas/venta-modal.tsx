"use client";

import { useTransition, useState } from "react";
import { createVentaAction } from "@/server/ventas.actions";
import { AlertCircle } from "lucide-react";
import { ProductoConStock } from "./ventas-client";

export function VentaModal({ open, onClose, productos, userRole, userSucursal }: { 
  open: boolean; 
  onClose: () => void; 
  productos: ProductoConStock[];
  userRole: string;
  userSucursal?: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [productoId, setProductoId] = useState(productos[0]?.id || "");
  const [ingresoId, setIngresoId] = useState("");
  const [cajas, setCajas] = useState(1);
  const [precioVenta, setPrecioVenta] = useState(15000);

  if (!open) return null;

  // Filtrado de producto 
  const productoElegido = productos.find(p => p.id === productoId);
  const lotesDisponibles = productoElegido?.lotes || [];
  
  // Determinamos el lote activo
  const loteActivo = lotesDisponibles.find(l => l.ingresoId === ingresoId) || lotesDisponibles[0];
  const maxCajas = loteActivo?.disponible || 0;

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createVentaAction(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        onClose();
      }
    });
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[rgba(5,6,8,0.75)] backdrop-blur-[4px] flex items-center justify-center animate-[fadeIn_160ms_ease-out]" onClick={onClose}>
      <div className="bg-[var(--np-charcoal)] border border-[rgba(255,255,255,0.08)] rounded-[3px] w-[min(560px,92vw)] max-h-[90vh] overflow-y-auto animate-[slideUp_200ms_ease-out]" onClick={e => e.stopPropagation()}>
        
        <div className="p-[22px_28px] border-b border-[rgba(255,255,255,0.06)] flex justify-between items-center">
          <h3 className="text-[18px] font-[500] m-0 text-white">Registrar venta</h3>
          <button className="bg-transparent border-0 text-[var(--np-fg-muted)] text-[22px] cursor-pointer leading-[1] hover:text-white" onClick={onClose}>
            ×
          </button>
        </div>

        <form action={handleSubmit}>
          <div className="p-[24px_28px]">
            {error && (
              <div className="bg-red-500/10 text-red-500 p-[12px] rounded-[4px] flex items-center gap-[8px] text-[13px] font-[500] border border-red-500/20 mb-[16px]">
                <AlertCircle className="w-[16px] h-[16px]" />
                {error}
              </div>
            )}

            <div className="flex flex-col gap-[16px]">
              
              <div className="flex flex-col gap-[6px]">
                <label className="np-eyebrow">Modelo</label>
                <div className="text-[11px] text-[var(--np-fg-faint)] mt-[-4px]">
                  Sucursal: {userRole === "ADMIN" ? "Todas" : userSucursal} · Se validará stock vivo.
                </div>
                <select 
                  name="productoId" 
                  value={productoId}
                  onChange={(e) => {
                    setProductoId(e.target.value);
                    setIngresoId("");
                    setCajas(1);
                  }}
                  required
                  className="np-form-input"
                >
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              {lotesDisponibles.length > 0 ? (
                <>
                  <div className="flex flex-col gap-[6px]">
                    <label className="np-eyebrow">Lote disponible (Ingreso de origen)</label>
                    <select 
                      name="ingresoId" 
                      value={ingresoId || loteActivo?.ingresoId || ""}
                      onChange={(e) => {
                        setIngresoId(e.target.value);
                        setCajas(1);
                      }}
                      required
                      className="np-form-input"
                    >
                      {lotesDisponibles.map(l => (
                        <option key={l.ingresoId} value={l.ingresoId}>
                          {l.sucursal} — Quedan {l.disponible} cajas (Ingresado: {new Date(l.fecha).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  {userRole === "ADMIN" && (
                    <input type="hidden" name="sucursal" value={loteActivo?.sucursal || ""} />
                  )}

                  <div className="grid grid-cols-2 gap-[16px]">
                    <div className="flex flex-col gap-[6px]">
                      <label className="np-eyebrow">Cantidad de cajas</label>
                      <input 
                        type="number" 
                        name="cantidadCajas" 
                        min="1" 
                        max={maxCajas}
                        required
                        value={cajas}
                        onChange={(e) => setCajas(Number(e.target.value))}
                        className="np-form-input"
                      />
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <label className="np-eyebrow">Precio venta / Caja</label>
                      <input 
                        type="number" 
                        name="precioVentaPorCaja" 
                        min="0"
                        step="0.01" 
                        required
                        value={precioVenta}
                        onChange={(e) => setPrecioVenta(Number(e.target.value))}
                        className="np-form-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-[8px] p-[12px_14px] bg-[rgba(239,127,26,0.06)] border border-[rgba(239,127,26,0.2)] rounded-[2px] text-[13px] text-[var(--np-fg)] mt-[8px]">
                    <span>Total venta:</span>
                    <strong className="text-[var(--np-fg-strong)] text-right">
                      $ {(cajas * precioVenta).toLocaleString('es-AR', { minimumFractionDigits: 0 })}
                    </strong>
                    {userRole === "ADMIN" && (
                      <>
                        <span className="text-white">Estimación:</span>
                        <span className="text-[var(--np-fg-strong)] text-right font-[500]">
                          (No se ve el costo aquí por privacidad, calculalo manualmente)
                        </span>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-[13px] text-red-400 bg-red-400/10 p-[12px] border border-red-400/20 rounded-[4px]">
                  No hay stock disponible de este producto en los lugares que tenés acceso.
                </div>
              )}

            </div>
          </div>

          <div className="p-[16px_28px] border-t border-[rgba(255,255,255,0.06)] flex justify-end gap-[10px]">
            <button type="button" className="np-btn np-btn--ghost" onClick={onClose} disabled={isPending}>
              Cancelar
            </button>
            <button type="submit" className="np-btn np-btn--primary" disabled={isPending || lotesDisponibles.length === 0}>
              {isPending ? "Procesando..." : "Registrar venta"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
