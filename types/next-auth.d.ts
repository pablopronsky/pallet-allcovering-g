import NextAuth, { type DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      rol: string
      sucursal: string | null
    } & DefaultSession["user"]
  }

  interface User {
    rol: string
    sucursal: string | null
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    rol: string
    sucursal: string | null
  }
}
