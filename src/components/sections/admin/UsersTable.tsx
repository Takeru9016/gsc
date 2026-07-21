"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import {
  Controller,
  type ControllerRenderProps,
  useForm,
} from "react-hook-form";
import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  type AdminCreateUserFormValues,
  adminCreateUserSchema,
} from "@/lib/validations.ts";

const inputClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary) focus:border-primary focus:ring-1 focus:ring-primary";

const labelClasses =
  "mb-1 block font-medium text-(--color-text-primary) text-sm";

const errorClasses = "mt-1 text-accent-red text-sm";

const ROLE_OPTIONS: AdminCreateUserFormValues["role"][] = ["admin", "staff"];

export interface AdminUserRow {
  createdAt: string;
  email: string;
  id: string;
  lastSignIn: string | null;
  name: string;
  role: string;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface CreateUserDialogProps {
  onCreated: (user: AdminUserRow) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

function CreateUserDialog({
  onCreated,
  onOpenChange,
  open,
}: CreateUserDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminCreateUserFormValues>({
    defaultValues: { role: "staff" },
    resolver: zodResolver(adminCreateUserSchema),
  });

  const renderRoleField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AdminCreateUserFormValues, "role">;
    }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger id="newUserRole">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {ROLE_OPTIONS.map((role) => (
            <SelectItem key={role} value={role}>
              {role === "admin" ? "Admin" : "Staff"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    []
  );

  const onSubmit = useCallback(
    async (data: AdminCreateUserFormValues) => {
      setSubmitError(null);
      try {
        const response = await fetch("/api/admin/users", {
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        const result = await response.json();
        if (!response.ok) {
          setSubmitError(result.error ?? "Something went wrong.");
          return;
        }
        onCreated({
          createdAt: result.user.createdAt,
          email: result.user.email,
          id: result.user.id,
          lastSignIn: null,
          name: result.user.name,
          role: result.user.role,
        });
        reset();
      } catch {
        setSubmitError("Something went wrong. Please try again.");
      }
    },
    [onCreated, reset]
  );

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className={labelClasses} htmlFor="newUserName">
              Name *
            </label>
            <input
              className={inputClasses}
              id="newUserName"
              {...register("name")}
            />
            {errors.name ? (
              <p className={errorClasses}>{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClasses} htmlFor="newUserEmail">
              Email *
            </label>
            <input
              className={inputClasses}
              id="newUserEmail"
              type="email"
              {...register("email")}
            />
            {errors.email ? (
              <p className={errorClasses}>{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClasses} htmlFor="newUserPassword">
              Password *
            </label>
            <input
              className={inputClasses}
              id="newUserPassword"
              type="password"
              {...register("password")}
            />
            {errors.password ? (
              <p className={errorClasses}>{errors.password.message}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClasses} htmlFor="newUserRole">
              Role *
            </label>
            <Controller
              control={control}
              name="role"
              render={renderRoleField}
            />
            {errors.role ? (
              <p className={errorClasses}>{errors.role.message}</p>
            ) : null}
          </div>

          {submitError ? <p className={errorClasses}>{submitError}</p> : null}

          <Button loading={isSubmitting} type="submit">
            Add User
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteConfirmDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
  user: AdminUserRow | null;
}

function DeleteConfirmDialog({
  onCancel,
  onConfirm,
  onOpenChange,
  pending,
  user,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(user)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          Are you sure you want to delete{" "}
          <span className="font-medium">{user?.name}</span>? This cannot be
          undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} size="sm" variant="secondary">
            Cancel
          </Button>
          <Button loading={pending} onClick={onConfirm} size="sm">
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface TempPasswordDialogProps {
  onOpenChange: (open: boolean) => void;
  password: string | null;
}

function TempPasswordDialog({
  onOpenChange,
  password,
}: TempPasswordDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!password) {
      return;
    }
    navigator.clipboard.writeText(password);
    setCopied(true);
  }, [password]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setCopied(false);
      }
      onOpenChange(open);
    },
    [onOpenChange]
  );

  return (
    <Dialog onOpenChange={handleOpenChange} open={Boolean(password)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Temporary Password</DialogTitle>
        </DialogHeader>
        <p className="text-(--color-text-secondary) text-sm">
          Share this password with the user securely. It will not be shown
          again.
        </p>
        <div className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3">
          <code className="flex-1 font-mono text-sm">{password}</code>
          <Button onClick={handleCopy} size="sm" variant="secondary">
            {copied ? (
              <Check aria-hidden="true" className="size-4" />
            ) : (
              <Copy aria-hidden="true" className="size-4" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface UserRowProps {
  currentUserId: string;
  onDeleteRequest: (user: AdminUserRow) => void;
  onResetPassword: (user: AdminUserRow) => void;
  onRevokeSessions: (user: AdminUserRow) => void;
  onToggleRole: (user: AdminUserRow) => void;
  pendingId: string | null;
  user: AdminUserRow;
}

function UserRow({
  currentUserId,
  onDeleteRequest,
  onResetPassword,
  onRevokeSessions,
  onToggleRole,
  pendingId,
  user,
}: UserRowProps) {
  const isPending = pendingId === user.id;
  const isSelf = user.id === currentUserId;

  const handleToggleRole = useCallback(() => {
    onToggleRole(user);
  }, [onToggleRole, user]);

  const handleResetPassword = useCallback(() => {
    onResetPassword(user);
  }, [onResetPassword, user]);

  const handleRevokeSessions = useCallback(() => {
    onRevokeSessions(user);
  }, [onRevokeSessions, user]);

  const handleDelete = useCallback(() => {
    onDeleteRequest(user);
  }, [onDeleteRequest, user]);

  return (
    <tr className="border-(--color-border) border-b last:border-0">
      <td className="px-4 py-3 align-top font-medium">{user.name}</td>
      <td className="px-4 py-3 align-top">{user.email}</td>
      <td className="px-4 py-3 align-top">
        <Badge
          size="sm"
          variant={user.role === "admin" ? "primary" : "outline"}
        >
          {user.role}
        </Badge>
      </td>
      <td className="px-4 py-3 align-top">{formatDateTime(user.createdAt)}</td>
      <td className="px-4 py-3 align-top">
        {user.lastSignIn ? formatDateTime(user.lastSignIn) : "Never"}
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={isPending || isSelf}
            onClick={handleToggleRole}
            size="sm"
            variant="secondary"
          >
            Make {user.role === "admin" ? "Staff" : "Admin"}
          </Button>
          <Button
            disabled={isPending}
            onClick={handleResetPassword}
            size="sm"
            variant="secondary"
          >
            Reset Password
          </Button>
          <Button
            disabled={isPending}
            onClick={handleRevokeSessions}
            size="sm"
            variant="secondary"
          >
            Revoke Sessions
          </Button>
          <Button
            disabled={isPending || isSelf}
            onClick={handleDelete}
            size="sm"
            variant="secondary"
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}

interface UsersTableProps {
  currentUserId: string;
  users: AdminUserRow[];
}

export function UsersTable({ currentUserId, users }: UsersTableProps) {
  const [rows, setRows] = useState(users);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserRow | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const handleOpenAdd = useCallback(() => {
    setAddOpen(true);
  }, []);

  const handleAddOpenChange = useCallback((open: boolean) => {
    setAddOpen(open);
  }, []);

  const handleCreated = useCallback((user: AdminUserRow) => {
    setRows((prev) => [user, ...prev]);
    setAddOpen(false);
  }, []);

  const handleToggleRole = useCallback(async (user: AdminUserRow) => {
    const nextRole = user.role === "admin" ? "staff" : "admin";
    setPendingId(user.id);
    try {
      const response = await fetch(`/api/admin/users/${user.id}/role`, {
        body: JSON.stringify({ role: nextRole }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      if (!response.ok) {
        return;
      }
      setRows((prev) =>
        prev.map((row) =>
          row.id === user.id ? { ...row, role: nextRole } : row
        )
      );
    } finally {
      setPendingId(null);
    }
  }, []);

  const handleResetPassword = useCallback(async (user: AdminUserRow) => {
    setPendingId(user.id);
    try {
      const response = await fetch(
        `/api/admin/users/${user.id}/reset-password`,
        { method: "POST" }
      );
      const result = await response.json();
      if (!response.ok) {
        return;
      }
      setTempPassword(result.password);
    } finally {
      setPendingId(null);
    }
  }, []);

  const handleRevokeSessions = useCallback(async (user: AdminUserRow) => {
    setPendingId(user.id);
    try {
      await fetch(`/api/admin/users/${user.id}/revoke-sessions`, {
        method: "POST",
      });
    } finally {
      setPendingId(null);
    }
  }, []);

  const handleDeleteRequest = useCallback((user: AdminUserRow) => {
    setDeleteTarget(user);
  }, []);

  const handleDeleteOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setDeleteTarget(null);
    }
  }, []);

  const handleCancelDelete = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }
    setPendingId(deleteTarget.id);
    try {
      const response = await fetch(`/api/admin/users/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        return;
      }
      setRows((prev) => prev.filter((row) => row.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setPendingId(null);
    }
  }, [deleteTarget]);

  const handleTempPasswordOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setTempPassword(null);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleOpenAdd} size="sm">
          <Plus aria-hidden="true" className="size-4" />
          Add User
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
          No users yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
          <table className="w-full text-left text-sm">
            <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Last Sign In</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((user) => (
                <UserRow
                  currentUserId={currentUserId}
                  key={user.id}
                  onDeleteRequest={handleDeleteRequest}
                  onResetPassword={handleResetPassword}
                  onRevokeSessions={handleRevokeSessions}
                  onToggleRole={handleToggleRole}
                  pendingId={pendingId}
                  user={user}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateUserDialog
        onCreated={handleCreated}
        onOpenChange={handleAddOpenChange}
        open={addOpen}
      />

      <DeleteConfirmDialog
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        onOpenChange={handleDeleteOpenChange}
        pending={Boolean(pendingId) && pendingId === deleteTarget?.id}
        user={deleteTarget}
      />

      <TempPasswordDialog
        onOpenChange={handleTempPasswordOpenChange}
        password={tempPassword}
      />
    </div>
  );
}
