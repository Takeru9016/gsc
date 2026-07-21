"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import type { League } from "@/lib/sanity/queries.ts";
import {
  type AdminLeaguePatchFormValues,
  adminLeaguePatchSchema,
} from "@/lib/validations.ts";

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

type EditLeagueFormValues = Omit<AdminLeaguePatchFormValues, "key">;

function leagueToFormValues(league: League | null): EditLeagueFormValues {
  return {
    approximateDates: league?.approximateDates ?? "",
    description: league?.description ?? "",
    format: league?.format ?? "",
    frequency: league?.frequency ?? "",
    isActive: league?.isActive ?? true,
    name: league?.name ?? "",
    sport: league?.sport ?? "",
  };
}

interface EditLeagueDialogProps {
  league: League | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (key: string, values: EditLeagueFormValues) => void;
}

function EditLeagueDialog({
  league,
  onOpenChange,
  onSaved,
}: EditLeagueDialogProps) {
  const [saveError, setSaveError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditLeagueFormValues>({
    resolver: zodResolver(adminLeaguePatchSchema.omit({ key: true })),
    values: leagueToFormValues(league),
  });

  const onSubmit = useCallback(
    async (data: EditLeagueFormValues) => {
      if (!league) {
        return;
      }
      setSaveError(false);
      try {
        const response = await fetch("/api/admin/content/leagues-config", {
          body: JSON.stringify({ key: league._key, ...data }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        });
        if (!response.ok) {
          setSaveError(true);
          return;
        }
        onSaved(league._key, data);
      } catch {
        setSaveError(true);
      }
    },
    [league, onSaved]
  );

  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(league)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Edit ${league?.name ?? "League"}`}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClasses} htmlFor="leagueName">
                League Name
              </label>
              <input
                className={inputClasses}
                id="leagueName"
                {...register("name")}
              />
            </div>
            <div>
              <label className={labelClasses} htmlFor="leagueSport">
                Sport
              </label>
              <input
                className={inputClasses}
                id="leagueSport"
                {...register("sport")}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClasses} htmlFor="leagueFormat">
                Format
              </label>
              <input
                className={inputClasses}
                id="leagueFormat"
                {...register("format")}
              />
            </div>
            <div>
              <label className={labelClasses} htmlFor="leagueFrequency">
                Frequency
              </label>
              <input
                className={inputClasses}
                id="leagueFrequency"
                {...register("frequency")}
              />
            </div>
          </div>
          <div>
            <label className={labelClasses} htmlFor="leagueDates">
              Approximate Dates
            </label>
            <input
              className={inputClasses}
              id="leagueDates"
              placeholder="e.g. March–April"
              {...register("approximateDates")}
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor="leagueDescription">
              Description
            </label>
            <textarea
              className={inputClasses}
              id="leagueDescription"
              rows={3}
              {...register("description")}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              className="size-4 rounded border-(--color-border)"
              id="leagueIsActive"
              type="checkbox"
              {...register("isActive")}
            />
            <label className={labelClasses} htmlFor="leagueIsActive">
              Active
            </label>
          </div>
          {errors.root ? (
            <p className={errorClasses}>{errors.root.message}</p>
          ) : null}
          {saveError ? (
            <p className={errorClasses}>
              Something went wrong. Please try again.
            </p>
          ) : null}
          <Button loading={isSubmitting} type="submit">
            {`Save ${league?.name ?? "League"}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface LeagueRowProps {
  league: League;
  onEditRequest: (league: League) => void;
  onToggleActive: (key: string, isActive: boolean) => void;
  pendingKey: string | null;
}

function LeagueRow({
  league,
  onEditRequest,
  onToggleActive,
  pendingKey,
}: LeagueRowProps) {
  const isPending = pendingKey === league._key;

  const handleEdit = useCallback(() => {
    onEditRequest(league);
  }, [onEditRequest, league]);

  const handleToggle = useCallback(() => {
    onToggleActive(league._key, !league.isActive);
  }, [onToggleActive, league._key, league.isActive]);

  return (
    <tr className="border-(--color-border) border-b last:border-0">
      <td className="px-4 py-3 align-top font-medium">{league.name}</td>
      <td className="px-4 py-3 align-top">{league.sport}</td>
      <td className="px-4 py-3 align-top">{league.format}</td>
      <td className="px-4 py-3 align-top">{league.frequency}</td>
      <td className="px-4 py-3 align-top">{league.approximateDates ?? "—"}</td>
      <td className="px-4 py-3 align-top">
        <button
          className="inline-flex"
          disabled={isPending}
          onClick={handleToggle}
          type="button"
        >
          <Badge size="sm" variant={league.isActive ? "green" : "outline"}>
            {league.isActive ? "Active" : "Inactive"}
          </Badge>
        </button>
      </td>
      <td className="px-4 py-3 align-top">
        <Button onClick={handleEdit} size="sm" variant="secondary">
          Edit
        </Button>
      </td>
    </tr>
  );
}

interface LeaguesTableProps {
  leagues: League[];
}

export function LeaguesTable({ leagues }: LeaguesTableProps) {
  const [rows, setRows] = useState(leagues);
  const [editTarget, setEditTarget] = useState<League | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const handleEditRequest = useCallback((league: League) => {
    setEditTarget(league);
  }, []);

  const handleEditOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setEditTarget(null);
    }
  }, []);

  const handleSaved = useCallback(
    (key: string, values: EditLeagueFormValues) => {
      setRows((prev) =>
        prev.map((row) => (row._key === key ? { ...row, ...values } : row))
      );
      setEditTarget(null);
    },
    []
  );

  const handleToggleActive = useCallback(
    async (key: string, isActive: boolean) => {
      setPendingKey(key);
      try {
        const response = await fetch("/api/admin/content/leagues-config", {
          body: JSON.stringify({ isActive, key }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        });
        if (!response.ok) {
          return;
        }
        setRows((prev) =>
          prev.map((row) => (row._key === key ? { ...row, isActive } : row))
        );
      } finally {
        setPendingKey(null);
      }
    },
    []
  );

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
        No leagues found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
      <table className="w-full text-left text-sm">
        <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 font-medium">League Name</th>
            <th className="px-4 py-3 font-medium">Sport</th>
            <th className="px-4 py-3 font-medium">Format</th>
            <th className="px-4 py-3 font-medium">Frequency</th>
            <th className="px-4 py-3 font-medium">Dates</th>
            <th className="px-4 py-3 font-medium">Active</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((league) => (
            <LeagueRow
              key={league._key}
              league={league}
              onEditRequest={handleEditRequest}
              onToggleActive={handleToggleActive}
              pendingKey={pendingKey}
            />
          ))}
        </tbody>
      </table>

      <EditLeagueDialog
        league={editTarget}
        onOpenChange={handleEditOpenChange}
        onSaved={handleSaved}
      />
    </div>
  );
}
