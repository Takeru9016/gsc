"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/shared/Button.tsx";
import { authClient } from "@/lib/auth/auth-client.ts";
import {
  type AdminLoginFormValues,
  adminLoginSchema,
} from "@/lib/validations.ts";

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

export function AdminLoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (values: AdminLoginFormValues) => {
    setFormError(null);
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setFormError("Invalid email or password");
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
        <label className={labelClasses} htmlFor="password">
          Password *
        </label>
        <input
          className={inputClasses}
          id="password"
          type="password"
          {...register("password")}
        />
        {errors.password ? (
          <p className={errorClasses}>{errors.password.message}</p>
        ) : null}
      </div>

      {formError ? <p className={errorClasses}>{formError}</p> : null}

      <Button
        className="w-full"
        disabled={isSubmitting}
        loading={isSubmitting}
        type="submit"
      >
        Sign In
      </Button>
    </form>
  );
}
