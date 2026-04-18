import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BajasClient } from "./bajas-client";

export default async function BajasPage() {
  const session = await auth();
  
  if (session?.user?.rol !== "ADMIN") {
    redirect("/dashboard");
  }

  // Obtenemos los productos activos y calculamos el stock por sucursal
  const productosRaw = await prisma.producto.findMany({
    where: { activo: true },
    include: {
      ingresos: true,
      ventas: true,
      bajas: true,
    },
    orderBy: { nombre: 'asc' }
  });

  const productosParaForm = productosRaw.map(p => {
    const calcStock = (sucursal: string) => {
      const i = p.ingresos.filter(x => x.sucursal === sucursal).reduce((a, b) => a + b.cantidadCajas, 0);
      const v = p.ventas.filter(x => x.sucursal === sucursal).reduce((a, b) => a + b.cantidadCajas, 0);
      const b = p.bajas.filter(x => x.sucursal === sucursal).reduce((a, b) => a + b.cantidadCajas, 0);
      return i - v - b;
    };

    return {
      id: p.id,
      nombre: p.nombre,
      stockPorSucursal: {
        QUILMES: calcStock("QUILMES"),
        LA_PLATA: calcStock("LA_PLATA"),
        GONNET: calcStock("GONNET"),
      }
    }
  });

  const ultimasBajas = await prisma.baja.findMany({
    include: {
      producto: true,
    },
    orderBy: { fecha: 'desc' },
  });

  return (
    <BajasClient productos={productosParaForm} ultimasBajas={ultimasBajas} />
  );
}
