interface AdminPlaceholderProps {
  taskCode: string;
  title: string;
}

export function AdminPlaceholder({ title, taskCode }: AdminPlaceholderProps) {
  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8">
      <h1 className="font-display font-semibold text-2xl">{title}</h1>
      <p className="mt-2 text-(--color-text-secondary) text-sm">
        Coming in {taskCode}.
      </p>
    </div>
  );
}
