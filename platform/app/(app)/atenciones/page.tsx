import { getConversations, type Conversation } from "@/lib/chatwoot";
import { getUpcomingBookings } from "@/lib/calcom";
import Punto from "@/components/punto";

const LCD_STYLE = {
  background: "#DCD9D3",
  boxShadow: "inset 0 1px 3px rgba(0,0,0,.12), inset 0 0 0 1px rgba(0,0,0,.04)",
  borderRadius: "var(--radius-card)",
};

const ESTADO_COLUMNS = [
  { key: "PENDIENTE", label: "Pendiente", dot: "bg-warning" },
  { key: "EN_CURSO", label: "En curso", dot: "bg-sky" },
  { key: "AGENDADA", label: "Agendada", dot: "bg-success" },
  { key: "COMPLETADA", label: "Completada", dot: "bg-stone" },
  { key: "CANCELADA", label: "Cancelada", dot: "bg-error" },
  { key: "DERIVADA", label: "Derivada", dot: "bg-energia" },
];

const TIPO_STYLES: Record<string, string> = {
  WHATSAPP: "bg-success-bg text-success",
  LLAMADA: "bg-sky/30 text-ink",
  AGENDAMIENTO: "bg-energia-50 text-energia-text",
  REAGENDAMIENTO: "bg-warning-bg text-warning",
  CANCELACION: "bg-error-bg text-error",
  SEGUIMIENTO: "bg-piedra text-muted",
};

interface DerivedAtencion {
  id: string;
  tipo: string;
  servicio: string;
  estado: string;
  canal: string;
  nombrePaciente: string;
  telefonoPaciente: string;
  resumen: string;
  createdAt: string;
}

function deriveEstado(conv: Conversation, lastMsg: string): string {
  const lower = lastMsg.toLowerCase();
  if (lower.includes("agendada con exito") || lower.includes("hora ha sido agendada")) return "AGENDADA";
  if (lower.includes("reagendar") || lower.includes("cambiar")) return "PENDIENTE";
  if (lower.includes("cancelar") || lower.includes("cancelada")) return "CANCELADA";
  if (lower.includes("ejecutivo") || lower.includes("escalate")) return "DERIVADA";
  if (conv.status === "resolved") return "COMPLETADA";
  if (conv.status === "pending") return "PENDIENTE";
  return "EN_CURSO";
}

function deriveServicio(lastMsg: string): string {
  const lower = lastMsg.toLowerCase();
  if (lower.includes("kinesiolog")) return "Kinesiologia";
  if (lower.includes("enfermer")) return "Enfermeria";
  if (lower.includes("fonoaudiolog")) return "Fonoaudiologia";
  if (lower.includes("terapia ocupacional")) return "Terapia ocupacional";
  if (lower.includes("adulto mayor") || lower.includes("cuidado")) return "Cuidados adulto mayor";
  if (lower.includes("control medico") || lower.includes("medico")) return "Control medico";
  if (lower.includes("atencion domicili")) return "Atencion domiciliaria";
  return "Consulta general";
}

function deriveTipo(lastMsg: string, estado: string): string {
  if (estado === "AGENDADA") return "AGENDAMIENTO";
  const lower = lastMsg.toLowerCase();
  if (lower.includes("reagendar")) return "REAGENDAMIENTO";
  if (lower.includes("cancelar")) return "CANCELACION";
  return "WHATSAPP";
}

export default async function AtencionesPage() {
  let conversations: Conversation[] = [];
  let bookingCount = 0;

  try {
    const res = await getConversations("all");
    conversations = res?.data?.payload || [];
  } catch {}

  try {
    const bk = await getUpcomingBookings();
    bookingCount = bk?.data?.length || 0;
  } catch {}

  // Derive atenciones from conversations
  const atencionList: DerivedAtencion[] = conversations.map((conv) => {
    const lastMsg = conv.messages?.[0]?.content || "";
    const estado = deriveEstado(conv, lastMsg);
    const servicio = deriveServicio(lastMsg);
    const tipo = deriveTipo(lastMsg, estado);
    const sender = conv.meta?.sender;

    return {
      id: String(conv.id),
      tipo,
      servicio,
      estado,
      canal: "WhatsApp",
      nombrePaciente: sender?.name || "Paciente",
      telefonoPaciente: sender?.phone_number || "",
      resumen: lastMsg.length > 120 ? lastMsg.slice(0, 120) + "..." : lastMsg,
      createdAt: new Date(conv.created_at * 1000).toISOString(),
    };
  });

  const grouped = ESTADO_COLUMNS.map((col) => ({
    ...col,
    items: atencionList.filter((a) => a.estado === col.key),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-[24px] text-ink" style={{ letterSpacing: "-0.035em" }}>Atenciones</h1>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-muted-light uppercase tracking-[0.08em]">{atencionList.length} total</span>
          {bookingCount > 0 && (
            <span className="text-[10px] font-mono text-success uppercase tracking-[0.08em]">{bookingCount} citas Cal.com</span>
          )}
        </div>
      </div>

      {/* LCD summary counters */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {grouped.map((col) => (
          <div key={col.key} className="p-3" style={LCD_STYLE}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className={`w-[6px] h-[6px] rounded-full ${col.dot}`} />
              <span className="text-[9px] font-mono text-muted uppercase tracking-[0.08em]">{col.label}</span>
            </div>
            <span
              className="text-[24px] font-mono text-ink"
              style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}
            >
              {col.items.length}
            </span>
          </div>
        ))}
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {grouped.map((col) => (
          <div key={col.key} className="min-w-[260px] w-[260px] flex-shrink-0">
            {/* Column header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className={`w-[6px] h-[6px] rounded-full ${col.dot}`} />
              <span className="text-[10.5px] font-mono font-medium text-ink uppercase tracking-[0.08em]">{col.label}</span>
              <span
                className="text-[10px] text-muted-light font-mono ml-auto px-1.5 py-0.5 rounded-full"
                style={{ background: "#DCD9D3" }}
              >
                {col.items.length}
              </span>
            </div>
            {/* Cards */}
            <div className="space-y-2">
              {col.items.map((a) => (
                <div
                  key={a.id}
                  className="bg-papel border border-border rounded-[var(--radius-card)] p-3.5 hover:bg-[#f7f6f3] transition-colors"
                  style={{ transitionDuration: "var(--duration-normal)" }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-energia-50 rounded-full flex items-center justify-center text-[8px] font-mono font-bold text-energia-text shrink-0">
                        {(a.nombrePaciente?.[0] || "P").toUpperCase()}
                      </div>
                      <span className="text-[13px] font-medium text-ink leading-tight">{a.nombrePaciente}</span>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-[var(--radius-badge)] text-[10px] font-semibold ${TIPO_STYLES[a.tipo] || "bg-piedra text-muted"}`}>
                      {a.tipo?.replace(/_/g, " ")}
                    </span>
                  </div>
                  {a.servicio && (
                    <div className="text-[11px] text-muted mb-1 pl-7">{a.servicio}</div>
                  )}
                  {a.resumen && (
                    <p className="text-[11px] text-muted-light leading-relaxed line-clamp-2 pl-7">{a.resumen}</p>
                  )}
                  <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-border-subtle">
                    <span className="text-[10px] text-muted-light font-mono" style={{ fontVariantNumeric: "tabular-nums" }}>{a.telefonoPaciente || ""}</span>
                    <span className="text-[10px] text-muted-light font-mono" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {new Date(a.createdAt).toLocaleDateString("es-CL")}
                    </span>
                  </div>
                </div>
              ))}
              {col.items.length === 0 && (
                <div className="text-center py-8 text-[11px] text-muted-light font-mono border border-dashed border-border rounded-[var(--radius-card)]">
                  Sin atenciones
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {atencionList.length === 0 && (
        <div className="bg-papel border border-border rounded-[var(--radius-card-lg)] p-16 text-center flex flex-col items-center">
          <Punto expr="escucha" size={48} decor />
          <p className="text-[13px] text-muted mt-3">Sin atenciones registradas</p>
        </div>
      )}
    </div>
  );
}
