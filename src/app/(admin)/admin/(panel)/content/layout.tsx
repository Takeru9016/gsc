export default function AdminContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-(--color-text-secondary) text-xs uppercase tracking-widest">
          Content Management
        </p>
      </div>
      {children}
    </div>
  );
}
