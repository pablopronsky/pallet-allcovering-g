import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { IngresosClient } from "./ingresos-client";

export default async function IngresosPage() {
  const session = await auth();
  
  if (session?.user?.rol !== "ADMIN") {
    redirect("/dashboard");
  }

  const productos = await prisma.producto.findMany({
    where: { activo: true },
    orderBy: { nombre: 'asc' },
    select: { id: true, nombre: true }
  });

  const ultimosIngresos = await prisma.ingreso.findMany({
    include: {
      producto: true,
    },
    orderBy: { fecha: 'desc' },
  });

  return (
    <IngresosClient productos={productos} ultimosIngresos={ultimosIngresos} />
  );
}
