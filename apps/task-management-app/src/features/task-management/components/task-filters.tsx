import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TASK_PRIORITIES, TASK_STATUSES } from "../types";
import type { TaskFilters as TaskFiltersType } from "../types";
import { SearchIcon } from "lucide-react";

type TaskFiltersProps = {
	value: TaskFiltersType;
	onChange: (filters: TaskFiltersType) => void;
};

function TaskFilters({ value, onChange }: TaskFiltersProps) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
			<div className="relative w-full min-w-0 flex-1">
				<SearchIcon className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" aria-hidden />
				<Input
					placeholder="Search tasks…"
					value={value.search}
					onChange={(e) =>
						onChange({ ...value, search: e.target.value })
					}
					className="w-full min-w-0 pl-9"
					aria-label="Search tasks"
				/>
			</div>
			<div className="flex flex-wrap gap-2 sm:flex-nowrap sm:gap-3">
				<Select
					value={value.status}
					onValueChange={(status) =>
						onChange({
							...value,
							status: status as TaskFiltersType["status"],
						})
					}
				>
					<SelectTrigger className="h-9 w-full min-w-0 sm:w-[10rem]">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All statuses</SelectItem>
						{TASK_STATUSES.map((s) => (
							<SelectItem key={s} value={s}>
								{s.replace(/_/g, " ").toLowerCase()}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select
					value={value.priority}
					onValueChange={(priority) =>
						onChange({
							...value,
							priority: priority as TaskFiltersType["priority"],
						})
					}
				>
					<SelectTrigger className="h-9 w-full min-w-0 sm:w-[10rem]">
						<SelectValue placeholder="Priority" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All priorities</SelectItem>
						{TASK_PRIORITIES.map((p) => (
							<SelectItem key={p} value={p}>
								{p.charAt(0) + p.slice(1).toLowerCase()}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}

export { TaskFilters };
