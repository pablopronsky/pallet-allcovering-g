"use server"

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email({
    message: "Ingresá un correo válido.",
  }),
  password: z.string().min(1, {
    message: "La contraseña es requerida.",
  }),
});

export async function loginAction(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos." };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales incorrectas." };
        default:
          return { error: "Ocurrió un error inesperado al iniciar sesión." };
      }
    }
    throw error;
  }
}

export async function formActionSignOut() {
  await signOut({ redirectTo: "/login" });
}
