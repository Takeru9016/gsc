import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env.ts";

const config = {
  apiVersion,
  dataset,
  projectId,
  useCdn: false,
};

// Server-side client (with write token for mutations)
export const serverClient = createClient({
  ...config,
  token: process.env.SANITY_API_TOKEN,
});

// Read-only client (for public data fetching)
export const client = createClient(config);
