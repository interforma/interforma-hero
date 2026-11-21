"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Wordmark from "@/components/wordmark";
import Punto from "@/components/punto";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Credenciales invalidas");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-piedra">
      <div className="w-full max-w-sm">
        <div className="bg-papel rounded-[var(--radius-card-lg)] border border-border p-8" style={{ boxShadow: "var(--shadow-md)" }}>
          <div className="flex flex-col items-center mb-8">
            <Punto expr={error ? "uy" : "saluda"} size={56} decor />
            <div className="mt-4">
              <Wordmark size="md" />
            </div>
            <p className="text-[11px] text-muted-light mt-2 uppercase tracking-[0.08em] font-medium">Contact Center Platform</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-muted uppercase tracking-[0.08em] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#fbfaf8] border border-stone rounded-[var(--radius-md)] text-sm text-ink focus:outline-none focus:ring-2 focus:ring-energia-text focus:border-transparent transition-colors"
                style={{ minHeight: 40 }}
                placeholder="tu@interforma.digital"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-muted uppercase tracking-[0.08em] mb-1.5">Contrasena</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#fbfaf8] border border-stone rounded-[var(--radius-md)] text-sm text-ink focus:outline-none focus:ring-2 focus:ring-energia-text focus:border-transparent transition-colors"
                style={{ minHeight: 40 }}
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-error-bg px-3 py-2 rounded-[var(--radius-badge)]">
                <span className="w-[6px] h-[6px] rounded-full bg-error shrink-0" />
                <p className="text-[12px] text-error">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-energia text-ink rounded-[var(--radius-btn)] text-sm font-semibold hover:bg-energia-hover disabled:opacity-50 active:scale-[0.98] transition-all cursor-pointer"
              style={{ transitionDuration: "var(--duration-normal)" }}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
        <p className="text-center text-[10px] text-muted-light mt-6 uppercase tracking-[0.08em]">Interforma Digital 2026</p>
      </div>
    </div>
  );
}
