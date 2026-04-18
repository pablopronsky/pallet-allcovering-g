"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const IngresoSchema = z.object({
  productoId: z.string().min(1, "El producto es obligatorio"),
  sucursal: z.enum(["QUILMES", "LA_PLATA", "GONNET"], { required_error: "La sucursal es obligatoria" }),
  cantidadCajas: z.coerce.number().min(1, "La cantidad mínima es 1"),
  precioCostoPorCaja: z.coerce.number().min(0, "El precio no puede ser negativo"),
  notas: z.string().optional(),
});

export async function createIngresoAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.rol !== "ADMIN") {
    return { error: "Acceso denegado: Se requiere rol de Administrador." };
  }

  const rawData = {
    productoId: formData.get("productoId"),
    sucursal: formData.get("sucursal"),
    cantidadCajas: formData.get("cantidadCajas"),
    precioCostoPorCaja: formData.get("precioCostoPorCaja"),
    notas: formData.get("notas"),
  };

  const validated = IngresoSchema.safeParse(rawData);
  
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  try {
    await prisma.ingreso.create({
      data: {
        ...validated.data,
        adminId: session.user.id as string,
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/ingresos");
    return { success: true };
  } catch (error) {
    console.error("Error al crear ingreso:", error);
    return { error: "Ocurrió un error inesperado al guardar en la base de datos." };
  }
}
