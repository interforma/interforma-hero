import { getConversations } from "@/lib/chatwoot";
import Punto from "@/components/punto";

function timeAgo(ts: number) {
  const diff = Math.floor((Date.now() / 1000) - ts);
  if (diff < 60) return "ahora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

const STATUS_DOT: Record<string, string> = {
  open: "bg-success",
  pending: "bg-warning",
  resolved: "bg-stone",
  snoozed: "bg-sky",
};

const STATUS_LABEL: Record<string, string> = {
  open: "Abierta",
  pending: "Pendiente",
  resolved: "Resuelta",
  snoozed: "Pospuesta",
};

export default async function ConversacionesPage() {
  let convos: Array<{
    id: number;
    status: string;
    meta: { sender?: { name: string; phone_number?: string }; channel?: string };
    last_activity_at: number;
    unread_count: number;
    messages?: Array<{ content: string; message_type: number }>;
  }> = [];

  try {
    const res = await getConversations("all");
    convos = res?.data?.payload || [];
  } catch {}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-[24px] text-ink" style={{ letterSpacing: "-0.035em" }}>Conversaciones</h1>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-muted-light uppercase tracking-[0.08em]">{convos.length} total</span>
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

      <div className="bg-papel rounded-[var(--radius-card)] border border-border overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-[10.5px] font-mono font-medium text-muted uppercase tracking-[0.08em]">Estado</th>
              <th className="px-5 py-3 text-left text-[10.5px] font-mono font-medium text-muted uppercase tracking-[0.08em]">Contacto</th>
              <th className="px-5 py-3 text-left text-[10.5px] font-mono font-medium text-muted uppercase tracking-[0.08em]">Telefono</th>
              <th className="px-5 py-3 text-left text-[10.5px] font-mono font-medium text-muted uppercase tracking-[0.08em]">Ultimo mensaje</th>
              <th className="px-5 py-3 text-right text-[10.5px] font-mono font-medium text-muted uppercase tracking-[0.08em]">Actividad</th>
            </tr>
          </thead>
          <tbody>
            {convos.map((c, i) => (
              <tr
                key={c.id}
                className="border-b border-border-subtle last:border-0 hover:bg-[#f7f6f3] transition-colors"
                style={{ transitionDuration: "var(--duration-normal)" }}
              >
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`w-[6px] h-[6px] rounded-full ${STATUS_DOT[c.status] || "bg-stone"}`} />
                    <span className="text-[12px] text-muted">{STATUS_LABEL[c.status] || c.status}</span>
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 bg-piedra rounded-full flex items-center justify-center text-[9px] font-mono font-bold text-muted shrink-0">
                      {(c.meta?.sender?.name?.[0] || "?").toUpperCase()}
                    </div>
                    <span className="font-medium text-ink">{c.meta?.sender?.name || "Sin nombre"}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-light font-mono text-[12px]" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {c.meta?.sender?.phone_number || "-"}
                </td>
                <td className="px-5 py-3 text-muted truncate max-w-[300px]">
                  {c.messages?.[0]?.content?.slice(0, 80) || "-"}
                </td>
                <td className="px-5 py-3 text-right text-muted-light font-mono text-[12px]" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {timeAgo(c.last_activity_at)}
                </td>
              </tr>
            ))}
            {convos.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-14 text-center">
                <Punto expr="escucha" size={48} />
                <p className="text-[13px] text-muted mt-3">Sin conversaciones</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
