import { CalendarIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Task } from "../types";

type TaskItemProps = {
	task: Task;
	onToggleComplete?: (task: Task) => void;
	onEdit?: (task: Task) => void;
	onDelete?: (task: Task) => void;
};

const statusVariant: Record<Task["status"], "secondary" | "default" | "outline"> = {
	TODO: "secondary",
	IN_PROGRESS: "default",
	DONE: "outline",
};

const priorityVariant: Record<Task["priority"], "ghost" | "secondary" | "destructive"> = {
	LOW: "ghost",
	MEDIUM: "secondary",
	HIGH: "destructive",
};

const priorityBorderClass: Record<Task["priority"], string> = {
	LOW: "border-l-muted",
	MEDIUM: "border-l-primary/50",
	HIGH: "border-l-destructive",
};

function formatDate(value: string | null): string {
	if (!value) return "";
	try {
		const d = new Date(value);
		return d.toLocaleDateString(undefined, {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	} catch {
		return value;
	}
}

function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
	const [deleteOpen, setDeleteOpen] = useState(false);
	const isDone = task.status === "DONE";

	return (
		<>
			<Card
				className={cn(
					"overflow-hidden border-l-4 rounded-xl shadow-sm transition-shadow hover:shadow-md",
					priorityBorderClass[task.priority],
				)}
			>
				<CardHeader className="flex flex-row items-start gap-4 py-5 sm:py-6">
					<div className="flex shrink-0 items-center pt-0.5">
						<Checkbox
							checked={isDone}
							onCheckedChange={() => onToggleComplete?.(task)}
							aria-label={isDone ? "Mark as incomplete" : "Mark as complete"}
						/>
					</div>
					<div className="min-w-0 flex-1 space-y-1.5">
						<h3
							className={cn(
								"font-medium leading-tight",
								isDone && "text-muted-foreground line-through",
							)}
						>
							{task.title}
						</h3>
						{task.description ? (
							<p
								className={cn(
									"text-muted-foreground text-sm leading-relaxed line-clamp-2",
									isDone && "line-through",
								)}
							>
								{task.description}
							</p>
						) : null}
						<div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-1">
							<Badge variant={statusVariant[task.status]} className="capitalize">
								{task.status.replace(/_/g, " ").toLowerCase()}
							</Badge>
							<Badge variant={priorityVariant[task.priority]}>
								{task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
							</Badge>
							{task.dueDate ? (
								<span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
									<CalendarIcon className="size-3.5 shrink-0" aria-hidden />
									Due {formatDate(task.dueDate)}
								</span>
							) : null}
						</div>
					</div>
				</CardHeader>
				<CardContent className="px-6 pb-0 pt-0">
					{/* Spacer for layout when no extra content */}
				</CardContent>
				<CardFooter className="flex flex-wrap justify-end gap-2 border-t px-6 py-3 sm:py-4">
					<Button
						variant="ghost"
						size="sm"
						className="min-h-10 min-w-10 touch-manipulation sm:min-h-9 sm:min-w-9"
						onClick={() => onEdit?.(task)}
						aria-label="Edit task"
					>
						<PencilIcon className="size-4 shrink-0" aria-hidden />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="min-h-10 min-w-10 touch-manipulation text-destructive hover:bg-destructive/10 hover:text-destructive sm:min-h-9 sm:min-w-9"
						onClick={() => setDeleteOpen(true)}
						aria-label="Delete task"
					>
						<Trash2Icon className="size-4 shrink-0" aria-hidden />
					</Button>
				</CardFooter>
			</Card>

			<AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<AlertDialogContent size="sm">
					<AlertDialogHeader>
						<AlertDialogTitle>Delete task?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete &quot;{task.title}&quot;. This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							onClick={() => {
								onDelete?.(task);
								setDeleteOpen(false);
							}}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export { TaskItem };
