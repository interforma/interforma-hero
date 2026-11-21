const BASE = process.env.CHATWOOT_URL || "https://chat.interforma.digital";
const TOKEN = process.env.CHATWOOT_API_TOKEN || "";
const ACCOUNT_ID = process.env.CHATWOOT_ACCOUNT_ID || "2";

async function chatwootFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE}/api/v1/accounts/${ACCOUNT_ID}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`Chatwoot ${res.status}: ${await res.text()}`);
  return res.json();
}

export interface Conversation {
  id: number;
  inbox_id: number;
  status: string;
  meta: {
    sender?: { name: string; phone_number?: string; thumbnail?: string };
    channel?: string;
  };
  messages?: Array<{ content: string; message_type: number; created_at: number }>;
  created_at: number;
  last_activity_at: number;
  unread_count: number;
}

export async function getConversations(status = "open"): Promise<{ data: { payload: Conversation[] } }> {
  return chatwootFetch(`/conversations?status=${status}&page=1`);
}

export async function getConversationCount(): Promise<{ data: Record<string, number> }> {
  return chatwootFetch("/conversations/meta");
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  availability_status: string;
}

export async function getAgents(): Promise<Agent[]> {
  return chatwootFetch("/agents");
}
