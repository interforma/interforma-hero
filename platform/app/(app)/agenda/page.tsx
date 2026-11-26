import { getUpcomingBookings } from "@/lib/calcom";
import Punto from "@/components/punto";

const LCD_STYLE = {
  background: "#DCD9D3",
  boxShadow: "inset 0 1px 3px rgba(0,0,0,.12), inset 0 0 0 1px rgba(0,0,0,.04)",
  borderRadius: "var(--radius-card)",
};

export default async function AgendaPage() {
  let bookings: Array<{
    id: number;
    title: string;
    start: string;
    end: string;
    status: string;
    attendees: Array<{ name: string; email: string }>;
    metadata?: Record<string, string>;
  }> = [];

  try {
    const res = await getUpcomingBookings();
    bookings = res?.data || [];
  } catch {}

  const confirmed = bookings.filter((b) => b.status === "accepted").length;

  const byDate: Record<string, typeof bookings> = {};
  for (const b of bookings) {
    const dateKey = new Date(b.start).toLocaleDateString("es-CL", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    if (!byDate[dateKey]) byDate[dateKey] = [];
    byDate[dateKey].push(b);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-[24px] text-ink" style={{ letterSpacing: "-0.035em" }}>Agenda</h1>
        <span className="text-[10px] font-mono text-muted-light uppercase tracking-[0.08em]">{bookings.length} proximas</span>
      </div>

      {/* LCD summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4" style={LCD_STYLE}>
          <div className="text-[10.5px] font-mono text-muted uppercase tracking-[0.08em] mb-2">Citas proximas</div>
          <span className="text-[28px] font-mono text-ink" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}>
            {bookings.length}
          </span>
        </div>
        <div className="p-4" style={LCD_STYLE}>
          <div className="text-[10.5px] font-mono text-muted uppercase tracking-[0.08em] mb-2">Confirmadas</div>
          <span className="text-[28px] font-mono text-ink" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}>
            {confirmed}
          </span>
        </div>
        <div className="p-4" style={LCD_STYLE}>
          <div className="text-[10.5px] font-mono text-muted uppercase tracking-[0.08em] mb-2">Dias con citas</div>
          <span className="text-[28px] font-mono text-ink" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}>
            {Object.keys(byDate).length}
          </span>
        </div>
      </div>

      {Object.entries(byDate).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(byDate).map(([date, dayBookings]) => (
            <div key={date}>
              <h2 className="text-[10.5px] font-mono font-medium text-muted uppercase tracking-[0.08em] mb-3 capitalize">{date}</h2>
              <div className="space-y-2">
                {dayBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-papel border border-border rounded-[var(--radius-card)] p-4 flex items-start gap-4 hover:bg-[#f7f6f3] transition-colors"
                    style={{ transitionDuration: "var(--duration-normal)" }}
                  >
                    <div className="text-center min-w-[56px] py-2 px-2 rounded-[var(--radius-btn)]" style={LCD_STYLE}>
                      <div
                        className="text-[16px] font-mono font-medium text-ink"
                        style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}
                      >
                        {new Date(b.start).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hour12: false })}
                      </div>
                      <div className="text-[10px] text-muted-light font-mono" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {new Date(b.end).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hour12: false })}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-ink">{b.title}</div>
                      <div className="text-[12px] text-muted mt-0.5">
                        {b.attendees?.map((a) => a.name).join(", ") || "Sin asistentes"}
                      </div>
                      {b.metadata?.service && (
                        <span className="inline-flex mt-1.5 px-2 py-0.5 bg-energia-50 text-energia-text text-[10px] font-semibold rounded-[var(--radius-badge)]">
                          {b.metadata.service}
                        </span>
                      )}
                    </div>
                    <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[var(--radius-badge)] text-[10px] font-semibold ${
                      b.status === "accepted" ? "text-success" : "text-warning"
                    }`}>
                      <span className={`w-[6px] h-[6px] rounded-full ${b.status === "accepted" ? "bg-success" : "bg-warning"}`} />
                      {b.status === "accepted" ? "Confirmada" : b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-papel border border-border rounded-[var(--radius-card-lg)] p-16 text-center flex flex-col items-center">
          <Punto expr="duerme" size={48} decor />
          <p className="text-[13px] text-muted mt-3">Sin citas programadas</p>
        </div>
      )}
    </div>
  );
}
