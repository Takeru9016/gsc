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

export const achievementReceivedSubject =
  "Achievement Submission Received — Goregaon Sports Club";

export interface AchievementReceivedEmailData {
  achievementTitle: string;
  email: string;
  level: string;
  memberName: string;
  sport: string;
}

interface AchievementReceivedEmailProps {
  data: AchievementReceivedEmailData;
}

export function AchievementReceivedEmail({
  data,
}: AchievementReceivedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your achievement submission has been received — GSC</Preview>
      <Body style={emailStyles.main}>
        <Container style={emailStyles.container}>
          <Section style={emailStyles.header}>
            <Text style={emailStyles.headerText}>Goregaon Sports Club</Text>
          </Section>
          <Section style={emailStyles.body}>
            <Text style={emailStyles.h1}>Achievement Submission Received</Text>
            <Text style={emailStyles.text}>Dear {data.memberName},</Text>
            <Text style={emailStyles.text}>
              Thank you for sharing your achievement with Goregaon Sports Club.
            </Text>

            <Text style={emailStyles.label}>Achievement</Text>
            <Text style={emailStyles.value}>{data.achievementTitle}</Text>

            <Text style={emailStyles.label}>Sport</Text>
            <Text style={emailStyles.value}>{data.sport}</Text>

            <Text style={emailStyles.label}>Level</Text>
            <Text style={emailStyles.value}>{data.level}</Text>

            <Section style={emailStyles.highlightBox}>
              <Text style={{ ...emailStyles.text, margin: 0 }}>
                Our team will review your submission and add it to our champions
                wall.
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
