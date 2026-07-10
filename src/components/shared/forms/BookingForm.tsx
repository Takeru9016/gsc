"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type MouseEvent, useCallback } from "react";
import {
  type Control,
  Controller,
  type ControllerRenderProps,
  type FieldErrors,
  type UseFormRegister,
  useForm,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { cn } from "@/lib/utils.ts";
import { type BookingFormValues, bookingSchema } from "@/lib/validations.ts";

interface BookingFormProps {
  defaultHall?: string;
  defaultSport?: string;
  defaultType?: BookingFormValues["bookingType"];
}

const TYPE_OPTIONS: {
  label: string;
  value: BookingFormValues["bookingType"];
}[] = [
  { label: "Room", value: "room" },
  { label: "Banquet", value: "banquet" },
  { label: "Ground", value: "ground" },
  { label: "Coaching", value: "coaching" },
];

const bookingTypeLabels: Record<BookingFormValues["bookingType"], string> = {
  banquet: "Banquet",
  coaching: "Coaching",
  ground: "Ground",
  room: "Room",
};

const HALL_OPTIONS = ["Regal", "Rhythm", "Glamourra", "No preference"];

const COACHING_LEVEL_OPTIONS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "All levels",
] as const;

const VALID_TYPES = new Set(TYPE_OPTIONS.map((option) => option.value));

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

function isBookingType(
  value: string | null
): value is BookingFormValues["bookingType"] {
  return (
    value !== null && VALID_TYPES.has(value as BookingFormValues["bookingType"])
  );
}

interface FieldsProps {
  errors: FieldErrors<BookingFormValues>;
  register: UseFormRegister<BookingFormValues>;
}

function RoomFields({ register, errors }: FieldsProps) {
  return (
    <>
      <div>
        <label className={labelClasses} htmlFor="roomType">
          Room Type
        </label>
        <input
          className={inputClasses}
          id="roomType"
          type="text"
          {...register("roomType")}
        />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="checkIn">
            Check-in *
          </label>
          <input
            className={inputClasses}
            id="checkIn"
            type="date"
            {...register("checkIn")}
          />
          {errors.checkIn ? (
            <p className={errorClasses}>{errors.checkIn.message}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClasses} htmlFor="checkOut">
            Check-out *
          </label>
          <input
            className={inputClasses}
            id="checkOut"
            type="date"
            {...register("checkOut")}
          />
          {errors.checkOut ? (
            <p className={errorClasses}>{errors.checkOut.message}</p>
          ) : null}
        </div>
      </div>
      <div>
        <label className={labelClasses} htmlFor="guests">
          Guests
        </label>
        <input
          className={inputClasses}
          id="guests"
          max={10}
          min={1}
          type="number"
          {...register("guests", { valueAsNumber: true })}
        />
        {errors.guests ? (
          <p className={errorClasses}>{errors.guests.message}</p>
        ) : null}
      </div>
    </>
  );
}

interface BanquetFieldsProps extends FieldsProps {
  control: Control<BookingFormValues>;
}

function BanquetFields({ register, errors, control }: BanquetFieldsProps) {
  const renderHallField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<BookingFormValues, "hallPreference">;
    }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger id="hallPreference">
          <SelectValue placeholder="Select a hall" />
        </SelectTrigger>
        <SelectContent>
          {HALL_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    []
  );

  return (
    <>
      <div>
        <label className={labelClasses} htmlFor="hallPreference">
          Hall Preference
        </label>
        <Controller
          control={control}
          name="hallPreference"
          render={renderHallField}
        />
      </div>
      <div>
        <label className={labelClasses} htmlFor="eventType">
          Event Type *
        </label>
        <input
          className={inputClasses}
          id="eventType"
          type="text"
          {...register("eventType")}
        />
        {errors.eventType ? (
          <p className={errorClasses}>{errors.eventType.message}</p>
        ) : null}
      </div>
      <div>
        <label className={labelClasses} htmlFor="guestCount">
          Guest Count *
        </label>
        <input
          className={inputClasses}
          id="guestCount"
          min={1}
          type="number"
          {...register("guestCount", { valueAsNumber: true })}
        />
        {errors.guestCount ? (
          <p className={errorClasses}>{errors.guestCount.message}</p>
        ) : null}
      </div>
      <div>
        <label className={labelClasses} htmlFor="eventDate">
          Event Date *
        </label>
        <input
          className={inputClasses}
          id="eventDate"
          type="date"
          {...register("eventDate")}
        />
        {errors.eventDate ? (
          <p className={errorClasses}>{errors.eventDate.message}</p>
        ) : null}
      </div>
    </>
  );
}

function GroundFields({ register, errors }: FieldsProps) {
  return (
    <>
      <div>
        <label className={labelClasses} htmlFor="sport">
          Sport
        </label>
        <input
          className={inputClasses}
          id="sport"
          type="text"
          {...register("sport")}
        />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="groundDate">
            Date *
          </label>
          <input
            className={inputClasses}
            id="groundDate"
            type="date"
            {...register("groundDate")}
          />
          {errors.groundDate ? (
            <p className={errorClasses}>{errors.groundDate.message}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClasses} htmlFor="groundTime">
            Preferred Time *
          </label>
          <input
            className={inputClasses}
            id="groundTime"
            type="time"
            {...register("groundTime")}
          />
          {errors.groundTime ? (
            <p className={errorClasses}>{errors.groundTime.message}</p>
          ) : null}
        </div>
      </div>
    </>
  );
}

function CoachingFields({ register, errors, control }: BanquetFieldsProps) {
  const renderLevelField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<BookingFormValues, "coachingLevel">;
    }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger id="coachingLevel">
          <SelectValue placeholder="Select a level" />
        </SelectTrigger>
        <SelectContent>
          {COACHING_LEVEL_OPTIONS.map((level) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    []
  );

  return (
    <>
      <div>
        <label className={labelClasses} htmlFor="coachingSport">
          Sport *
        </label>
        <input
          className={inputClasses}
          id="coachingSport"
          type="text"
          {...register("coachingSport")}
        />
        {errors.coachingSport ? (
          <p className={errorClasses}>{errors.coachingSport.message}</p>
        ) : null}
      </div>
      <div>
        <label className={labelClasses} htmlFor="coachingLevel">
          Level
        </label>
        <Controller
          control={control}
          name="coachingLevel"
          render={renderLevelField}
        />
      </div>
    </>
  );
}

interface TypeSelectorProps {
  activeType: BookingFormValues["bookingType"];
  onChange: (value: BookingFormValues["bookingType"]) => void;
}

function TypeSelector({ activeType, onChange }: TypeSelectorProps) {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onChange(event.currentTarget.value as BookingFormValues["bookingType"]);
    },
    [onChange]
  );

  return (
    <div className="mb-8 flex flex-wrap gap-3">
      {TYPE_OPTIONS.map((option) => {
        const isActive = option.value === activeType;
        return (
          <button
            aria-pressed={isActive}
            className={cn(
              "rounded-full px-4 py-2 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isActive
                ? "bg-primary text-white"
                : "border border-(--color-border) text-(--color-text-secondary) hover:border-primary hover:text-primary"
            )}
            key={option.value}
            onClick={handleClick}
            type="button"
            value={option.value}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function BookingForm({
  defaultType,
  defaultSport,
  defaultHall,
}: BookingFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlType = searchParams.get("type");
  const initialType = isBookingType(urlType)
    ? urlType
    : (defaultType ?? "room");

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<BookingFormValues>({
    defaultValues: {
      bookingType: initialType,
      hallPreference: defaultHall,
      sport: defaultSport,
    },
    resolver: zodResolver(bookingSchema),
  });

  const bookingType = watch("bookingType");

  const handleTabChange = useCallback(
    (value: BookingFormValues["bookingType"]) => {
      setValue("bookingType", value);
      const params = new URLSearchParams(searchParams.toString());
      params.set("type", value);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams, setValue]
  );

  const onSubmit = async (data: BookingFormValues) => {
    try {
      const response = await fetch("/api/booking", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const result = await response.json();

      if (!(response.ok && result.success)) {
        setError("root", { message: "submit-failed" });
        return;
      }

      reset({ bookingType });
    } catch {
      setError("root", { message: "submit-failed" });
    }
  };

  if (isSubmitSuccessful) {
    return (
      <div className="rounded-2xl border border-accent-green/20 bg-accent-green/10 p-6 text-accent-green">
        Your {bookingTypeLabels[bookingType]} inquiry has been received. We'll
        contact you within 24 hours.
      </div>
    );
  }

  return (
    <div>
      <TypeSelector activeType={bookingType} onChange={handleTabChange} />

      <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className={labelClasses} htmlFor="name">
            Name *
          </label>
          <input
            className={inputClasses}
            id="name"
            type="text"
            {...register("name")}
          />
          {errors.name ? (
            <p className={errorClasses}>{errors.name.message}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClasses} htmlFor="email">
            Email *
          </label>
          <input
            className={inputClasses}
            id="email"
            type="email"
            {...register("email")}
          />
          {errors.email ? (
            <p className={errorClasses}>{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClasses} htmlFor="phone">
            Phone *
          </label>
          <input
            className={inputClasses}
            id="phone"
            type="tel"
            {...register("phone")}
          />
          {errors.phone ? (
            <p className={errorClasses}>{errors.phone.message}</p>
          ) : null}
        </div>

        {bookingType === "room" ? (
          <RoomFields errors={errors} register={register} />
        ) : null}
        {bookingType === "banquet" ? (
          <BanquetFields
            control={control}
            errors={errors}
            register={register}
          />
        ) : null}
        {bookingType === "ground" ? (
          <GroundFields errors={errors} register={register} />
        ) : null}
        {bookingType === "coaching" ? (
          <CoachingFields
            control={control}
            errors={errors}
            register={register}
          />
        ) : null}

        <div>
          <label className={labelClasses} htmlFor="message">
            Message
          </label>
          <textarea
            className={inputClasses}
            id="message"
            rows={4}
            {...register("message")}
          />
        </div>

        {errors.root ? (
          <p className={errorClasses}>
            Something went wrong. Please try again or call us directly.
          </p>
        ) : null}

        <button
          className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : null}
          Submit Inquiry
        </button>
      </form>
    </div>
  );
}
