import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { dataset, projectId } from "../env.ts";

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ dataset, projectId });

export const urlFor = (source: SanityImageSource) => builder.image(source);
