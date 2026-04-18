import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

// Usamos la nueva variable para evitar conflictos
const dbUrl = process.env.SUPABASE_URL || process.env.DATABASE_URL;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasourceUrl: dbUrl,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
