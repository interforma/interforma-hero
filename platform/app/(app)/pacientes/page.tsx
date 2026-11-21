import { getPeople } from "@/lib/twenty";
import Punto from "@/components/punto";

const LCD_STYLE = {
  background: "#DCD9D3",
  boxShadow: "inset 0 1px 3px rgba(0,0,0,.12), inset 0 0 0 1px rgba(0,0,0,.04)",
  borderRadius: "var(--radius-card)",
};

export default async function PacientesPage() {
  let people: Array<{
    id: string;
    name?: { firstName?: string; lastName?: string };
    phones?: { primaryPhoneNumber?: string };
    emails?: { primaryEmail?: string };
    company?: { name?: string };
    createdAt: string;
  }> = [];

  try {
    const res = await getPeople();
    people = res?.data?.people || [];
  } catch {}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-[24px] text-ink" style={{ letterSpacing: "-0.035em" }}>Pacientes</h1>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-muted-light uppercase tracking-[0.08em]">{people.length} registrados</span>
          <a
            href="https://crm.interforma.digital"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-semibold text-energia-text hover:text-energia-dark transition-colors"
          >
            Abrir CRM
          </a>
        </div>
      </div>

      {/* LCD summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4" style={LCD_STYLE}>
          <div className="text-[10.5px] font-mono text-muted uppercase tracking-[0.08em] mb-2">Total pacientes</div>
          <span className="text-[28px] font-mono text-ink" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}>
            {people.length}
          </span>
        </div>
        <div className="p-4" style={LCD_STYLE}>
          <div className="text-[10.5px] font-mono text-muted uppercase tracking-[0.08em] mb-2">Con telefono</div>
          <span className="text-[28px] font-mono text-ink" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}>
            {people.filter((p) => p.phones?.primaryPhoneNumber).length}
          </span>
        </div>
        <div className="p-4" style={LCD_STYLE}>
          <div className="text-[10.5px] font-mono text-muted uppercase tracking-[0.08em] mb-2">Con email</div>
          <span className="text-[28px] font-mono text-ink" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}>
            {people.filter((p) => p.emails?.primaryEmail).length}
          </span>
        </div>
      </div>

      <div className="bg-papel rounded-[var(--radius-card)] border border-border overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-[10.5px] font-mono font-medium text-muted uppercase tracking-[0.08em]">Nombre</th>
              <th className="px-5 py-3 text-left text-[10.5px] font-mono font-medium text-muted uppercase tracking-[0.08em]">Telefono</th>
              <th className="px-5 py-3 text-left text-[10.5px] font-mono font-medium text-muted uppercase tracking-[0.08em]">Email</th>
              <th className="px-5 py-3 text-left text-[10.5px] font-mono font-medium text-muted uppercase tracking-[0.08em]">Empresa</th>
              <th className="px-5 py-3 text-right text-[10.5px] font-mono font-medium text-muted uppercase tracking-[0.08em]">Creado</th>
            </tr>
          </thead>
          <tbody>
            {people.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border-subtle last:border-0 hover:bg-[#f7f6f3] transition-colors"
                style={{ transitionDuration: "var(--duration-normal)" }}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 bg-energia-50 rounded-full flex items-center justify-center text-[9px] font-mono font-bold text-energia-text shrink-0">
                      {(p.name?.firstName?.[0] || "?").toUpperCase()}
                    </div>
                    <span className="font-medium text-ink">
                      {[p.name?.firstName, p.name?.lastName].filter(Boolean).join(" ") || "Sin nombre"}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-light font-mono text-[12px]" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {p.phones?.primaryPhoneNumber || "-"}
                </td>
                <td className="px-5 py-3 text-muted text-[12px]">{p.emails?.primaryEmail || "-"}</td>
                <td className="px-5 py-3 text-muted text-[12px]">{p.company?.name || "-"}</td>
                <td className="px-5 py-3 text-right text-muted-light font-mono text-[12px]" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {new Date(p.createdAt).toLocaleDateString("es-CL")}
                </td>
              </tr>
            ))}
            {people.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-14 text-center">
                <Punto expr="piensa" size={48} decor />
                <p className="text-[13px] text-muted mt-3">Sin pacientes registrados</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
