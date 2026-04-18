import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Download } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const isAdmin = session?.user?.rol === "ADMIN";
  const userSucursal = session?.user?.sucursal;
  const userName = session?.user?.name || "Administrador";
  const firstName = userName.split(" ")[0];

  // 1. Fetch real products with relations depending on role
  const productos = await prisma.producto.findMany({
    include: {
      ingresos: true,
      ventas: isAdmin ? true : { where: { sucursal: userSucursal as any } },
      bajas: true,
    },
  });

  // 2. Compute the exact KPIs needed for the design
  let stockGlobalCajas = 0;
  let deudaConAllCovering = 0;
  let facturacionTotal = 0;
  let cajasVendidasRendidas = 0;

  productos.forEach(p => {
    // Ingresos
    const ingresosRelevantes = isAdmin ? p.ingresos : p.ingresos.filter(i => i.sucursal === userSucursal);
    const cajasIngresadas = ingresosRelevantes.reduce((sum, i) => sum + i.cantidadCajas, 0);
    
    // Bajas
    const bajasRelevantes = isAdmin ? p.bajas : p.bajas.filter(b => b.sucursal === userSucursal);
    const cajasBajas = bajasRelevantes.reduce((sum, b) => sum + b.cantidadCajas, 0);

    // Ventas
    const cajasVendidas = p.ventas.reduce((sum, v) => sum + v.cantidadCajas, 0);
    stockGlobalCajas += (cajasIngresadas - cajasVendidas - cajasBajas);

    // Calculate Debt & Utility based on sales. 
    // We need to trace back each sale to its origin "ingreso" to know the precise cost.
    // In our DB model we have a relation or we approximate using average cost if not strictly linked.
    p.ventas.forEach(v => {
      // Find the specific ingreso to get the exact cost
      const ingreso = p.ingresos.find(i => i.id === v.ingresoId);
      const costo = ingreso ? ingreso.precioCostoPorCaja : 0;
      
      deudaConAllCovering += (v.cantidadCajas * costo);
      facturacionTotal += (v.cantidadCajas * v.precioVentaPorCaja);
      cajasVendidasRendidas += v.cantidadCajas;
    });
  });

  const utilidadBruta = facturacionTotal - deudaConAllCovering;

  return (
    <>
      <div className="flex items-end justify-between mb-[28px] gap-[24px]">
        <div>
          <div className="np-eyebrow mb-[8px]">Panel General</div>
          <h1 className="np-display text-[40px] m-0">Hola, {firstName}.</h1>
          <p className="text-[14px] text-[var(--np-fg-muted)] mt-[6px] m-0">
            {isAdmin ? "Estado consolidado de las tres sucursales." : `Estado de la sucursal ${userSucursal}.`}
          </p>
        </div>
        <div className="flex gap-[10px] flex-wrap">
          <button className="np-btn np-btn--ghost">
            <Download className="w-[14px] h-[14px]" /> Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
        
        {/* KPI: Deuda All Covering (Takes 2 cols) */}
        <div className="col-span-2 rounded-[2px] p-[20px_22px] flex flex-col gap-[8px] relative overflow-hidden bg-gradient-to-br from-[#0a1f12] to-[#0f2a18] border border-[rgba(71,184,99,0.2)]">
          <div className="text-[11px] tracking-[0.14em] uppercase text-[var(--np-fg-muted)] font-[500]">
            Deuda con All Covering
          </div>
          <div className="font-[var(--font-display)] font-[300] text-[56px] leading-[1] tracking-[-0.02em] text-[#e8f5ee]">
            $ {deudaConAllCovering.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[12px] text-[var(--np-fg-muted)]">
            Σ (cajas vendidas × costo) · <strong className="text-[var(--np-fg)] font-[500]">{cajasVendidasRendidas} cajas</strong> rendidas
          </div>
          {/* Sparkline decoration */}
          <div className="absolute right-[22px] bottom-[20px] opacity-60 pointer-events-none">
             <div className="w-[180px] h-[48px] border-b-[2px] border-[var(--np-green-soft)] opacity-50 relative">
               <div className="absolute right-0 top-0 w-[4px] h-[4px] bg-[var(--np-green-soft)] rounded-full animate-ping" />
             </div>
          </div>
        </div>

        {/* KPI: Utilidad Bruta */}
        <div className="rounded-[2px] p-[20px_22px] flex flex-col gap-[8px] bg-[var(--np-charcoal-2)] border border-[rgba(255,255,255,0.05)]">
          <div className="text-[11px] tracking-[0.14em] uppercase text-[var(--np-fg-muted)] font-[500]">
            Utilidad Bruta
          </div>
          <div className="font-[var(--font-display)] font-[300] text-[40px] leading-[1] tracking-[-0.02em] text-[var(--np-orange)]">
            $ {utilidadBruta.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[12px] text-[var(--np-fg-muted)]">
            Margen sobre ventas {isAdmin ? "totales" : "locales"}
          </div>
        </div>

        {/* KPI: Stock */}
        <div className="rounded-[2px] p-[20px_22px] flex flex-col gap-[8px] bg-[var(--np-charcoal-2)] border border-[rgba(255,255,255,0.05)]">
          <div className="text-[11px] tracking-[0.14em] uppercase text-[var(--np-fg-muted)] font-[500]">
            Stock Disponible
          </div>
          <div className="font-[var(--font-display)] font-[300] text-[40px] leading-[1] tracking-[-0.02em] text-[var(--np-fg-strong)]">
            {stockGlobalCajas}
          </div>
          <div className="text-[12px] text-[var(--np-fg-muted)]">
            cajas · en {isAdmin ? "3 sucursales" : userSucursal}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-[16px]">
        
        {/* Placeholder: Evolución de ventas */}
        <div className="col-span-12 md:col-span-8 rounded-[2px] p-[20px_22px] bg-[var(--np-charcoal-2)] border border-[rgba(255,255,255,0.05)] h-[300px]">
          <div className="flex justify-between items-start mb-[18px]">
            <div>
              <h3 className="text-[15px] font-[500] text-[var(--np-fg-strong)] m-0">Evolución de ventas</h3>
              <div className="text-[12px] text-[var(--np-fg-muted)] mt-[2px]">Facturación total por quincena</div>
            </div>
          </div>
          <div className="flex items-center justify-center h-[calc(100%-50px)] border border-dashed border-[rgba(255,255,255,0.1)] text-[12px] text-[var(--np-fg-faint)]">
            [Gráfico de líneas SVG]
          </div>
        </div>

        {/* Placeholder: Ventas por sucursal */}
        <div className="col-span-12 md:col-span-4 rounded-[2px] p-[20px_22px] bg-[var(--np-charcoal-2)] border border-[rgba(255,255,255,0.05)] h-[300px] flex flex-col">
          <div className="mb-[18px]">
             <h3 className="text-[15px] font-[500] text-[var(--np-fg-strong)] m-0">Ventas por sucursal</h3>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-[rgba(255,255,255,0.1)] text-[12px] text-[var(--np-fg-faint)]">
            [Gráfico de barras SVG]
          </div>
        </div>

        {/* Placeholder: Top 5 */}
        <div className="col-span-12 md:col-span-6 rounded-[2px] p-[20px_22px] bg-[var(--np-charcoal-2)] border border-[rgba(255,255,255,0.05)] h-[300px] flex flex-col">
          <div className="mb-[18px]">
            <div>
              <h3 className="text-[15px] font-[500] text-[var(--np-fg-strong)] m-0">Top 5 modelos más vendidos</h3>
              <div className="text-[12px] text-[var(--np-fg-muted)] mt-[2px]">Cajas vendidas en total</div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-[rgba(255,255,255,0.1)] text-[12px] text-[var(--np-fg-faint)]">
            [Gráfico de barras horizontales SVG]
          </div>
        </div>

        {/* Placeholder: Utilidad por sucursal */}
        <div className="col-span-12 md:col-span-6 rounded-[2px] p-[20px_22px] bg-[var(--np-charcoal-2)] border border-[rgba(255,255,255,0.05)] h-[300px] flex flex-col">
          <div className="mb-[18px]">
            <h3 className="text-[15px] font-[500] text-[var(--np-fg-strong)] m-0">Utilidad bruta por sucursal</h3>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-[rgba(255,255,255,0.1)] text-[12px] text-[var(--np-fg-faint)]">
            [Utilidades y Stock barras SVG]
          </div>
        </div>

      </div>
    </>
  );
}
