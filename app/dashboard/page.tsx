import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  
  return (
    <div className="flex flex-col gap-[24px]">
      <header className="flex justify-between items-center text-[var(--text-main)]">
        <div>
          <h1 className="text-[1.5rem] font-[700] tracking-[-0.025em]">Tablero Administrativo</h1>
          <p className="text-[var(--text-muted)] text-[0.9rem]">Consolidado general de consignación</p>
        </div>
        <div className="bg-[var(--card-bg)] px-[12px] py-[6px] rounded-full border border-[var(--border)] text-[0.8rem] font-[600] flex items-center gap-[6px]">
          <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
          {session?.user?.rol === "ADMIN" ? "Admin" : "Vendedor"}: {session?.user?.email}
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
        {/* Placeholder metric cards mimicking the design */}
        <div className="bg-[var(--card-bg)] p-[20px] rounded-[12px] border border-[var(--border)] shadow-sm flex flex-col justify-between">
          <div className="text-[0.75rem] uppercase tracking-[0.05em] text-[var(--text-muted)] font-[600]">Deuda de Sucursales</div>
          <div className="text-[1.5rem] font-[700] text-[var(--danger)] py-[8px]">$ 0,00</div>
          <div className="text-[0.7rem] text-[var(--text-muted)]">Calculado s/ Ventas cobradas</div>
        </div>
        
        <div className="bg-[var(--card-bg)] p-[20px] rounded-[12px] border border-[var(--border)] shadow-sm flex flex-col justify-between">
          <div className="text-[0.75rem] uppercase tracking-[0.05em] text-[var(--text-muted)] font-[600]">Utilidad Bruta Proyectada</div>
          <div className="text-[1.5rem] font-[700] text-[var(--success)] py-[8px]">$ 0,00</div>
          <div className="text-[0.7rem] text-[var(--text-muted)]">Base a stock no vendido</div>
        </div>

        <div className="bg-[var(--card-bg)] p-[20px] rounded-[12px] border border-[var(--border)] shadow-sm flex flex-col justify-between">
          <div className="text-[0.75rem] uppercase tracking-[0.05em] text-[var(--text-muted)] font-[600]">Stock Global (Cajas)</div>
          <div className="text-[1.5rem] font-[700] text-[var(--text-main)] py-[8px]">0</div>
          <div className="text-[0.7rem] text-[var(--text-muted)]">En todas las sucursales</div>
        </div>
      </div>

      <div className="flex justify-between items-end mt-[8px]">
        <h2 className="text-[1rem] font-[600] text-[var(--text-main)] tracking-[-0.01em]">Stock Actual por Sucursal</h2>
        <button className="bg-[var(--text-main)] text-white px-[16px] py-[8px] rounded-[8px] text-[0.8rem] font-[600] hover:opacity-90 transition-opacity flex items-center gap-[6px]">
          Exportar Excel (.xlsx)
        </button>
      </div>

      <div className="bg-white rounded-[12px] border border-[var(--border)] flex-1 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[700px]">
            <thead>
              <tr>
                <th className="bg-[#f9fafb] px-[20px] py-[12px] text-[0.75rem] uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-wider">Modelo de Piso</th>
                <th className="bg-[#f9fafb] px-[20px] py-[12px] text-[0.75rem] uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-wider">Sucursal</th>
                <th className="bg-[#f9fafb] px-[20px] py-[12px] text-[0.75rem] uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-wider">Cajas Ingresadas</th>
                <th className="bg-[#f9fafb] px-[20px] py-[12px] text-[0.75rem] uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-wider">Cajas Vendidas</th>
                <th className="bg-[#f9fafb] px-[20px] py-[12px] text-[0.75rem] uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-wider">Cajas Bajas</th>
                <th className="bg-[#f9fafb] px-[20px] py-[12px] text-[0.75rem] uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-wider whitespace-nowrap">Stock Disp.</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-[20px] py-[14px] text-[0.85rem] border-b border-[var(--border)] font-[600]">Piso SPC Roble Claro</td>
                <td className="px-[20px] py-[14px] text-[0.85rem] border-b border-[var(--border)]">
                  <span className="bg-[#e0f2fe] text-[#0369a1] px-[8px] py-[4px] rounded-[6px] text-[0.7rem] font-[600]">Quilmes</span>
                </td>
                <td className="px-[20px] py-[14px] text-[0.85rem] border-b border-[var(--border)] text-[var(--text-muted)]">0</td>
                <td className="px-[20px] py-[14px] text-[0.85rem] border-b border-[var(--border)] text-[var(--text-muted)]">0</td>
                <td className="px-[20px] py-[14px] text-[0.85rem] border-b border-[var(--border)] text-[var(--text-muted)]">0</td>
                <td className="px-[20px] py-[14px] text-[0.85rem] border-b border-[var(--border)] font-[700] text-[var(--danger)]">0</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-[20px] py-[14px] text-[0.85rem] border-b border-[var(--border)] font-[600]">Zócalo PVC Blanco</td>
                <td className="px-[20px] py-[14px] text-[0.85rem] border-b border-[var(--border)]">
                  <span className="bg-purple-100 text-purple-700 px-[8px] py-[4px] rounded-[6px] text-[0.7rem] font-[600]">La Plata</span>
                </td>
                <td className="px-[20px] py-[14px] text-[0.85rem] border-b border-[var(--border)] text-[var(--text-muted)]">0</td>
                <td className="px-[20px] py-[14px] text-[0.85rem] border-b border-[var(--border)] text-[var(--text-muted)]">0</td>
                <td className="px-[20px] py-[14px] text-[0.85rem] border-b border-[var(--border)] text-[var(--text-muted)]">0</td>
                <td className="px-[20px] py-[14px] text-[0.85rem] border-b border-[var(--border)] font-[700] text-[var(--danger)]">0</td>
              </tr>
              {/* Empty state for the rest row */}
              <tr className="bg-gray-50/50">
                <td colSpan={6} className="px-[20px] py-[32px] text-center text-[0.85rem] text-[var(--text-muted)]">
                  Aún no hay ingresos de stock en la Fase 1. En la Fase 2, esta tabla se alimentará de tu base de datos.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
