import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CopyPlus } from "lucide-react";

export default async function UsuariosPage() {
  const session = await auth();
  if (session?.user?.rol !== "ADMIN") redirect("/dashboard");

  const usuarios = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <div className="flex items-end justify-between mb-[28px] gap-[24px]">
        <div>
          <div className="np-eyebrow mb-[8px]">Seguridad</div>
          <h1 className="np-display text-[40px] m-0">Usuarios y roles</h1>
          <p className="text-[14px] text-[var(--np-fg-muted)] mt-[6px] m-0">
            Administración de accesos a la plataforma.
          </p>
        </div>
        <div className="flex gap-[10px] flex-wrap">
          <button className="np-btn np-btn--primary">
            <CopyPlus className="w-[14px] h-[14px]" /> Nuevo usuario
          </button>
        </div>
      </div>

      <div className="rounded-[2px] bg-[var(--np-charcoal-2)] border border-[rgba(255,255,255,0.05)] p-0 overflow-hidden">
        <table className="np-table w-full text-left">
          <thead className="bg-[#24272b]">
            <tr>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)]">Nombre</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)]">Email</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)]">Rol</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)]">Sucursal Asignada</th>
              <th className="py-[12px] px-[16px] font-[500] text-[11px] uppercase tracking-wider text-[var(--np-text-muted)] border-b border-[rgba(255,255,255,0.08)]">Modificado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors border-b border-[rgba(255,255,255,0.03)] last:border-0">
                <td className="py-[12px] px-[16px] text-[var(--np-fg-strong)] font-[500] text-[13px]">{u.nombre}</td>
                <td className="py-[12px] px-[16px] text-[var(--np-fg)] text-[13px]">{u.email}</td>
                <td className="py-[12px] px-[16px]">
                  <span className={`inline-block px-[8px] py-[2px] rounded-[2px] text-[10px] font-bold tracking-widest ${u.rol === 'ADMIN' ? 'text-[var(--np-orange)] bg-[rgba(239,127,26,0.1)]' : 'text-[var(--np-fg-muted)] bg-[rgba(255,255,255,0.05)]'}`}>
                    {u.rol}
                  </span>
                </td>
                <td className="py-[12px] px-[16px] text-[var(--np-fg)] text-[13px]">{u.sucursal || "Todas (Admin)"}</td>
                <td className="py-[12px] px-[16px] text-[var(--np-fg-muted)] text-[13px]">{u.updatedAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
