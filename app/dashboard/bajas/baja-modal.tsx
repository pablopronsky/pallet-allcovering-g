"use client";

import { useTransition, useState } from "react";
import { createBajaAction } from "@/server/bajas.actions";
import { AlertCircle } from "lucide-react";

type Producto = {
  id: string;
  nombre: string;
  stockPorSucursal: {
    QUILMES: number;
    LA_PLATA: number;
    GONNET: number;
  };
};

export function BajaModal({ open, onClose, productos }: { open: boolean; onClose: () => void; productos: Producto[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [productoId, setProductoId] = useState(productos[0]?.id || "");
  const [sucursal, setSucursal] = useState<"QUILMES" | "LA_PLATA" | "GONNET">("QUILMES");
  const [cajas, setCajas] = useState(1);

  if (!open) return null;

  const productoElegido = productos.find(p => p.id === productoId);
  const maxCajas = productoElegido?.stockPorSucursal[sucursal] || 0;

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createBajaAction(formData);
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
          <h3 className="text-[18px] font-[500] m-0 text-white">Registrar baja de mercadería</h3>
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
                <select 
                  name="productoId" 
                  value={productoId}
                  onChange={(e) => {
                    setProductoId(e.target.value);
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

              <div className="grid grid-cols-2 gap-[16px]">
                <div className="flex flex-col gap-[6px]">
                  <label className="np-eyebrow">Sucursal origen</label>
                  <select 
                    name="sucursal" 
                    value={sucursal}
                    onChange={(e: any) => {
                      setSucursal(e.target.value);
                      setCajas(1);
                    }}
                    required
                    className="np-form-input"
                  >
                    <option value="QUILMES">Quilmes</option>
                    <option value="LA_PLATA">La Plata</option>
                    <option value="GONNET">Gonnet</option>
                  </select>
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label className="np-eyebrow">Cantidad de cajas</label>
                  <span className="text-[10px] text-[var(--np-fg-faint)] mt-[-4px]">
                    Máximo disp: {maxCajas}
                  </span>
                  <input 
                    type="number" 
                    name="cantidadCajas" 
                    min="1" 
                    max={maxCajas || 1}
                    required
                    value={cajas}
                    onChange={(e) => setCajas(Number(e.target.value))}
                    className="np-form-input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="np-eyebrow">Motivo de la baja</label>
                <select name="motivo" required className="np-form-input">
                  <option value="ROTURA">Rotura</option>
                  <option value="MUESTRA">Muestra para showroom</option>
                  <option value="VENCIMIENTO">Vencimiento / Descarte</option>
                  <option value="DONACION">Donación</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="np-eyebrow">Notas adicionales</label>
                <textarea 
                  name="notas" 
                  rows={2} 
                  placeholder="Explicá brevemente por qué se retiran estas cajas..."
                  className="np-form-input py-[10px] h-auto resize-y"
                />
              </div>

            </div>
          </div>

          <div className="p-[16px_28px] border-t border-[rgba(255,255,255,0.06)] flex justify-end gap-[10px]">
            <button type="button" className="np-btn np-btn--ghost" onClick={onClose} disabled={isPending}>
              Cancelar
            </button>
            <button type="submit" className="np-btn np-btn--primary bg-[#ff5252]" disabled={isPending || maxCajas < 1}>
              {isPending ? "Registrando..." : "Aprobar baja"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
