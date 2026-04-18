import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Download } from "lucide-react";
import { StockTable } from "./stock-table";

export default async function StockPage() {
  const session = await auth();
  const isAdmin = session?.user?.rol === "ADMIN";
  const userSucursal = session?.user?.sucursal;

  // Fetch products and their movements
  const productos = await prisma.producto.findMany({
    where: { activo: true },
    include: {
      ingresos: true,
      ventas: true,
      bajas: true,
    },
    orderBy: { nombre: 'asc' }
  });

  const SUCURSALES_ENUM = ['QUILMES', 'LA_PLATA', 'GONNET'];

  // Normalize userSucursal for initial filter if not admin
  const userSucursalDisplay = userSucursal === 'QUILMES' ? "Quilmes" : userSucursal === 'LA_PLATA' ? "La Plata" : userSucursal === 'GONNET' ? "Gonnet" : "Todas";

  // Reshape data into exactly what the Stock table needs per sucursal
  const stockData: any[] = [];

  productos.forEach(p => {
    SUCURSALES_ENUM.forEach(s => {
      // Skip if Vendedor and it's not their branch
      if (!isAdmin && s !== userSucursal) return;

      const ingresadas = p.ingresos.filter(i => i.sucursal === s).reduce((acc, i) => acc + i.cantidadCajas, 0);
      const vendidas = p.ventas.filter(v => v.sucursal === s).reduce((acc, v) => acc + v.cantidadCajas, 0);
      const dadas = p.bajas.filter(b => b.sucursal === s).reduce((acc, b) => acc + b.cantidadCajas, 0);

      if (ingresadas === 0 && vendidas === 0 && dadas === 0) return;

      stockData.push({
        id: `${p.id}-${s}`,
        productoId: p.id,
        producto: p.nombre,
        sucursal: s === "QUILMES" ? "Quilmes" : s === "LA_PLATA" ? "La Plata" : "Gonnet",
        ingresadas,
        vendidas,
        dadas,
        disponibles: ingresadas - vendidas - dadas,
      });
    });
  });

  return (
    <>
      <div className="flex items-end justify-between mb-[28px] gap-[24px]">
        <div>
          <div className="np-eyebrow mb-[8px]">Inventario</div>
          <h1 className="np-display text-[40px] m-0">Stock actual</h1>
          <p className="text-[14px] text-[var(--np-fg-muted)] mt-[6px] m-0">
            Cajas disponibles por modelo y sucursal. <span className="text-[var(--np-fg-faint)]">Disponibles = ingresadas − vendidas − bajas.</span>
          </p>
        </div>
        <div className="flex gap-[10px] flex-wrap">
          <button className="np-btn np-btn--ghost">
            <Download className="w-[14px] h-[14px]" /> Exportar Excel
          </button>
        </div>
      </div>

      <StockTable initialData={stockData} isAdmin={isAdmin} userSucursal={userSucursalDisplay} />
    </>
  );
}
