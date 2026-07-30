import { useEffect, useRef, useState } from "react";
import api from "../api/client";
import socket from "../socket";
import { useAuth } from "../context/AuthContext";

const TIMELINE_STEPS = [
  { key: "pending", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "picked", label: "Out for pickup" },
  { key: "completed", label: "Picked up" },
];

// Where does a given request status sit on the 4-step timeline above?
// rejected/cancelled aren't on the happy path so they're handled separately.
function stepIndexFor(status) {
  const idx = TIMELINE_STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

export function RequestTimeline({ status }) {
  if (status === "rejected" || status === "cancelled") {
    return (
      <p className="text-sm font-semibold capitalize text-signal-600">{status}</p>
    );
  }

  const activeIdx = stepIndexFor(status);

  return (
    <div className="flex items-center gap-2">
      {TIMELINE_STEPS.map((step, i) => (
        <div key={step.key} className="flex flex-1 items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                i <= activeIdx ? "bg-canopy text-paper" : "bg-canopy-50 text-ink/30"
              }`}
            >
              {i < activeIdx ? "✓" : i + 1}
            </span>
            <span className={`whitespace-nowrap text-[10px] ${i <= activeIdx ? "font-semibold text-canopy-600" : "text-ink/40"}`}>
              {step.label}
            </span>
          </div>
          {i < TIMELINE_STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 ${i < activeIdx ? "bg-canopy" : "bg-canopy-50"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// A chat + timeline panel scoped to a single request, shared by donor and
// receiver dashboards. Loads history over REST, then stays live over socket.io.
export default function ChatPanel({ request, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get(`/requests/${request._id}/messages`).then((res) => {
      if (active) setMessages(res.data.messages);
    }).finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [request._id]);

  useEffect(() => {
    const handler = ({ requestId, message }) => {
      if (requestId !== request._id) return;
      setMessages((prev) => [...prev, message]);
    };
    socket.on("chat_message", handler);
    return () => socket.off("chat_message", handler);
  }, [request._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const res = await api.post(`/requests/${request._id}/messages`, { text });
      // The socket event also delivers this to us, but adding it immediately
      // keeps the sender's own UI from waiting on the round trip.
      setMessages((prev) => (prev.some((m) => m._id === res.data.message._id) ? prev : [...prev, res.data.message]));
      setText("");
    } catch (err) {
      alert(err.response?.data?.message || "Could not send message");
    } finally {
      setSending(false);
    }
  };

  const otherPartyName =
    user?.role === "donor" ? request.ngo?.organizationName : request.restaurant?.restaurantName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl2 bg-paper shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-mint p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-lg font-semibold text-ink">{request.food?.title}</p>
              <p className="text-sm text-ink/60">Chat with {otherPartyName || "the other party"}</p>
            </div>
            <button onClick={onClose} className="text-ink/40 hover:text-ink">✕</button>
          </div>
          <div className="mt-4">
            <RequestTimeline status={request.status} />
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {loading ? (
            <p className="text-center text-sm text-ink/40">Loading conversation...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-sm text-ink/40">No messages yet — say hello!</p>
          ) : (
            messages.map((m) => {
              if (m.system) {
                return (
                  <div key={m._id} className="text-center text-xs font-medium text-canopy-600">
                    {m.text}
                  </div>
                );
              }
              const isMine = m.sender?._id === (user?.id || user?._id);
              return (
                <div key={m._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-xl2 px-4 py-2 text-sm ${
                      isMine ? "bg-canopy text-paper" : "bg-canopy-50 text-ink"
                    }`}
                  >
                    <p>{m.text}</p>
                    <p className={`mt-1 text-[10px] ${isMine ? "text-paper/60" : "text-ink/40"}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} className="flex gap-2 border-t border-mint p-4">
          <input
            className="input-field flex-1"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" disabled={sending} className="btn-primary !px-5 !py-2 text-sm">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
