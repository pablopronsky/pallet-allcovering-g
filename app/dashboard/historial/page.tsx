import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function HistorialPage() {
  const session = await auth();
  const isAdmin = session?.user?.rol === "ADMIN";
  const userSucursal = session?.user?.sucursal;

  const ingresos = await prisma.ingreso.findMany({
    where: isAdmin ? {} : { sucursal: userSucursal as any },
    include: { producto: true },
    take: 50,
  });

  const ventas = await prisma.venta.findMany({
    where: isAdmin ? {} : { sucursal: userSucursal as any },
    include: { producto: true, user: true },
    take: 50,
  });

  const bajas = await prisma.baja.findMany({
    where: isAdmin ? {} : { sucursal: userSucursal as any },
    include: { producto: true },
    take: 50,
  });

  // Normalize into a single feed
  const feed = [
    ...ingresos.map(i => ({ type: 'INGRESO', date: i.fecha, description: `Ingresaron ${i.cantidadCajas} cajas`, sucursal: i.sucursal, producto: i.producto.nombre })),
    ...ventas.map(v => ({ type: 'VENTA', date: v.fecha, description: `Se vendieron ${v.cantidadCajas} cajas (${v.user.nombre.split(' ')[0]})`, sucursal: v.sucursal, producto: v.producto.nombre })),
    ...bajas.map(b => ({ type: 'BAJA', date: b.fecha, description: `Se dieron de baja ${b.cantidadCajas} cajas (${b.motivo})`, sucursal: b.sucursal, producto: b.producto.nombre })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 50);

  const getTypeStyle = (t: string) => {
    if (t === 'INGRESO') return 'text-[var(--np-green)] bg-[rgba(71,184,99,0.1)]';
    if (t === 'VENTA') return 'text-[var(--np-orange)] bg-[rgba(239,127,26,0.1)]';
    return 'text-[#ff5252] bg-[rgba(255,82,82,0.1)]';
  };

  return (
    <>
      <div className="flex items-end justify-between mb-[28px] gap-[24px]">
        <div>
          <div className="np-eyebrow mb-[8px]">Auditoría</div>
          <h1 className="np-display text-[40px] m-0">Últimos movimientos</h1>
          <p className="text-[14px] text-[var(--np-fg-muted)] mt-[6px] m-0">
            Registro cronológico de entradas, salidas y anulaciones.
          </p>
        </div>
      </div>

      <div className="rounded-[2px] bg-[var(--np-charcoal-2)] border border-[rgba(255,255,255,0.05)] p-0 overflow-hidden">
        <table className="np-table w-full text-left">
          <thead className="bg-[#24272b]">
            <tr>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)]">Fecha</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)]">Tipo</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)]">Modelo</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)]">Sucursal</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)]">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {feed.length === 0 && (
              <tr>
                <td colSpan={5} className="p-[48px] text-center text-[var(--np-fg-muted)] text-[14px]">
                  No hay movimientos registrados.
                </td>
              </tr>
            )}
            {feed.map((item, i) => (
              <tr key={i} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors border-b border-[rgba(255,255,255,0.03)] last:border-0">
                <td className="py-[12px] px-[16px] text-[var(--np-fg-muted)] text-[13px] whitespace-nowrap">
                  {new Date(item.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="py-[12px] px-[16px]">
                  <span className={`inline-block px-[8px] py-[2px] rounded-[2px] text-[10px] font-bold tracking-widest ${getTypeStyle(item.type)}`}>
                    {item.type}
                  </span>
                </td>
                <td className="py-[12px] px-[16px] text-[var(--np-fg-strong)] font-[500] text-[13px]">{item.producto}</td>
                <td className="py-[12px] px-[16px] text-[var(--np-fg)] text-[13px]">{item.sucursal}</td>
                <td className="py-[12px] px-[16px] text-[var(--np-fg)] text-[13px]">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
