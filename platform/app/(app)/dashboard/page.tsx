import { getConversations } from "@/lib/chatwoot";
import { getAtenciones } from "@/lib/twenty";
import { getUpcomingBookings } from "@/lib/calcom";
import Punto from "@/components/punto";
import { getSession } from "@/lib/auth";

/* ----------------------------------------------------------------
   Metric Card — estilo LCD COMEX: inset shadow, mono numbers
   ---------------------------------------------------------------- */
const LCD_STYLE = {
  background: "#DCD9D3",
  boxShadow: "inset 0 1px 3px rgba(0,0,0,.12), inset 0 0 0 1px rgba(0,0,0,.04)",
  borderRadius: "var(--radius-card)",
};

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

const LCD_DARK = {
  background: "#281F18",
  boxShadow: "inset 0 1px 3px rgba(0,0,0,.25), inset 0 0 0 1px rgba(0,0,0,.12)",
  borderRadius: "var(--radius-card)",
};

function MetricCard({ label, value, unit, highlight }: MetricCardProps) {
  const dark = highlight;
  return (
    <div className="p-4" style={dark ? LCD_DARK : LCD_STYLE}>
      <div className={`text-[10.5px] font-mono uppercase tracking-[0.08em] mb-2 ${dark ? "text-[#a89e94]" : "text-muted"}`}>{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span
          className={`text-[28px] font-mono ${dark ? "text-papel" : "text-ink"}`}
          style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}
        >
          {value}
        </span>
        {unit && <span className={`text-[13px] font-mono ${dark ? "text-[#a89e94]" : "text-muted-light"}`}>{unit}</span>}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Badge — dot + label (estilo COMEX)
   ---------------------------------------------------------------- */
function Badge({ status, map }: { status: string; map: Record<string, { dot: string; text: string; label?: string }> }) {
  const style = map[status] || { dot: "bg-stone", text: "text-muted" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-badge)] text-[11px] font-semibold ${style.text}`}>
      <span className={`w-[6px] h-[6px] rounded-full ${style.dot}`} />
      {style.label || status.replace(/_/g, " ")}
    </span>
  );
}

const STATUS_MAP: Record<string, { dot: string; text: string; label?: string }> = {
  open: { dot: "bg-success", text: "text-success", label: "Abierta" },
  pending: { dot: "bg-warning", text: "text-warning", label: "Pendiente" },
  resolved: { dot: "bg-stone", text: "text-muted", label: "Resuelta" },
  PENDIENTE: { dot: "bg-warning", text: "text-warning" },
  EN_CURSO: { dot: "bg-sky", text: "text-ink" },
  AGENDADA: { dot: "bg-success", text: "text-success" },
  COMPLETADA: { dot: "bg-stone", text: "text-muted" },
  CANCELADA: { dot: "bg-error", text: "text-error" },
  DERIVADA: { dot: "bg-energia", text: "text-energia-text" },
};

export default async function DashboardPage() {
  let conversations: { data: { payload: Array<{ id: number; status: string; meta: { sender?: { name: string } }; last_activity_at: number }> } } = { data: { payload: [] } };
  let atenciones: { data: { atenciones: Array<{ id: string; estado: string; nombrePaciente: string; tipo: string; createdAt: string }> } } = { data: { atenciones: [] } };
  let bookings: { data: Array<{ id: number; title: string; start: string; attendees: Array<{ name: string }> }> } = { data: [] };

  try { conversations = await getConversations(); } catch {}
  try { atenciones = await getAtenciones(); } catch {}
  try { bookings = await getUpcomingBookings(); } catch {}

  const convos = conversations?.data?.payload || [];
  const atencionList = atenciones?.data?.atenciones || [];
  const bookingList = bookings?.data || [];

  const openConvos = convos.filter((c) => c.status === "open").length;
  const pendingAtenciones = atencionList.filter((a) => a.estado === "PENDIENTE").length;
  const agendadas = atencionList.filter((a) => a.estado === "AGENDADA").length;
  const totalAtenciones = atencionList.length;

  const session = await getSession();
  const greeting = new Date().getHours() < 12 ? "Buenos dias" : new Date().getHours() < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <div>
      {/* Greeting */}
      <div className="flex items-center gap-3 mb-6">
        <Punto expr="saluda" size={36} decor />
        <div>
          <h1 className="font-heading text-[24px] text-ink" style={{ letterSpacing: "-0.035em" }}>{greeting}, {session?.name || "equipo"}</h1>
          <p className="text-[12px] text-muted-light">Panel de control Interforma</p>
        </div>
      </div>

      {/* LCD Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <MetricCard label="Conversaciones abiertas" value={openConvos} />
        <MetricCard label="Atenciones pendientes" value={pendingAtenciones} />
        <MetricCard label="Citas agendadas" value={agendadas} />
        <MetricCard label="Proximas citas" value={bookingList.length} unit="Cal.com" highlight={bookingList.length > 0} />
      </div>

      {/* Resumen rapido */}
      <div className="flex items-center gap-4 mb-5 text-[11px] font-mono text-muted">
        <span>Total atenciones: <strong className="text-ink">{totalAtenciones}</strong></span>
        <span className="text-border">|</span>
        <span>Conversaciones: <strong className="text-ink">{convos.length}</strong></span>
        <span className="text-border">|</span>
        <span>Citas: <strong className="text-ink">{bookingList.length}</strong></span>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Conversaciones recientes */}
        <div className="bg-papel rounded-[var(--radius-card)] border border-border">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <h2 className="font-heading text-[15px] text-ink" style={{ letterSpacing: "-0.02em" }}>Conversaciones recientes</h2>
            <span className="text-[10px] font-mono text-muted-light uppercase tracking-[0.08em]">{convos.length} total</span>
          </div>
          <div className="divide-y divide-border-subtle">
            {convos.slice(0, 5).map((c) => (
              <div key={c.id} className="px-5 py-3 flex items-center justify-between hover:bg-energia-50/40 transition-colors" style={{ transitionDuration: "var(--duration-normal)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-piedra rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-muted">
                    {(c.meta?.sender?.name?.[0] || "?").toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-ink">{c.meta?.sender?.name || "Sin nombre"}</div>
                    <div className="text-[10px] font-mono text-muted-light">#{c.id}</div>
                  </div>
                </div>
                <Badge status={c.status} map={STATUS_MAP} />
              </div>
            ))}
            {convos.length === 0 && <div className="px-5 py-10 text-center"><Punto expr="escucha" size={40} /><p className="text-[12px] text-muted mt-2">Sin conversaciones</p></div>}
          </div>
        </div>

        {/* Atenciones recientes */}
        <div className="bg-papel rounded-[var(--radius-card)] border border-border">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <h2 className="font-heading text-[15px] text-ink" style={{ letterSpacing: "-0.02em" }}>Atenciones recientes</h2>
            <span className="text-[10px] font-mono text-muted-light uppercase tracking-[0.08em]">{atencionList.length} total</span>
          </div>
          <div className="divide-y divide-border-subtle">
            {atencionList.slice(0, 5).map((a) => (
              <div key={a.id} className="px-5 py-3 flex items-center justify-between hover:bg-energia-50/40 transition-colors" style={{ transitionDuration: "var(--duration-normal)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-energia-50 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-energia-text">
                    {(a.nombrePaciente?.[0] || "P").toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-ink">{a.nombrePaciente || "Paciente"}</div>
                    <div className="text-[10px] font-mono text-muted-light uppercase tracking-[0.06em]">{a.tipo?.replace(/_/g, " ")}</div>
                  </div>
                </div>
                <Badge status={a.estado} map={STATUS_MAP} />
              </div>
            ))}
            {atencionList.length === 0 && <div className="px-5 py-10 text-center"><Punto expr="piensa" size={40} /><p className="text-[12px] text-muted mt-2">Sin atenciones</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
