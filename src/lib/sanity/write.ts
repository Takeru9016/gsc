import { revalidateTag } from "next/cache";
import { serverClient } from "@/lib/sanity/client.ts";

export async function sanityPatch(
  id: string,
  patch: Record<string, unknown>,
  tag: string,
  unset?: string[]
) {
  let transaction = serverClient.patch(id);
  if (Object.keys(patch).length > 0) {
    transaction = transaction.set(patch);
  }
  if (unset && unset.length > 0) {
    transaction = transaction.unset(unset);
  }
  await transaction.commit();
  revalidateTag(tag, "max");
}

export async function sanityCreate(
  doc: Record<string, unknown> & { _type: string },
  tag: string
) {
  const result = await serverClient.create(doc);
  revalidateTag(tag, "max");
  return result;
}

export async function sanityDelete(id: string, tag: string) {
  await serverClient.delete(id);
  revalidateTag(tag, "max");
}

export async function getOrCreateSingletonId(
  documentType: string,
  tag: string
): Promise<string> {
  const existingId = await serverClient.fetch<string | null>(
    "*[_type == $documentType][0]._id",
    { documentType }
  );
  if (existingId) {
    return existingId;
  }
  const created = await serverClient.create({ _type: documentType });
  revalidateTag(tag, "max");
  return created._id;
}
