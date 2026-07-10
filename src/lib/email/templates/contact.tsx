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

export const contactConfirmationSubject =
  "We've Received Your Message — Goregaon Sports Club";

type ContactSubject =
  | "general"
  | "membership"
  | "event"
  | "partnership"
  | "media"
  | "leagues";

export interface ContactConfirmationEmailData {
  email: string;
  message: string;
  name: string;
  subject: ContactSubject;
}

interface ContactConfirmationEmailProps {
  data: ContactConfirmationEmailData;
}

const subjectLabels: Record<ContactSubject, string> = {
  event: "Event",
  general: "General",
  leagues: "Leagues",
  media: "Media",
  membership: "Membership",
  partnership: "Partnership",
};

export function ContactConfirmationEmail({
  data,
}: ContactConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>We&apos;ve received your message — GSC</Preview>
      <Body style={emailStyles.main}>
        <Container style={emailStyles.container}>
          <Section style={emailStyles.header}>
            <Text style={emailStyles.headerText}>Goregaon Sports Club</Text>
          </Section>
          <Section style={emailStyles.body}>
            <Text style={emailStyles.h1}>We&apos;ve Received Your Message</Text>
            <Text style={emailStyles.text}>Dear {data.name},</Text>
            <Text style={emailStyles.text}>
              Thank you for reaching out to Goregaon Sports Club. We&apos;ve
              received your message and will get back to you shortly.
            </Text>

            <Text style={emailStyles.label}>Subject</Text>
            <Text style={emailStyles.value}>{subjectLabels[data.subject]}</Text>

            <Text style={emailStyles.label}>Message</Text>
            <Text style={emailStyles.value}>{data.message}</Text>

            <Section style={emailStyles.highlightBox}>
              <Text style={{ ...emailStyles.text, margin: 0 }}>
                We&apos;ll respond within 2 business days.
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
