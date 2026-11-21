const API_KEY = process.env.CALCOM_API_KEY || "";

async function calFetch(path: string, version = "2024-08-13") {
  const res = await fetch(`https://api.cal.com/v2${path}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "cal-api-version": version,
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Cal.com ${res.status}: ${await res.text()}`);
  return res.json();
}

export interface Booking {
  id: number;
  title: string;
  start: string;
  end: string;
  status: string;
  attendees: Array<{ name: string; email: string; timeZone: string }>;
  metadata?: Record<string, string>;
}

export async function getUpcomingBookings(): Promise<{ data: Booking[] }> {
  return calFetch("/bookings?status=upcoming&take=20");
}

export async function getBookings(status = "upcoming", take = 20): Promise<{ data: Booking[] }> {
  return calFetch(`/bookings?status=${status}&take=${take}`);
}
