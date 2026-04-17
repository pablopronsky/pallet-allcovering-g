import { LoginForm } from "@/components/login-form";
import { Package } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-main)] p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#eff6ff] rounded-full blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#eff6ff] rounded-full blur-[80px] opacity-60 pointer-events-none" />
      
      <div className="w-full max-w-[400px] bg-[var(--card-bg)] rounded-[16px] border border-[var(--border)] p-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">
        <div className="flex flex-col items-center mb-[32px]">
          <div className="w-[48px] h-[48px] bg-[#eff6ff] rounded-[12px] flex items-center justify-center mb-[16px] text-[var(--accent)]">
            <Package className="w-[24px] h-[24px]" />
          </div>
          <h1 className="text-[1.5rem] font-[800] text-[var(--accent)] tracking-[-0.025em]">NUEVO PARKET</h1>
          <p className="text-[0.85rem] font-[500] text-[var(--text-muted)] mt-[4px]">Control de Consignación</p>
        </div>
        <LoginForm />
      </div>
      
      <div className="mt-8 text-center text-[0.75rem] text-[var(--text-muted)] relative z-10">
        Panel de Administración Exclusivo
      </div>
    </main>
  );
}
