import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { emailStyles } from "@/lib/email/styles.ts";

export const bookingConfirmationSubject =
  "Booking Inquiry Received — Goregaon Sports Club";

type BookingType = "room" | "banquet" | "ground" | "coaching";

export interface BookingConfirmationEmailData {
  bookingType: BookingType;
  checkIn?: string;
  checkOut?: string;
  coachingLevel?: string;
  coachingSport?: string;
  email: string;
  eventDate?: string;
  eventType?: string;
  groundDate?: string;
  groundTime?: string;
  guestCount?: number;
  guests?: number;
  hallPreference?: string;
  message?: string;
  name: string;
  phone: string;
  roomType?: string;
  sport?: string;
}

interface BookingConfirmationEmailProps {
  data: BookingConfirmationEmailData;
}

const bookingTypeLabels: Record<BookingType, string> = {
  banquet: "Banquet Hall",
  coaching: "Coaching",
  ground: "Ground / Court",
  room: "Room",
};

type BookingFieldKey = keyof Omit<
  BookingConfirmationEmailData,
  "bookingType" | "name" | "email" | "phone" | "message"
>;

const FIELD_SPECS: Record<
  BookingType,
  { key: BookingFieldKey; label: string }[]
> = {
  banquet: [
    { key: "hallPreference", label: "Hall Preference" },
    { key: "eventType", label: "Event Type" },
    { key: "guestCount", label: "Guest Count" },
    { key: "eventDate", label: "Event Date" },
  ],
  coaching: [
    { key: "coachingSport", label: "Sport" },
    { key: "coachingLevel", label: "Level" },
  ],
  ground: [
    { key: "sport", label: "Sport" },
    { key: "groundDate", label: "Date" },
    { key: "groundTime", label: "Time" },
  ],
  room: [
    { key: "roomType", label: "Room Type" },
    { key: "checkIn", label: "Check-in" },
    { key: "checkOut", label: "Check-out" },
    { key: "guests", label: "Guests" },
  ],
};

function fieldsForType(
  data: BookingConfirmationEmailData
): { label: string; value: string }[] {
  const fields: { label: string; value: string }[] = [];

  for (const spec of FIELD_SPECS[data.bookingType]) {
    const raw = data[spec.key];
    if (raw !== undefined && raw !== "") {
      fields.push({ label: spec.label, value: String(raw) });
    }
  }

  return fields;
}

export function BookingConfirmationEmail({
  data,
}: BookingConfirmationEmailProps) {
  const fields = fieldsForType(data);

  return (
    <Html>
      <Head />
      <Preview>Your booking inquiry has been received — GSC</Preview>
      <Body style={emailStyles.main}>
        <Container style={emailStyles.container}>
          <Section style={emailStyles.header}>
            <Text style={emailStyles.headerText}>Goregaon Sports Club</Text>
          </Section>
          <Section style={emailStyles.body}>
            <Text style={emailStyles.h1}>Booking Inquiry Received</Text>
            <Text style={emailStyles.text}>Dear {data.name},</Text>
            <Text style={emailStyles.text}>
              Thank you for your {bookingTypeLabels[data.bookingType]} booking
              inquiry at Goregaon Sports Club. Here is a summary of what you
              submitted:
            </Text>

            {fields.map((field) => (
              <div key={field.label}>
                <Text style={emailStyles.label}>{field.label}</Text>
                <Text style={emailStyles.value}>{field.value}</Text>
              </div>
            ))}

            {data.message ? (
              <div>
                <Text style={emailStyles.label}>Message</Text>
                <Text style={emailStyles.value}>{data.message}</Text>
              </div>
            ) : null}

            <Section style={emailStyles.highlightBox}>
              <Text style={{ ...emailStyles.text, margin: 0 }}>
                We&apos;ll contact you within 24 hours to confirm your booking.
              </Text>
            </Section>

            <Text style={emailStyles.text}>
              Phone: [PENDING_CONTENT] · Email: [PENDING_CONTENT]
            </Text>
          </Section>
          <Hr style={emailStyles.hr} />
          <Section style={emailStyles.body}>
            <Text style={emailStyles.footer}>
              Goregaon Sports Club | Goregaon, Mumbai | gsc.in
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
