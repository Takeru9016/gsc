import type { CSSProperties } from "react";

const fontDisplay = "'Barlow Condensed', Arial, sans-serif";
const fontBody = "'Inter', Arial, sans-serif";

export const emailStyles: Record<string, CSSProperties> = {
  body: {
    padding: "32px 24px",
  },
  container: {
    backgroundColor: "#ffffff",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: "16px",
    margin: "0 auto",
    maxWidth: "600px",
    overflow: "hidden",
  },
  footer: {
    color: "#9ca3af",
    fontFamily: fontBody,
    fontSize: "13px",
    margin: "0 0 4px",
    textAlign: "center",
  },
  h1: {
    color: "#0f172a",
    fontFamily: fontDisplay,
    fontSize: "24px",
    fontWeight: 600,
    margin: "0 0 16px",
  },
  header: {
    backgroundColor: "#0a0e1a",
    padding: "32px 24px",
    textAlign: "center",
  },
  headerText: {
    color: "#ffffff",
    fontFamily: fontDisplay,
    fontSize: "28px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    margin: 0,
    textTransform: "uppercase",
  },
  highlightBox: {
    backgroundColor: "rgba(21,101,192,0.06)",
    border: "1px solid rgba(21,101,192,0.2)",
    borderRadius: "12px",
    margin: "0 0 16px",
    padding: "16px",
  },
  hr: {
    borderColor: "rgba(0,0,0,0.08)",
    margin: "24px 0",
  },
  label: {
    color: "#6b7280",
    fontFamily: fontBody,
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.04em",
    margin: "0 0 2px",
    textTransform: "uppercase",
  },
  main: {
    backgroundColor: "#f8faff",
    fontFamily: fontBody,
    padding: "40px 0",
  },
  text: {
    color: "#0f172a",
    fontFamily: fontBody,
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 16px",
  },
  value: {
    color: "#0f172a",
    fontFamily: fontBody,
    fontSize: "15px",
    fontWeight: 500,
    margin: "0 0 12px",
  },
};
