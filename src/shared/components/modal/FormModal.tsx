import { Loader2Icon } from "lucide-react";
import type { FormEventHandler, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  submitLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  /** Mock-API/server error surfaced inline above the footer. */
  error?: string | null;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
};

/**
 * Modal shell for create/edit/assign forms: dialog + form element,
 * inline submit error, and a footer with cancel/submit buttons that
 * lock while the mutation is pending.
 */
export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isPending = false,
  error,
  onSubmit,
  children,
}: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={onSubmit} className="grid gap-4" noValidate>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : null}
          </DialogHeader>
          <div className="grid gap-4">{children}</div>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline" disabled={isPending} />
              }
            >
              {cancelLabel}
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2Icon className="animate-spin" /> : null}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
