"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Punto from "@/components/punto";
import { UserAgent, Registerer, Inviter, SessionState } from "sip.js";
import type { Session, Invitation } from "sip.js";

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

const QUICK_DIAL = [
  { label: "IVR 600", number: "600" },
  { label: "Carla", number: "2001" },
  { label: "Matias", number: "2002" },
];

type CallState = "idle" | "registering" | "registered" | "calling" | "ringing" | "active" | "incoming" | "error";

interface CallLogEntry {
  id: number;
  type: "outgoing" | "incoming" | "missed";
  number: string;
  time: Date;
  duration: number;
}

export default function TelefonoPage() {
  const [selectedExt, setSelectedExt] = useState(0);
  const [number, setNumber] = useState("");
  const [callState, setCallState] = useState<CallState>("idle");
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  const [callLog, setCallLog] = useState<CallLogEntry[]>([]);
  const [incomingFrom, setIncomingFrom] = useState("");

  const uaRef = useRef<UserAgent | null>(null);
  const sessionRef = useRef<Session | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  const callStartRef = useRef<Date | null>(null);
  const logIdRef = useRef(0);

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

  const addCallLog = useCallback((type: CallLogEntry["type"], num: string, dur: number) => {
    logIdRef.current += 1;
    setCallLog((prev) => [{ id: logIdRef.current, type, number: num, time: new Date(), duration: dur }, ...prev].slice(0, 20));
  }, []);

  const attachAudio = useCallback((session: Session) => {
    const remoteStream = new MediaStream();
    const pc = (session.sessionDescriptionHandler as unknown as { peerConnection: RTCPeerConnection })?.peerConnection;
    if (pc) {
      pc.getReceivers().forEach((receiver) => {
        if (receiver.track) remoteStream.addTrack(receiver.track);
      });
    }
    if (audioRef.current) {
      audioRef.current.srcObject = remoteStream;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const stopRingtone = useCallback(() => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  }, []);

  const playRingtone = useCallback(() => {
    if (ringtoneRef.current) {
      ringtoneRef.current.loop = true;
      ringtoneRef.current.play().catch(() => {});
    }
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
        delegate: {
          onInvite: (invitation: Invitation) => {
            const caller = invitation.remoteIdentity.uri.user || "Desconocido";
            setIncomingFrom(caller);
            setCallState("incoming");
            sessionRef.current = invitation;
            playRingtone();

            invitation.stateChange.addListener((state: SessionState) => {
              switch (state) {
                case SessionState.Established:
                  stopRingtone();
                  setCallState("active");
                  setDuration(0);
                  callStartRef.current = new Date();
                  timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
                  attachAudio(invitation);
                  break;
                case SessionState.Terminated:
                  stopRingtone();
                  if (callStartRef.current) {
                    const dur = Math.round((Date.now() - callStartRef.current.getTime()) / 1000);
                    addCallLog("incoming", caller, dur);
                  } else {
                    addCallLog("missed", caller, 0);
                  }
                  callStartRef.current = null;
                  if (timerRef.current) clearInterval(timerRef.current);
                  setDuration(0);
                  setCallState("registered");
                  setIncomingFrom("");
                  sessionRef.current = null;
                  break;
              }
            });
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
  }, [selectedExt, attachAudio, addCallLog, playRingtone, stopRingtone]);

  const handleCall = useCallback(async () => {
    if (!uaRef.current || !number.trim()) return;

    const sipDomain = "chat.interforma.digital";
    const target = UserAgent.makeURI(`sip:${number}@${sipDomain}`);
    if (!target) return;

    setCallState("calling");
    setError("");
    const calledNumber = number;

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
        case SessionState.Established:
          setCallState("active");
          setDuration(0);
          callStartRef.current = new Date();
          timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
          attachAudio(inviter);
          break;
        case SessionState.Terminated: {
          const dur = callStartRef.current ? Math.round((Date.now() - callStartRef.current.getTime()) / 1000) : 0;
          addCallLog("outgoing", calledNumber, dur);
          callStartRef.current = null;
          setCallState("registered");
          if (timerRef.current) clearInterval(timerRef.current);
          setDuration(0);
          sessionRef.current = null;
          break;
        }
      }
    });

    try {
      await inviter.invite();
      sessionRef.current = inviter;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al llamar");
      setCallState("registered");
    }
  }, [number, attachAudio, addCallLog]);

  const handleHangup = useCallback(() => {
    if (!sessionRef.current) return;
    stopRingtone();
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
    setIncomingFrom("");
  }, [stopRingtone]);

  const handleAnswer = useCallback(async () => {
    if (!sessionRef.current) return;
    stopRingtone();
    try {
      await (sessionRef.current as Invitation).accept({
        sessionDescriptionHandlerOptions: {
          constraints: { audio: true, video: false },
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al contestar");
      setCallState("registered");
    }
  }, [stopRingtone]);

  const handleReject = useCallback(() => {
    if (!sessionRef.current) return;
    stopRingtone();
    try {
      (sessionRef.current as Invitation).reject();
    } catch { /* noop */ }
    sessionRef.current = null;
    setCallState("registered");
    setIncomingFrom("");
  }, [stopRingtone]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const formatTime = (d: Date) => {
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const isInCall = callState === "calling" || callState === "ringing" || callState === "active";
  const canDial = callState === "registered" && number.trim().length > 0;

  const puntoExpr = callState === "active" ? "celebra"
    : callState === "incoming" ? "atento"
    : callState === "calling" || callState === "ringing" ? "piensa"
    : callState === "error" ? "uy"
    : callState === "registered" ? "escucha"
    : "duerme";

  const statusLabel = callState === "registered" ? "Conectado"
    : callState === "active" ? "En llamada"
    : callState === "registering" ? "Conectando..."
    : callState === "incoming" ? "Llamada entrante"
    : "Desconectado";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-[24px] text-ink" style={{ letterSpacing: "-0.035em" }}>Telefono</h1>
        <div className="flex items-center gap-2">
          {callState === "registered" && (
            <span className="inline-block w-2 h-2 rounded-full bg-success" />
          )}
          {callState === "active" && (
            <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse" />
          )}
          {callState === "incoming" && (
            <span className="inline-block w-2 h-2 rounded-full bg-energia animate-pulse" />
          )}
          <span className="text-[10px] font-mono text-muted-light uppercase tracking-[0.08em]">
            {statusLabel}
            {(callState === "registered" || isInCall || callState === "incoming") && ` / ${EXTENSIONS[selectedExt].name} (${EXTENSIONS[selectedExt].ext})`}
          </span>
        </div>
      </div>

      <audio ref={audioRef} autoPlay />
      {/* Simple ringtone using Web Audio - fallback beep */}
      <audio ref={ringtoneRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==" />

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
        {/* Left: Phone */}
        <div>
          {/* Status card */}
          <div className="p-6 mb-4 text-center" style={LCD_DARK}>
            <Punto expr={puntoExpr} size={48} decor />

            <div
              className="mt-4 text-[32px] font-mono text-papel min-h-[42px]"
              style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500, letterSpacing: "0.06em", lineHeight: 1 }}
            >
              {callState === "incoming" ? incomingFrom : (number || (isInCall ? EXTENSIONS[selectedExt].ext : "\u00A0"))}
            </div>

            <div className="mt-2 text-[11px] font-mono text-[#a89e94] uppercase tracking-[0.08em]">
              {callState === "active" && formatDuration(duration)}
              {callState === "calling" && "Marcando..."}
              {callState === "ringing" && "Sonando..."}
              {callState === "incoming" && "Llamada entrante..."}
              {callState === "registered" && "Listo para llamar"}
              {callState === "idle" && "Seleccione extension"}
              {callState === "registering" && "Registrando..."}
              {callState === "error" && (error || "Error")}
            </div>
          </div>

          {/* Incoming call buttons */}
          {callState === "incoming" && (
            <div className="mb-4 grid grid-cols-2 gap-3">
              <button
                onClick={handleReject}
                className="py-3.5 bg-error text-white font-semibold text-[13px] rounded-[var(--radius-btn)] hover:brightness-95 transition-all"
              >
                Rechazar
              </button>
              <button
                onClick={handleAnswer}
                className="py-3.5 bg-success text-white font-semibold text-[13px] rounded-[var(--radius-btn)] hover:brightness-95 transition-all animate-pulse"
              >
                Contestar
              </button>
            </div>
          )}

          {/* Extension selector */}
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

          {/* Dialpad */}
          {(callState === "registered" || isInCall) && (
            <>
              {/* Quick dial */}
              {callState === "registered" && (
                <div className="flex gap-2 mb-3">
                  {QUICK_DIAL.filter(q => q.number !== EXTENSIONS[selectedExt].ext).map((q) => (
                    <button
                      key={q.number}
                      onClick={() => { setNumber(q.number); }}
                      className="flex-1 py-2 text-[11px] font-mono text-muted border border-border rounded-[var(--radius-btn)] hover:bg-piedra/50 transition-colors"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="p-4" style={LCD_STYLE}>
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

        {/* Right: Call log */}
        <div>
          <div className="text-[10.5px] font-mono text-muted uppercase tracking-[0.08em] mb-3">Historial de llamadas</div>
          {callLog.length === 0 ? (
            <div className="p-8 text-center border border-border rounded-[var(--radius-card)]" style={{ background: "var(--papel)" }}>
              <div className="text-[12px] font-mono text-muted">Sin llamadas registradas</div>
              <div className="text-[11px] font-mono text-muted-light mt-1">Las llamadas apareceran aqui</div>
            </div>
          ) : (
            <div className="border border-border rounded-[var(--radius-card)] overflow-hidden" style={{ background: "var(--papel)" }}>
              {callLog.map((entry, i) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-mono ${
                      entry.type === "outgoing" ? "bg-cielo text-ink" :
                      entry.type === "incoming" ? "bg-success/15 text-success" :
                      "bg-error/15 text-error"
                    }`}>
                      {entry.type === "outgoing" ? (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : entry.type === "incoming" ? (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M9 1L1 9M1 9H7M1 9V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2L8 8M2 8L8 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      )}
                    </div>
                    <div>
                      <div className="text-[13px] font-mono text-ink" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {entry.number}
                      </div>
                      <div className="text-[10px] font-mono text-muted-light">
                        {entry.type === "outgoing" ? "Saliente" : entry.type === "incoming" ? "Entrante" : "Perdida"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-mono text-muted" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {formatTime(entry.time)}
                    </div>
                    {entry.duration > 0 && (
                      <div className="text-[10px] font-mono text-muted-light" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {formatDuration(entry.duration)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
