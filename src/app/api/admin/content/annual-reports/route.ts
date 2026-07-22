import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session.ts";
import { serverClient } from "@/lib/sanity/client.ts";
import { sanityCreate } from "@/lib/sanity/write.ts";
import { adminAnnualReportSchema } from "@/lib/validations.ts";

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

    if (!(pdfFile instanceof File)) {
      return Response.json(
        { error: "PDF file is required", success: false },
        { status: 400 }
      );
    }

    const result = adminAnnualReportSchema.safeParse({
      publishedDate: formData.get("publishedDate"),
      title: formData.get("title"),
      year: formData.get("year"),
    });

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const { data } = result;

    const doc: Record<string, unknown> & { _type: string } = {
      _type: "annualReport",
      publishedDate: data.publishedDate,
      title: data.title,
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

    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    const pdfAsset = await serverClient.assets.upload("file", pdfBuffer, {
      contentType: pdfFile.type,
      filename: pdfFile.name,
    });
    doc.pdfFile = {
      _type: "file" as const,
      asset: { _ref: pdfAsset._id, _type: "reference" as const },
    };

    const created = await sanityCreate(doc, "annual-reports");

    return Response.json({ id: created._id, success: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/content/annual-reports] POST error:", error);
    return Response.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
