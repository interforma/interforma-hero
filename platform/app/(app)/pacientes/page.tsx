import { getContacts } from "@/lib/chatwoot";
import Punto from "@/components/punto";

const LCD_STYLE = {
  background: "#DCD9D3",
  boxShadow: "inset 0 1px 3px rgba(0,0,0,.12), inset 0 0 0 1px rgba(0,0,0,.04)",
  borderRadius: "var(--radius-card)",
};

export default async function PacientesPage() {
  let contacts: Array<{
    id: number;
    name: string;
    email: string | null;
    phone_number: string | null;
    created_at: number;
    last_activity_at: number;
    contact_inboxes?: Array<{ inbox: { channel_type: string; name: string } }>;
  }> = [];

  try {
    const res = await getContacts();
    contacts = res?.payload || [];
  } catch {}

  const withPhone = contacts.filter((c) => c.phone_number).length;
  const withEmail = contacts.filter((c) => c.email).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-[24px] text-ink" style={{ letterSpacing: "-0.035em" }}>Pacientes</h1>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-muted-light uppercase tracking-[0.08em]">{contacts.length} registrados</span>
          <a
            href="https://chat.interforma.digital"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-semibold text-energia-text hover:text-energia-dark transition-colors"
          >
            Abrir Chatwoot
          </a>
        </div>
      </div>

      {/* LCD summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4" style={LCD_STYLE}>
          <div className="text-[10.5px] font-mono text-muted uppercase tracking-[0.08em] mb-2">Total pacientes</div>
          <span className="text-[28px] font-mono text-ink" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}>
            {contacts.length}
          </span>
        </div>
        <div className="p-4" style={LCD_STYLE}>
          <div className="text-[10.5px] font-mono text-muted uppercase tracking-[0.08em] mb-2">Con telefono</div>
          <span className="text-[28px] font-mono text-ink" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}>
            {withPhone}
          </span>
        </div>
        <div className="p-4" style={LCD_STYLE}>
          <div className="text-[10.5px] font-mono text-muted uppercase tracking-[0.08em] mb-2">Con email</div>
          <span className="text-[28px] font-mono text-ink" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}>
            {withEmail}
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
              <th className="px-5 py-3 text-left text-[10.5px] font-mono font-medium text-muted uppercase tracking-[0.08em]">Canal</th>
              <th className="px-5 py-3 text-right text-[10.5px] font-mono font-medium text-muted uppercase tracking-[0.08em]">Ultima actividad</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => {
              const channel = c.contact_inboxes?.[0]?.inbox?.name || "WhatsApp";
              return (
                <tr
                  key={c.id}
                  className="border-b border-border-subtle last:border-0 hover:bg-[#f7f6f3] transition-colors"
                  style={{ transitionDuration: "var(--duration-normal)" }}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 bg-energia-50 rounded-full flex items-center justify-center text-[9px] font-mono font-bold text-energia-text shrink-0">
                        {(c.name?.[0] || "?").toUpperCase()}
                      </div>
                      <span className="font-medium text-ink">
                        {c.name || "Sin nombre"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-light font-mono text-[12px]" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {c.phone_number || "-"}
                  </td>
                  <td className="px-5 py-3 text-muted text-[12px]">{c.email || "-"}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-badge)] text-[10px] font-semibold bg-success-bg text-success">
                      <span className="w-[5px] h-[5px] rounded-full bg-success" />
                      {channel}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-muted-light font-mono text-[12px]" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {c.last_activity_at ? timeAgo(c.last_activity_at) : "-"}
                  </td>
                </tr>
              );
            })}
            {contacts.length === 0 && (
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

function timeAgo(timestamp: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  if (diff < 60) return "Ahora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
