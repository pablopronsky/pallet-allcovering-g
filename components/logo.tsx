"use client";

import { useState } from "react";

export function Logo({ size = "small" }: { size?: "small" | "large" }) {
  const [error, setError] = useState(false);
  
  const imgClasses = size === "small" ? "h-[28px]" : "h-[34px]";
  const textClasses = size === "small" ? "text-[22px]" : "text-[28px]";
  
  if (error) {
    return (
      <div className={`${textClasses} font-black tracking-tighter text-[var(--np-fg-strong)] flex items-center gap-[4px] leading-none`}>
        nuevo <span className="text-[var(--np-green)] tracking-tight">parket</span>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img 
      src="/logo.png" 
      alt="Nuevo Parket" 
      className={`${imgClasses} w-auto block`}
      onError={() => setError(true)}
    />
  );
}
