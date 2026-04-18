"use client";

import { useActionState, useTransition, useState } from "react";
import { loginAction } from "@/server/auth.actions";

export function LoginForm() {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const res = await loginAction({ email, password });
      if (res?.error) setError(res.error);
    });
  };

  const autofill = (usrEmail: string, pass: string) => {
    setEmail(usrEmail);
    setPassword(pass);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
        <div className="flex flex-col gap-[6px]">
          <label className="np-eyebrow" htmlFor="email">Email</label>
          <input 
            id="email"
            name="email"
            type="email" 
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isPending}
            className="np-form-input"
            placeholder="admin@np.com" 
          />
        </div>
        <div className="flex flex-col gap-[6px]">
          <label className="np-eyebrow" htmlFor="password">Contraseña</label>
          <input 
            id="password"
            name="password"
            type="password" 
            required 
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isPending}
            className="np-form-input"
            placeholder="••••••••" 
          />
        </div>
        
        {error && (
          <div className="p-[12px] rounded-[4px] border border-red-500/30 text-[13px] text-red-500 bg-red-500/10 font-[500] text-center">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isPending}
          className="np-btn np-btn--primary w-full justify-center text-[14px] py-[12px] mt-[4px]"
        >
          {isPending ? "Ingresando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-[24px] p-[14px_16px] rounded-[2px] bg-[rgba(71,184,99,0.06)] border border-[rgba(71,184,99,0.18)] text-[12px] text-[var(--np-fg)] leading-[1.6]">
        <strong className="text-[var(--np-green-soft)] font-[500]">Usuarios de prueba</strong> — click para auto-completar:
        
        <div className="flex justify-between items-center mt-[6px] font-mono text-[11px] text-[var(--np-fg-muted)]">
          <span>Admin</span>
          <button type="button" onClick={() => autofill('admin@np.com', 'admin123')} className="bg-transparent border-0 p-0 text-[var(--np-green-soft)] hover:underline cursor-pointer">
            admin@np.com · admin123
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-[6px] font-mono text-[11px] text-[var(--np-fg-muted)]">
          <span>Quilmes</span>
          <button type="button" onClick={() => autofill('quilmes@np.com', 'vend123')} className="bg-transparent border-0 p-0 text-[var(--np-green-soft)] hover:underline cursor-pointer">
            quilmes@np.com · vend123
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-[6px] font-mono text-[11px] text-[var(--np-fg-muted)]">
          <span>La Plata</span>
          <button type="button" onClick={() => autofill('laplata@np.com', 'vend123')} className="bg-transparent border-0 p-0 text-[var(--np-green-soft)] hover:underline cursor-pointer">
            laplata@np.com · vend123
          </button>
        </div>

        <div className="flex justify-between items-center mt-[6px] font-mono text-[11px] text-[var(--np-fg-muted)]">
          <span>Gonnet</span>
          <button type="button" onClick={() => autofill('gonnet@np.com', 'vend123')} className="bg-transparent border-0 p-0 text-[var(--np-green-soft)] hover:underline cursor-pointer">
            gonnet@np.com · vend123
          </button>
        </div>
      </div>
    </>
  );
}
