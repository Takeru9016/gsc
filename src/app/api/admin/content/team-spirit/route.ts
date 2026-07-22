import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { sanityCreate } from "@/lib/sanity/write.ts";
import { plainTextToPortableText } from "@/lib/utils.ts";
import { adminTeamSpiritEditionSchema } from "@/lib/validations.ts";

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const coverImageFile = formData.get("coverImage");
    const pdfFile = formData.get("pdfFile");

    const yearValue = formData.get("year");
    const result = adminTeamSpiritEditionSchema.safeParse({
      adSpecs: formData.get("adSpecs") || undefined,
      description: formData.get("description") || undefined,
      edition: formData.get("edition"),
      editionName: formData.get("editionName"),
      publicationDate: formData.get("publicationDate") || undefined,
      year: typeof yearValue === "string" ? Number(yearValue) : undefined,
    });

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const { data } = result;

    const doc: Record<string, unknown> & { _type: string } = {
      _type: "teamSpiritEdition",
      adSpecs: data.adSpecs ? plainTextToPortableText(data.adSpecs) : undefined,
      description: data.description || undefined,
      edition: data.edition,
      editionName: data.editionName,
      publicationDate: data.publicationDate || undefined,
      year: data.year,
    };

    if (coverImageFile instanceof File) {
      const buffer = Buffer.from(await coverImageFile.arrayBuffer());
      const asset = await serverClient.assets.upload("image", buffer, {
        contentType: coverImageFile.type,
        filename: coverImageFile.name,
      });
      doc.coverImage = {
        _type: "image" as const,
        asset: { _ref: asset._id, _type: "reference" as const },
      };
    }

    if (pdfFile instanceof File) {
      const buffer = Buffer.from(await pdfFile.arrayBuffer());
      const asset = await serverClient.assets.upload("file", buffer, {
        contentType: pdfFile.type,
        filename: pdfFile.name,
      });
      doc.pdfFile = {
        _type: "file" as const,
        asset: { _ref: asset._id, _type: "reference" as const },
      };
    }

    const created = await sanityCreate(doc, "team-spirit");

    return Response.json({ id: created._id, success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/team-spirit] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
