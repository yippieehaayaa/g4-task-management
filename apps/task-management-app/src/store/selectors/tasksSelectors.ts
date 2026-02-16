import type { Task, TaskFilters } from "@/features/task-management/types";
import type { RootState } from "../index";

function matchesSearch(task: Task, search: string): boolean {
	if (!search.trim()) return true;
	const q = search.trim().toLowerCase();
	return (
		task.title.toLowerCase().includes(q) ||
		task.description.toLowerCase().includes(q)
	);
}

function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
	return tasks.filter((task) => {
		if (!matchesSearch(task, filters.search)) return false;
		if (filters.status !== "all" && task.status !== filters.status)
			return false;
		if (filters.priority !== "all" && task.priority !== filters.priority)
			return false;
		return true;
	});
}

/** All task items in the store. */
export const selectTasksItems = (state: RootState) => state.tasks.items;

/** Current filters. */
export const selectTasksFilters = (state: RootState) => state.tasks.filters;

/** Tasks filtered by current search, status, and priority. */
export const selectFilteredTasks = (state: RootState): Task[] =>
	filterTasks(state.tasks.items, state.tasks.filters);
