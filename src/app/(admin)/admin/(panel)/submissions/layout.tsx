export default function AdminSubmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-(--color-text-secondary) text-xs uppercase tracking-widest">
          Submissions
        </p>
      </div>
      {children}
    </div>
  );
}
