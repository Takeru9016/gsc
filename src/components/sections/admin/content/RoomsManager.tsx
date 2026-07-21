"use client";

import { Plus, Trash2 } from "lucide-react";
import { type ChangeEvent, useCallback, useState } from "react";
import { Button } from "@/components/shared/Button.tsx";
import type { BookingConfigRoom } from "@/lib/sanity/queries.ts";

const inputClasses =
  "w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";

const errorClasses = "mt-1 text-accent-red text-sm";

function createEmptyRoom(): BookingConfigRoom {
  return { _key: crypto.randomUUID(), capacity: null, name: "", type: "" };
}

interface RoomRowProps {
  onCapacityChange: (key: string, value: number | null) => void;
  onDelete: (key: string) => void;
  onNameChange: (key: string, value: string) => void;
  onTypeChange: (key: string, value: string) => void;
  room: BookingConfigRoom;
}

function RoomRow({
  onCapacityChange,
  onDelete,
  onNameChange,
  onTypeChange,
  room,
}: RoomRowProps) {
  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onNameChange(room._key, event.target.value);
    },
    [onNameChange, room._key]
  );

  const handleTypeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onTypeChange(room._key, event.target.value);
    },
    [onTypeChange, room._key]
  );

  const handleCapacityChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      onCapacityChange(room._key, value === "" ? null : Number(value));
    },
    [onCapacityChange, room._key]
  );

  const handleDelete = useCallback(() => {
    onDelete(room._key);
  }, [onDelete, room._key]);

  return (
    <tr className="border-(--color-border) border-b last:border-0">
      <td className="px-4 py-3 align-top">
        <input
          className={inputClasses}
          onChange={handleNameChange}
          placeholder="Room name"
          value={room.name}
        />
      </td>
      <td className="px-4 py-3 align-top">
        <input
          className={inputClasses}
          onChange={handleTypeChange}
          placeholder="Room type"
          value={room.type ?? ""}
        />
      </td>
      <td className="px-4 py-3 align-top">
        <input
          className={inputClasses}
          min={0}
          onChange={handleCapacityChange}
          type="number"
          value={room.capacity ?? ""}
        />
      </td>
      <td className="px-4 py-3 align-top">
        <Button onClick={handleDelete} size="sm" variant="secondary">
          <Trash2 aria-hidden="true" className="size-4" />
          Delete
        </Button>
      </td>
    </tr>
  );
}

interface RoomsManagerProps {
  rooms: BookingConfigRoom[];
}

export function RoomsManager({ rooms }: RoomsManagerProps) {
  const [rows, setRows] = useState(rooms);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddRoom = useCallback(() => {
    setRows((prev) => [...prev, createEmptyRoom()]);
  }, []);

  const handleDelete = useCallback((key: string) => {
    setRows((prev) => prev.filter((row) => row._key !== key));
  }, []);

  const handleNameChange = useCallback((key: string, value: string) => {
    setRows((prev) =>
      prev.map((row) => (row._key === key ? { ...row, name: value } : row))
    );
  }, []);

  const handleTypeChange = useCallback((key: string, value: string) => {
    setRows((prev) =>
      prev.map((row) => (row._key === key ? { ...row, type: value } : row))
    );
  }, []);

  const handleCapacityChange = useCallback(
    (key: string, value: number | null) => {
      setRows((prev) =>
        prev.map((row) =>
          row._key === key ? { ...row, capacity: value } : row
        )
      );
    },
    []
  );

  const handleSaveAll = useCallback(async () => {
    setSaving(true);
    setSaveError(false);
    setSaveSuccess(false);
    try {
      const response = await fetch("/api/admin/content/booking-config", {
        body: JSON.stringify({ rooms: rows }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      if (!response.ok) {
        setSaveError(true);
        return;
      }
      setSaveSuccess(true);
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }, [rows]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-body font-semibold text-lg">Room Types</h2>
        <Button onClick={handleAddRoom} size="sm" variant="secondary">
          <Plus aria-hidden="true" className="size-4" />
          Add Room
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
          No rooms yet. Add one to get started.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
          <table className="w-full text-left text-sm">
            <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Capacity</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((room) => (
                <RoomRow
                  key={room._key}
                  onCapacityChange={handleCapacityChange}
                  onDelete={handleDelete}
                  onNameChange={handleNameChange}
                  onTypeChange={handleTypeChange}
                  room={room}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {saveError ? (
        <p className={errorClasses}>
          Something went wrong saving rooms. Please try again.
        </p>
      ) : null}
      {saveSuccess ? <p className="text-accent-green text-sm">Saved.</p> : null}

      <Button loading={saving} onClick={handleSaveAll}>
        Save All
      </Button>
    </div>
  );
}
