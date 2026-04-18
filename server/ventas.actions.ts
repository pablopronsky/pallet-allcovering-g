"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const VentaSchema = z.object({
  productoId: z.string().min(1, "El producto es obligatorio"),
  ingresoId: z.string().min(1, "Debe seleccionar el lote/ingreso de origen"),
  sucursal: z.enum(["QUILMES", "LA_PLATA", "GONNET"], { required_error: "La sucursal es obligatoria" }),
  cantidadCajas: z.coerce.number().min(1, "La cantidad mínima es 1"),
  precioVentaPorCaja: z.coerce.number().min(0, "El precio no puede ser negativo"),
  notas: z.string().optional(),
});

export async function createVentaAction(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Debe iniciar sesión para operar." };
  }

  const rawData = {
    productoId: formData.get("productoId"),
    ingresoId: formData.get("ingresoId"),
    sucursal: formData.get("sucursal"),
    cantidadCajas: formData.get("cantidadCajas"),
    precioVentaPorCaja: formData.get("precioVentaPorCaja"),
    notas: formData.get("notas"),
  };

  const validated = VentaSchema.safeParse(rawData);
  
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const data = validated.data;

  // 1. Validar que la sucursal coincide si es vendedor
  if (session.user.rol === "VENDEDOR" && data.sucursal !== session.user.sucursal) {
    return { error: "Operación denegada: Sólo podés registrar ventas en tu sucursal asignada." };
  }

  try {
    // 2. Verificar que el Lote/Ingreso tiene el stock suficiente.
    // Buscamos el ingreso y sumamos sus ventas previas.
    const ingreso = await prisma.ingreso.findUnique({
      where: { id: data.ingresoId },
      include: { ventas: true }
    });

    if (!ingreso) {
      return { error: "El lote seleccionado no existe." };
    }

    const cajasYaVendidas = ingreso.ventas.reduce((acc, v) => acc + v.cantidadCajas, 0);
    const cajasDisponibles = ingreso.cantidadCajas - cajasYaVendidas;

    if (data.cantidadCajas > cajasDisponibles) {
      return { error: `Stock insuficiente en este lote. Intentas vender ${data.cantidadCajas} pero quedan ${cajasDisponibles}.` };
    }

    // 3. Registrar la venta
    await prisma.venta.create({
      data: {
        ...data,
        userId: session.user.id,
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/ventas");
    return { success: true };
  } catch (error) {
    console.error("Error al registrar venta:", error);
    return { error: "Ocurrió un error inesperado al guardar la venta." };
  }
}
