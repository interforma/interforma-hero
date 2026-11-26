const BASE = process.env.TWENTY_URL || "https://crm.interforma.digital";
const TOKEN = process.env.TWENTY_API_TOKEN || "";

async function twentyFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE}/rest${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`Twenty ${res.status}: ${await res.text()}`);
  return res.json();
}

export interface Person {
  id: string;
  name?: { firstName?: string; lastName?: string };
  phones?: { primaryPhoneNumber?: string };
  emails?: { primaryEmail?: string };
  company?: { name?: string };
  createdAt: string;
}

export async function getPeople(limit = 50): Promise<{ data: { people: Person[] } }> {
  return twentyFetch(`/people?limit=${limit}&orderBy=createdAt[AscNullsLast]`);
}

export interface Atencion {
  id: string;
  name: string;
  tipo: string;
  servicio: string;
  estado: string;
  canal: string;
  fechaAtencion: string;
  resumen: string;
  telefonoPaciente: string;
  nombrePaciente: string;
  createdAt: string;
}

export async function getAtenciones(limit = 50): Promise<{ data: { atenciones: Atencion[] } }> {
  return twentyFetch(`/atenciones?limit=${limit}&orderBy=createdAt[AscNullsLast]`);
}

export interface Opportunity {
  id: string;
  name: string;
  stage: string;
  amount?: { amountMicros?: number; currencyCode?: string };
  createdAt: string;
}

export async function getOpportunities(limit = 20): Promise<{ data: { opportunities: Opportunity[] } }> {
  return twentyFetch(`/opportunities?limit=${limit}`);
}
