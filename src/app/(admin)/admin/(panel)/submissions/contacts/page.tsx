import { ContactsTable } from "@/components/sections/admin/submissions/ContactsTable.tsx";
import { getAllContacts } from "@/lib/db/adminQueries.ts";

export default async function AdminContactSubmissionsPage() {
  const contacts = await getAllContacts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">
          Contact Submissions
        </h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          General inquiries submitted through the contact form.
        </p>
      </div>
      <ContactsTable contacts={contacts} />
    </div>
  );
}
