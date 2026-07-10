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

export const membershipConfirmationSubject =
  "Membership Interest Registered — Goregaon Sports Club";

export interface MembershipConfirmationEmailData {
  email: string;
  membershipType: string;
  message?: string;
  name: string;
  phone: string;
}

interface MembershipConfirmationEmailProps {
  data: MembershipConfirmationEmailData;
}

export function MembershipConfirmationEmail({
  data,
}: MembershipConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your membership interest has been registered — GSC</Preview>
      <Body style={emailStyles.main}>
        <Container style={emailStyles.container}>
          <Section style={emailStyles.header}>
            <Text style={emailStyles.headerText}>Goregaon Sports Club</Text>
          </Section>
          <Section style={emailStyles.body}>
            <Text style={emailStyles.h1}>Membership Interest Registered</Text>
            <Text style={emailStyles.text}>Dear {data.name},</Text>
            <Text style={emailStyles.text}>
              Thank you for expressing interest in{" "}
              <strong>{data.membershipType}</strong> membership at Goregaon
              Sports Club.
            </Text>

            <Text style={emailStyles.label}>Membership Type</Text>
            <Text style={emailStyles.value}>{data.membershipType}</Text>

            {data.message ? (
              <div>
                <Text style={emailStyles.label}>Message</Text>
                <Text style={emailStyles.value}>{data.message}</Text>
              </div>
            ) : null}

            <Section style={emailStyles.highlightBox}>
              <Text style={{ ...emailStyles.text, margin: 0 }}>
                Enrollment is currently paused — you&apos;ll be notified as soon
                as it opens.
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
