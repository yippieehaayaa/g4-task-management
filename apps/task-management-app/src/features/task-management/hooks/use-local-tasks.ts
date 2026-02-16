import { useCallback, useMemo, useState } from "react";
import type { Task, TaskFilters } from "../types";
import type { CreateTaskFormValues, EditTaskFormValues } from "../schemas";

const defaultFilters: TaskFilters = {
	search: "",
	status: "all",
	priority: "all",
};

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

function generateId(): string {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function useLocalTasks(initialTasks: Task[] = []) {
	const [tasks, setTasks] = useState<Task[]>(initialTasks);
	const [filters, setFilters] = useState<TaskFilters>(defaultFilters);

	const filteredTasks = useMemo(
		() => filterTasks(tasks, filters),
		[tasks, filters],
	);

	const addTask = useCallback((values: CreateTaskFormValues) => {
		const now = new Date().toISOString();
		const task: Task = {
			id: generateId(),
			title: values.title,
			description: values.description,
			status: values.status,
			priority: values.priority,
			dueDate: values.dueDate?.trim() ?? null,
			createdAt: now,
			updatedAt: now,
		};
		setTasks((prev) => [task, ...prev]);
	}, []);

	const updateTask = useCallback((id: string, values: EditTaskFormValues) => {
		setTasks((prev) =>
			prev.map((t) =>
				t.id === id
					? {
							...t,
							...values,
							dueDate: values.dueDate?.trim() ?? null,
							updatedAt: new Date().toISOString(),
						}
					: t,
			),
		);
	}, []);

	const deleteTask = useCallback((id: string) => {
		setTasks((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const toggleTaskStatus = useCallback((task: Task) => {
		const nextStatus =
			task.status === "DONE" ? "TODO" : "DONE";
		setTasks((prev) =>
			prev.map((t) =>
				t.id === task.id
					? { ...t, status: nextStatus, updatedAt: new Date().toISOString() }
					: t,
			),
		);
	}, []);

	return {
		tasks: filteredTasks,
		allTasks: tasks,
		filters,
		setFilters,
		addTask,
		updateTask,
		deleteTask,
		toggleTaskStatus,
	};
}

export { useLocalTasks };
