import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_440px] bg-[var(--np-ink)]">
      
      {/* 60% Left Hero */}
      <div className="relative overflow-hidden bg-[#0a0c0e] hidden lg:flex items-end p-[48px]">
        {/* Background Image (Using Unsplash placeholder with wood/interior vibe for now) */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-55"
          style={{ backgroundImage: "url('https://picsum.photos/seed/parket/1920/1080?blur=2')" }}
        />
        
        {/* Scrim Overlay */}
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(10,12,14,0.92), rgba(10,12,14,0.45) 60%, rgba(0,103,48,0.15))' }}
        />

        {/* Copy */}
        <div className="relative z-10 max-w-[420px]">
          <div className="np-eyebrow text-[var(--np-green-soft)] mb-[16px]">
            Control de Consignación
          </div>
          <h1 className="np-display text-white mb-[8px]">
            Pisos en consignación<br />de All Covering.
          </h1>
          <p className="text-[var(--np-fg-muted)] mt-[20px] text-[15px] leading-[1.6]">
            Gestión de stock, ventas y deuda en tiempo real para las tres sucursales de Nuevo Parket.
          </p>
        </div>
      </div>

      {/* 40% Right Panel */}
      <div className="flex flex-col justify-center px-[32px] md:px-[56px] py-[48px] bg-[var(--np-charcoal)] border-l border-[rgba(255,255,255,0.06)] min-h-screen lg:min-h-0">
        
        {/* Logo Section */}
        <div className="mb-[48px]">
          <Logo size="large" />
        </div>

        <div className="mb-[28px]">
          <div className="np-eyebrow mb-[10px]">
            Acceso privado
          </div>
          <h2 className="text-[36px] font-[300] m-0 tracking-[-0.02em] font-[var(--font-display)] text-[var(--np-fg-strong)] leading-tight">
            Ingresá a tu panel
          </h2>
        </div>

        <LoginForm />

      </div>
    </div>
  );
}
