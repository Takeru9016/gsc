import Link from "next/link";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

interface EventRegistrationProps {
  registrationDeadline: string | null;
  registrationUrl: string | null;
  status: string;
}

function formatDeadline(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function EventRegistration({
  registrationUrl,
  registrationDeadline,
  status,
}: EventRegistrationProps) {
  return (
    <SectionWrapper className="pt-0">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 md:p-8">
        {registrationUrl ? (
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-body font-semibold text-(--color-text-primary) text-2xl">
                Registration
              </h2>
              {registrationDeadline ? (
                <p className="mt-2 text-(--color-text-secondary)">
                  Register by {formatDeadline(registrationDeadline)}.
                </p>
              ) : null}
            </div>
            <Link
              className="inline-flex min-w-[120px] shrink-0 items-center justify-center rounded-full bg-primary px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-primary-hover"
              href={registrationUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Register Now
            </Link>
          </div>
        ) : (
          <>
            <h2 className="font-body font-semibold text-(--color-text-primary) text-2xl">
              Registration
            </h2>
            {status === "past" ? (
              <p className="mt-2 text-(--color-text-secondary)">
                This event has concluded.
              </p>
            ) : (
              <p className="mt-2 text-(--color-text-secondary)">
                Registration details will be announced soon.
              </p>
            )}
          </>
        )}
      </div>
    </SectionWrapper>
  );
}
