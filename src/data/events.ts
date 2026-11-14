import site from './site.json';

export const registrationFormNote =
  "The form asks for your child's name, your child's age, a parent's name, a contact number, and your location.";

export interface EventFields {
  title: string;
  start: Date;
  end?: Date;
  location: string;
  image?: string;
  time?: string;
  public?: boolean;
  registrationUrl?: string;
  excerpt?: string;
  seoDescription?: string;
}

/** Date-only values are stored as UTC midnight. Those events run through the end of that calendar day in IST. */
function isUtcMidnight(date: Date): boolean {
  return date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0 && date.getUTCMilliseconds() === 0;
}

export function eventEnd(data: Pick<EventFields, 'start' | 'end'>): Date {
  if (data.end) return data.end;
  if (isUtcMidnight(data.start)) {
    const y = data.start.getUTCFullYear();
    const m = String(data.start.getUTCMonth() + 1).padStart(2, '0');
    const d = String(data.start.getUTCDate()).padStart(2, '0');
    return new Date(`${y}-${m}-${d}T23:59:59+05:30`);
  }
  return data.start;
}

export function isPast(data: Pick<EventFields, 'start' | 'end'>, now = new Date()): boolean {
  return eventEnd(data).getTime() < now.getTime();
}

export function eventEndsAtIso(data: Pick<EventFields, 'start' | 'end'>): string {
  return eventEnd(data).toISOString();
}

export function formatEventDate(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  return `${get('weekday')}, ${get('day')} ${get('month')} ${get('year')}`;
}

function schemaDateTime(date: Date): string {
  if (isUtcMidnight(date)) {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}+05:30`;
}

function isCampus(location: string): boolean {
  return location.toLowerCase().includes('kaloor');
}

const campusAddress = {
  '@type': 'PostalAddress',
  streetAddress: 'Kattayil Road, Near Kaloor, Elamakara',
  addressLocality: 'Kochi',
  addressRegion: 'Kerala',
  postalCode: '682017',
  addressCountry: 'IN',
};

export function eventJsonLd(data: EventFields, url: string, now = new Date()) {
  const past = isPast(data, now);
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: data.title,
    startDate: schemaDateTime(data.start),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: data.location,
      ...(isCampus(data.location)
        ? {
            address: campusAddress,
            geo: { '@type': 'GeoCoordinates', latitude: 10.0041698, longitude: 76.2909543 },
          }
        : {}),
    },
    organizer: {
      '@type': 'Organization',
      name: site.name,
      url: 'https://thelittlegraduates.in',
    },
    description: data.seoDescription || data.excerpt || `${data.title} at ${data.location}.`,
    url,
  };
  if (data.end) schema.endDate = schemaDateTime(data.end);
  if (!past) schema.eventStatus = 'https://schema.org/EventScheduled';
  if (data.image) schema.image = new URL(data.image, 'https://thelittlegraduates.in').href;
  if (data.registrationUrl && !past) {
    schema.potentialAction = {
      '@type': 'RegisterAction',
      name: 'Register now',
      target: data.registrationUrl,
    };
  }
  return schema;
}

export function splitEvents<T extends { data: Pick<EventFields, 'start' | 'end'> }>(events: T[], now = new Date()) {
  const upcoming: T[] = [];
  const past: T[] = [];
  for (const event of events) (isPast(event.data, now) ? past : upcoming).push(event);
  upcoming.sort((a, b) => a.data.start.getTime() - b.data.start.getTime());
  past.sort((a, b) => b.data.start.getTime() - a.data.start.getTime());
  return { upcoming, past };
}
