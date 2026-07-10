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

export const partnerConfirmationSubject =
  "Partnership Inquiry Received — Goregaon Sports Club";

export interface PartnerConfirmationEmailData {
  companyName: string;
  contactName: string;
  email: string;
  message?: string;
  partnershipType?: string;
  phone: string;
}

interface PartnerConfirmationEmailProps {
  data: PartnerConfirmationEmailData;
}

export function PartnerConfirmationEmail({
  data,
}: PartnerConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your partnership inquiry has been received — GSC</Preview>
      <Body style={emailStyles.main}>
        <Container style={emailStyles.container}>
          <Section style={emailStyles.header}>
            <Text style={emailStyles.headerText}>Goregaon Sports Club</Text>
          </Section>
          <Section style={emailStyles.body}>
            <Text style={emailStyles.h1}>Partnership Inquiry Received</Text>
            <Text style={emailStyles.text}>Dear {data.contactName},</Text>
            <Text style={emailStyles.text}>
              Thank you for {data.companyName}&apos;s interest in partnering
              with Goregaon Sports Club.
            </Text>

            <Text style={emailStyles.label}>Company Name</Text>
            <Text style={emailStyles.value}>{data.companyName}</Text>

            {data.partnershipType ? (
              <div>
                <Text style={emailStyles.label}>Partnership Type</Text>
                <Text style={emailStyles.value}>{data.partnershipType}</Text>
              </div>
            ) : null}

            {data.message ? (
              <div>
                <Text style={emailStyles.label}>Message</Text>
                <Text style={emailStyles.value}>{data.message}</Text>
              </div>
            ) : null}

            <Section style={emailStyles.highlightBox}>
              <Text style={{ ...emailStyles.text, margin: 0 }}>
                Our partnerships team will be in touch within 48 hours.
              </Text>
            </Section>
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
