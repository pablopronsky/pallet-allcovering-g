"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { MotivoBaja, Sucursal } from "@prisma/client";

export async function createBajaAction(formData: FormData) {
  try {
    const session = await auth();
    if (session?.user?.rol !== "ADMIN") {
      throw new Error("Solo los administradores pueden registrar bajas.");
    }

    const userId = session?.user?.id;
    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    const productoId = formData.get("productoId") as string;
    const sucursal = formData.get("sucursal") as Sucursal;
    const cantidadCajas = Number(formData.get("cantidadCajas"));
    const motivo = formData.get("motivo") as MotivoBaja;
    const notas = formData.get("notas") as string;

    if (!productoId || !sucursal || isNaN(cantidadCajas) || !motivo || cantidadCajas <= 0) {
      throw new Error("Datos inválidos. Verifica todos los campos.");
    }

    // Calcular el stock disponible real global en esa sucursal
    const producto = await prisma.producto.findUnique({
      where: { id: productoId },
      include: {
        ingresos: { where: { sucursal } },
        ventas: { where: { sucursal } },
        bajas: { where: { sucursal } },
      }
    });

    if (!producto) {
      throw new Error("Producto no encontrado.");
    }

    const ingresadas = producto.ingresos.reduce((acc, i) => acc + i.cantidadCajas, 0);
    const vendidas = producto.ventas.reduce((acc, v) => acc + v.cantidadCajas, 0);
    const bajas = producto.bajas.reduce((acc, b) => acc + b.cantidadCajas, 0);

    const stockDisponible = ingresadas - vendidas - bajas;

    if (cantidadCajas > stockDisponible) {
      throw new Error(`Stock físico insuficiente en ${sucursal}. Disponibles: ${stockDisponible} cajas.`);
    }

    await prisma.baja.create({
      data: {
        productoId,
        sucursal,
        cantidadCajas,
        motivo,
        adminId: userId,
        notas,
      }
    });

    revalidatePath("/dashboard/bajas");
    revalidatePath("/dashboard/stock");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
