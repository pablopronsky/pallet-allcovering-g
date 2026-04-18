import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { VentasClient, ProductoConStock } from "./ventas-client";

export default async function VentasPage() {
  const session = await auth();
  const userRole = session?.user?.rol || "VENDEDOR";
  const userSucursal = session?.user?.sucursal;
  
  // 1. Fetching logic: Traemos todo el catálogo y calculamos los lotes con stock vivo
  const productosRaw = await prisma.producto.findMany({
    where: { activo: true },
    include: {
      ingresos: {
        include: {
          ventas: true
        }
      }
    },
    orderBy: { nombre: 'asc' }
  });

  // Re-estructuramos la data para que el cliente no exponga cosas privadas (ej. el costo a los vendedores)
  // y pre-calculamos cuántas cajas hay puramente disponibles por lote/ingreso en la sucursal actual (o todas si es admin).
  const productosParaClient: ProductoConStock[] = productosRaw.map(p => {
    const lotesVivos = p.ingresos.map(ingreso => {
      // Filtrar el lote si el lote NO está en la sucursal del vendedor
      if (userRole !== "ADMIN" && ingreso.sucursal !== userSucursal) {
        return null;
      }

      const vendidasTotalesDeEsteLote = ingreso.ventas.reduce((acc, v) => acc + v.cantidadCajas, 0);
      return {
        ingresoId: ingreso.id,
        fecha: ingreso.fecha,
        sucursal: ingreso.sucursal,
        disponible: ingreso.cantidadCajas - vendidasTotalesDeEsteLote
      }
    }).filter((lote): lote is any => lote !== null && lote.disponible > 0); // Ocultar lotes muertos/vacíos

    return {
      id: p.id,
      nombre: p.nombre,
      lotes: lotesVivos,
    }
  });

  // 2. Fetch history of recent sales. If Admin -> sees all. If Vendedor -> sees only his Sucursal
  const ultimasVentas = await prisma.venta.findMany({
    where: userRole === "ADMIN" ? {} : { sucursal: userSucursal as any },
    include: {
      producto: true,
      ingreso: {
        select: {
          precioCostoPorCaja: true
        }
      },
      user: {
        select: { nombre: true, email: true }
      }
    },
    orderBy: { fecha: 'desc' },
  });

  return (
    <VentasClient 
      productos={productosParaClient} 
      ultimasVentas={ultimasVentas} 
      userRole={userRole} 
      userSucursal={userSucursal} 
    />
  );
}
