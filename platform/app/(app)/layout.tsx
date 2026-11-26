import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex h-full">
      <Sidebar userName={session.name} />
      <main className="flex-1 overflow-auto bg-piedra">
        <div className="p-6 max-w-[1280px]">{children}</div>
      </main>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center bg-piedra">
        <div className="text-muted-light text-sm">Cargando...</div>
      </div>
    }>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
