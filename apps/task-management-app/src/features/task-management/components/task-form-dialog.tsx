import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TASK_PRIORITIES, TASK_STATUSES, type Task } from "../types";
import type { CreateTaskFormValues, EditTaskFormValues } from "../schemas";
import { createTaskSchema, editTaskSchema } from "../schemas";

type TaskFormDialogMode = "create" | "edit";

type TaskFormDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: TaskFormDialogMode;
	task?: Task | null;
	onSubmit: (values: CreateTaskFormValues | EditTaskFormValues) => void;
	isSubmitting?: boolean;
};

const defaultCreateValues: CreateTaskFormValues = {
	title: "",
	description: "",
	status: "TODO",
	priority: "MEDIUM",
	dueDate: undefined,
};

function getDefaultEditValues(task: Task): EditTaskFormValues {
	return {
		title: task.title,
		description: task.description ?? "",
		status: task.status,
		priority: task.priority,
		dueDate: task.dueDate ?? undefined,
	};
}

function TaskFormDialog({
	open,
	onOpenChange,
	mode,
	task = null,
	onSubmit,
	isSubmitting = false,
}: TaskFormDialogProps) {
	const [values, setValues] = useState<CreateTaskFormValues | EditTaskFormValues>(
		defaultCreateValues,
	);
	const [errors, setErrors] = useState<
		Partial<Record<keyof CreateTaskFormValues, string>>
	>({});

	const isEdit = mode === "edit";
	const schema = isEdit ? editTaskSchema : createTaskSchema;

	useEffect(() => {
		if (open) {
			setValues(
				isEdit && task ? getDefaultEditValues(task) : defaultCreateValues,
			);
			setErrors({});
		}
	}, [open, isEdit, task]);

	function handleChange(
		field: keyof CreateTaskFormValues,
	): (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void {
		return (e) => {
			const value = e.target.value;
			setValues((prev) => ({ ...prev, [field]: value }));
			if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
		};
	}

	function handleStatusChange(value: string) {
		setValues((prev) => ({ ...prev, status: value as CreateTaskFormValues["status"] }));
		if (errors.status) setErrors((prev) => ({ ...prev, status: undefined }));
	}

	function handlePriorityChange(value: string) {
		setValues((prev) => ({ ...prev, priority: value as CreateTaskFormValues["priority"] }));
		if (errors.priority) setErrors((prev) => ({ ...prev, priority: undefined }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const payload = {
			...values,
			dueDate: values.dueDate?.trim() ? values.dueDate : undefined,
		};
		const result = schema.safeParse(payload);
		if (!result.success) {
			const fieldErrors: Partial<Record<keyof CreateTaskFormValues, string>> = {};
			for (const issue of result.error.issues) {
				const path = issue.path[0] as keyof CreateTaskFormValues;
				if (path && !fieldErrors[path]) fieldErrors[path] = issue.message;
			}
			setErrors(fieldErrors);
			return;
		}
		setErrors({});
		onSubmit(result.data);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{isEdit ? "Edit task" : "New task"}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} noValidate className="space-y-4">
					<div className="space-y-2">
						<Label
							htmlFor="task-title"
							className="after:content-['*'] after:ml-0.5 after:text-destructive"
						>
							Title
						</Label>
						<Input
							id="task-title"
							placeholder="Task title"
							value={values.title}
							onChange={handleChange("title")}
							aria-invalid={Boolean(errors.title)}
							className="w-full"
						/>
						{errors.title ? (
							<p className="text-destructive text-sm" role="alert">
								{errors.title}
							</p>
						) : null}
					</div>

					<div className="space-y-2">
						<Label htmlFor="task-description">Description</Label>
						<Textarea
							id="task-description"
							placeholder="Optional description"
							value={values.description}
							onChange={handleChange("description")}
							rows={3}
							className="resize-none w-full"
						/>
						{errors.description ? (
							<p className="text-destructive text-sm" role="alert">
								{errors.description}
							</p>
						) : null}
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="task-status">Status</Label>
							<Select
								value={values.status}
								onValueChange={handleStatusChange}
							>
								<SelectTrigger id="task-status" className="w-full">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									{TASK_STATUSES.map((s) => (
										<SelectItem key={s} value={s}>
											{s.replace(/_/g, " ").toLowerCase()}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="task-priority">Priority</Label>
							<Select
								value={values.priority}
								onValueChange={handlePriorityChange}
							>
								<SelectTrigger id="task-priority" className="w-full">
									<SelectValue placeholder="Priority" />
								</SelectTrigger>
								<SelectContent>
									{TASK_PRIORITIES.map((p) => (
										<SelectItem key={p} value={p}>
											{p.charAt(0) + p.slice(1).toLowerCase()}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="task-due">Due date (optional)</Label>
						<Input
							id="task-due"
							type="date"
							value={values.dueDate ?? ""}
							onChange={handleChange("dueDate")}
							className="w-full"
						/>
					</div>

					<DialogFooter className="flex-wrap gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting
								? "Saving…"
								: isEdit
									? "Save changes"
									: "Create task"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export { TaskFormDialog };
