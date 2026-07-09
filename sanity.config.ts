"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./src/sanity/env.ts";
import { schema } from "./src/sanity/schemaTypes/index.ts";
import { structure } from "./src/sanity/structure.ts";

export default defineConfig({
  basePath: "/studio",
  dataset,
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  projectId,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
});
