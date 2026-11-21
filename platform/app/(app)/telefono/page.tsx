"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Punto from "@/components/punto";
import { UserAgent, Registerer, Inviter, SessionState } from "sip.js";
import type { Session } from "sip.js";

const LCD_STYLE = {
  background: "#DCD9D3",
  boxShadow: "inset 0 1px 3px rgba(0,0,0,.12), inset 0 0 0 1px rgba(0,0,0,.04)",
  borderRadius: "var(--radius-card)",
};

const LCD_DARK = {
  background: "#281F18",
  boxShadow: "inset 0 1px 3px rgba(0,0,0,.25), inset 0 0 0 1px rgba(0,0,0,.12)",
  borderRadius: "var(--radius-card)",
};

const DIAL_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

const EXTENSIONS = [
  { ext: "2001", name: "Carla", pass: "WebRTC_Carla_2026!" },
  { ext: "2002", name: "Matias", pass: "WebRTC_Matias_2026!" },
];

type CallState = "idle" | "registering" | "registered" | "calling" | "ringing" | "active" | "error";

export default function TelefonoPage() {
  const [selectedExt, setSelectedExt] = useState(0);
  const [number, setNumber] = useState("");
  const [callState, setCallState] = useState<CallState>("idle");
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");

  const uaRef = useRef<UserAgent | null>(null);
  const sessionRef = useRef<Session | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (sessionRef.current && sessionRef.current.state !== SessionState.Terminated) {
        try { (sessionRef.current as Inviter).cancel(); } catch { /* noop */ }
      }
      if (uaRef.current) {
        try { uaRef.current.stop(); } catch { /* noop */ }
      }
    };
  }, []);

  const appendDigit = useCallback((d: string) => {
    setNumber((prev) => prev + d);
  }, []);

  const handleRegister = useCallback(async () => {
    const ext = EXTENSIONS[selectedExt];
    setCallState("registering");
    setError("");

    try {
      const wsServer = process.env.NEXT_PUBLIC_WEBRTC_WSS || "wss://chat.interforma.digital/ws";
      const sipDomain = "chat.interforma.digital";

      const uri = UserAgent.makeURI(`sip:${ext.ext}@${sipDomain}`);
      if (!uri) throw new Error("URI invalida");

      const ua = new UserAgent({
        uri,
        authorizationUsername: ext.ext,
        authorizationPassword: ext.pass,
        transportOptions: { server: wsServer },
        sessionDescriptionHandlerFactoryOptions: {
          peerConnectionConfiguration: {
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
          },
        },
      });

      await ua.start();

      const registerer = new Registerer(ua);
      await registerer.register();

      uaRef.current = ua;
      setCallState("registered");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de conexion");
      setCallState("error");
    }
  }, [selectedExt]);

  const handleCall = useCallback(async () => {
    if (!uaRef.current || !number.trim()) return;

    const sipDomain = "chat.interforma.digital";
    const target = UserAgent.makeURI(`sip:${number}@${sipDomain}`);
    if (!target) return;

    setCallState("calling");
    setError("");

    const inviter = new Inviter(uaRef.current, target, {
      sessionDescriptionHandlerOptions: {
        constraints: { audio: true, video: false },
      },
    });

    inviter.stateChange.addListener((state: SessionState) => {
      switch (state) {
        case SessionState.Establishing:
          setCallState("ringing");
          break;
        case SessionState.Established: {
          setCallState("active");
          setDuration(0);
          timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);

          // Attach remote audio
          const remoteStream = new MediaStream();
          const pc = (inviter.sessionDescriptionHandler as unknown as { peerConnection: RTCPeerConnection })?.peerConnection;
          if (pc) {
            pc.getReceivers().forEach((receiver) => {
              if (receiver.track) remoteStream.addTrack(receiver.track);
            });
          }
          if (audioRef.current) {
            audioRef.current.srcObject = remoteStream;
            audioRef.current.play().catch(() => {});
          }
          break;
        }
        case SessionState.Terminated:
          setCallState("registered");
          if (timerRef.current) clearInterval(timerRef.current);
          setDuration(0);
          break;
      }
    });

    try {
      await inviter.invite();
      sessionRef.current = inviter;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al llamar");
      setCallState("registered");
    }
  }, [number]);

  const handleHangup = useCallback(() => {
    if (!sessionRef.current) return;
    try {
      if (sessionRef.current.state === SessionState.Established) {
        sessionRef.current.bye();
      } else {
        (sessionRef.current as Inviter).cancel();
      }
    } catch { /* noop */ }
    sessionRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    setDuration(0);
    setCallState("registered");
  }, []);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const isInCall = callState === "calling" || callState === "ringing" || callState === "active";
  const canDial = callState === "registered" && number.trim().length > 0;

  const puntoExpr = callState === "active" ? "celebra" : callState === "calling" || callState === "ringing" ? "atento" : callState === "error" ? "uy" : "escucha";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-[24px] text-ink" style={{ letterSpacing: "-0.035em" }}>Telefono</h1>
        <span className="text-[10px] font-mono text-muted-light uppercase tracking-[0.08em]">
          {callState === "registered" ? "Conectado" : callState === "active" ? "En llamada" : callState === "registering" ? "Conectando..." : "Desconectado"}
        </span>
      </div>

      {/* Hidden audio element for remote stream */}
      <audio ref={audioRef} autoPlay />

      <div className="max-w-[400px] mx-auto">
        {/* Status card */}
        <div className="p-6 mb-4 text-center" style={LCD_DARK}>
          <Punto expr={puntoExpr} size={48} decor />

          {/* Number display */}
          <div
            className="mt-4 text-[32px] font-mono text-papel min-h-[42px]"
            style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500, letterSpacing: "0.06em", lineHeight: 1 }}
          >
            {number || (isInCall ? EXTENSIONS[selectedExt].ext : "\u00A0")}
          </div>

          {/* Call state label */}
          <div className="mt-2 text-[11px] font-mono text-[#a89e94] uppercase tracking-[0.08em]">
            {callState === "active" && formatDuration(duration)}
            {callState === "calling" && "Marcando..."}
            {callState === "ringing" && "Sonando..."}
            {callState === "registered" && "Listo para llamar"}
            {callState === "idle" && "Seleccione extension"}
            {callState === "registering" && "Registrando..."}
            {callState === "error" && (error || "Error")}
          </div>
        </div>

        {/* Extension selector — only when not registered */}
        {(callState === "idle" || callState === "error") && (
          <div className="mb-4">
            <div className="text-[10.5px] font-mono text-muted uppercase tracking-[0.08em] mb-2">Extension</div>
            <div className="grid grid-cols-2 gap-2">
              {EXTENSIONS.map((ext, i) => (
                <button
                  key={ext.ext}
                  onClick={() => setSelectedExt(i)}
                  className={`p-3 text-left transition-colors ${selectedExt === i ? "border-2 border-energia" : "border border-border"}`}
                  style={{ ...LCD_STYLE, borderColor: selectedExt === i ? "var(--brand-500)" : undefined }}
                >
                  <div className="text-[10px] font-mono text-muted uppercase tracking-[0.08em]">{ext.name}</div>
                  <div className="text-[20px] font-mono text-ink" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{ext.ext}</div>
                </button>
              ))}
            </div>
            <button
              onClick={handleRegister}
              className="w-full mt-3 py-3 bg-energia text-ink font-semibold text-[13px] rounded-[var(--radius-btn)] hover:brightness-95 transition-all"
            >
              Conectar
            </button>
          </div>
        )}

        {/* Dialpad — when registered or in call */}
        {(callState === "registered" || isInCall) && (
          <>
            <div className="p-4" style={LCD_STYLE}>
              {/* Input display */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#c5c1bb]">
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Ingrese numero"
                  disabled={isInCall}
                  className="flex-1 bg-transparent text-[20px] font-mono text-ink outline-none placeholder:text-[#b5b0a9]"
                  style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em" }}
                />
                {number && !isInCall && (
                  <button
                    onClick={() => setNumber((prev) => prev.slice(0, -1))}
                    className="text-[12px] font-mono text-muted hover:text-ink transition-colors px-2"
                  >
                    DEL
                  </button>
                )}
              </div>

              {/* Number grid */}
              <div className="grid grid-cols-3 gap-2">
                {DIAL_KEYS.flat().map((key) => (
                  <button
                    key={key}
                    onClick={() => appendDigit(key)}
                    disabled={isInCall}
                    className="py-3.5 text-[20px] font-mono font-medium text-ink rounded-[var(--radius-btn)] hover:bg-[#ccc8c1] active:bg-[#c0bbb4] transition-colors disabled:opacity-40"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* Call / Hangup buttons */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {!isInCall ? (
                <>
                  <button
                    onClick={() => {
                      if (uaRef.current) { uaRef.current.stop().catch(() => {}); uaRef.current = null; }
                      setCallState("idle");
                      setNumber("");
                    }}
                    className="py-3 bg-piedra text-muted font-semibold text-[13px] rounded-[var(--radius-btn)] hover:bg-stone/30 transition-colors"
                  >
                    Desconectar
                  </button>
                  <button
                    onClick={handleCall}
                    disabled={!canDial}
                    className="py-3 bg-success text-white font-semibold text-[13px] rounded-[var(--radius-btn)] hover:brightness-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Llamar
                  </button>
                </>
              ) : (
                <>
                  <div />
                  <button
                    onClick={handleHangup}
                    className="py-3 bg-error text-white font-semibold text-[13px] rounded-[var(--radius-btn)] hover:brightness-95 transition-all"
                  >
                    Colgar
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
