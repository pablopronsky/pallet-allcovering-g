"use client";

import { useTransition, useRef, useState } from "react";
import { createIngresoAction } from "@/server/ingresos.actions";
import { AlertCircle, CheckCircle2 } from "lucide-react";

type Producto = {
  id: string;
  nombre: string;
};

export function IngresoModal({ open, onClose, productos }: { open: boolean; onClose: () => void; productos: Producto[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const [cajas, setCajas] = useState(50);
  const [costo, setCosto] = useState(10000);

  if (!open) return null;

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createIngresoAction(formData);
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
          <h3 className="text-[18px] font-[500] m-0 text-white">Nuevo ingreso de mercadería</h3>
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
                <label htmlFor="productoId" className="np-eyebrow">Modelo</label>
                <select 
                  id="productoId" 
                  name="productoId" 
                  required
                  defaultValue={productos[0]?.id || ""}
                  className="np-form-input"
                >
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-[16px]">
                <div className="flex flex-col gap-[6px]">
                  <label htmlFor="sucursal" className="np-eyebrow">Sucursal destino</label>
                  <select 
                    id="sucursal" 
                    name="sucursal" 
                    required
                    defaultValue="QUILMES"
                    className="np-form-input"
                  >
                    <option value="QUILMES">Quilmes</option>
                    <option value="LA_PLATA">La Plata</option>
                    <option value="GONNET">Gonnet</option>
                  </select>
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label htmlFor="cantidadCajas" className="np-eyebrow">Cantidad de cajas</label>
                  <input 
                    type="number" 
                    id="cantidadCajas" 
                    name="cantidadCajas" 
                    min="1" 
                    required
                    value={cajas}
                    onChange={e => setCajas(Number(e.target.value))}
                    className="np-form-input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[6px]">
                <label htmlFor="precioCostoPorCaja" className="np-eyebrow">
                  Precio costo por caja (ARS)
                </label>
                <span className="text-[11px] text-[var(--np-fg-faint)] mt-[-4px]">
                  Este valor define la deuda con All Covering cuando se venda.
                </span>
                <input 
                  type="number" 
                  id="precioCostoPorCaja" 
                  name="precioCostoPorCaja" 
                  min="0"
                  step="0.01" 
                  required
                  value={costo}
                  onChange={e => setCosto(Number(e.target.value))}
                  className="np-form-input"
                />
              </div>

              {/* Implicit Note for DB */}
              <input type="hidden" name="notas" value="" />

              <div className="p-[12px_14px] bg-[rgba(71,184,99,0.06)] border border-[rgba(71,184,99,0.18)] rounded-[2px] text-[13px] text-[var(--np-fg)] mt-[8px]">
                Total a costo: <strong className="text-[var(--np-green-soft)] ml-[6px]">
                  $ {(cajas * costo).toLocaleString("es-AR", { minimumFractionDigits: 0 })}
                </strong>
              </div>

            </div>
          </div>

          <div className="p-[16px_28px] border-t border-[rgba(255,255,255,0.06)] flex justify-end gap-[10px]">
            <button type="button" className="np-btn np-btn--ghost" onClick={onClose} disabled={isPending}>
              Cancelar
            </button>
            <button type="submit" className="np-btn np-btn--primary" disabled={isPending}>
              {isPending ? "Registrando..." : "Registrar ingreso"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
