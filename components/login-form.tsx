"use client";

import { useActionState, useTransition, useState } from "react";
import { loginAction } from "@/server/auth.actions";

export function LoginForm() {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      const res = await loginAction({ email, password });
      if (res?.error) setError(res.error);
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-[20px]">
      <div className="flex flex-col gap-[8px]">
        <label className="text-[0.8rem] font-[600] text-[var(--text-main)]" htmlFor="email">Correo electrónico</label>
        <input 
          id="email"
          name="email"
          type="email" 
          required 
          disabled={isPending}
          className="h-[42px] w-full rounded-[8px] border border-[var(--border)] bg-gray-50 px-[12px] py-[8px] text-[0.9rem] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="admin@np.com" 
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        <label className="text-[0.8rem] font-[600] text-[var(--text-main)]" htmlFor="password">Contraseña</label>
        <input 
          id="password"
          name="password"
          type="password" 
          required 
          disabled={isPending}
          className="h-[42px] w-full rounded-[8px] border border-[var(--border)] bg-gray-50 px-[12px] py-[8px] text-[0.9rem] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="••••••••" 
        />
      </div>
      
      {error && (
        <div className="p-[12px] rounded-[8px] bg-red-50 border border-red-100 text-[0.85rem] text-red-600 font-[500] text-center">
          {error}
        </div>
      )}

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full h-[42px] mt-[8px] flex items-center justify-center rounded-[8px] text-[0.9rem] font-[600] bg-[var(--accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {isPending ? "Ingresando..." : "Ingresar al Panel"}
      </button>
    </form>
  );
}
