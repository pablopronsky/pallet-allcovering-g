import { PrismaClient, Role, Sucursal } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHashAdmin = await bcrypt.hash('admin123', 10)
  const passwordHashVend = await bcrypt.hash('vend123', 10)

  // 1. Usuarios (Slots fijos)
  await prisma.user.upsert({
    where: { email: 'admin@np.com' },
    update: {},
    create: {
      nombre: 'Administrador',
      email: 'admin@np.com',
      password: passwordHashAdmin,
      rol: Role.ADMIN,
    },
  })

  await prisma.user.upsert({
    where: { email: 'quilmes@np.com' },
    update: {},
    create: {
      nombre: 'Vendedor Quilmes',
      email: 'quilmes@np.com',
      password: passwordHashVend,
      rol: Role.VENDEDOR,
      sucursal: Sucursal.QUILMES,
    },
  })

  await prisma.user.upsert({
    where: { email: 'laplata@np.com' },
    update: {},
    create: {
      nombre: 'Vendedor La Plata',
      email: 'laplata@np.com',
      password: passwordHashVend,
      rol: Role.VENDEDOR,
      sucursal: Sucursal.LA_PLATA,
    },
  })

  await prisma.user.upsert({
    where: { email: 'gonnet@np.com' },
    update: {},
    create: {
      nombre: 'Vendedor Gonnet',
      email: 'gonnet@np.com',
      password: passwordHashVend,
      rol: Role.VENDEDOR,
      sucursal: Sucursal.GONNET,
    },
  })

  // 2. Productos de ejemplo
  const productos = [
    { nombre: 'Piso SPC Roble Claro' },
    { nombre: 'Piso Flotante Nogal' },
    { nombre: 'Zócalo PVC Blanco' },
    { nombre: 'Manta Bajo Piso 2mm' },
    { nombre: 'Piso SPC Gris Cemento' },
  ]

  for (const p of productos) {
    await prisma.producto.create({
      data: p
    })
  }

  console.log('Seed ejecutado correctamente: 4 usuarios y 5 productos creados.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
