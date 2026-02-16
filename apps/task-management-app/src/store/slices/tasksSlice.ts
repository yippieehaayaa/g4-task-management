import { createSlice } from "@reduxjs/toolkit";
import type {
	CreateTaskFormValues,
	EditTaskFormValues,
} from "@/features/task-management/schemas";
import type { Task, TaskFilters } from "@/features/task-management/types";

const defaultFilters: TaskFilters = {
	search: "",
	status: "all",
	priority: "all",
};

function generateId(): string {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export interface TasksState {
	items: Task[];
	filters: TaskFilters;
}

const initialState: TasksState = {
	items: [],
	filters: defaultFilters,
};

export const tasksSlice = createSlice({
	name: "tasks",
	initialState,
	reducers: {
		addTask(state, action: { payload: CreateTaskFormValues }) {
			const now = new Date().toISOString();
			const task: Task = {
				id: generateId(),
				title: action.payload.title,
				description: action.payload.description,
				status: action.payload.status,
				priority: action.payload.priority,
				dueDate: action.payload.dueDate?.trim() ?? null,
				createdAt: now,
				updatedAt: now,
			};
			state.items.unshift(task);
		},
		updateTask(
			state,
			action: { payload: { id: string; values: EditTaskFormValues } },
		) {
			const { id, values } = action.payload;
			const index = state.items.findIndex((t) => t.id === id);
			if (index === -1) return;
			state.items[index] = {
				...state.items[index],
				...values,
				dueDate: values.dueDate?.trim() ?? null,
				updatedAt: new Date().toISOString(),
			};
		},
		deleteTask(state, action: { payload: string }) {
			state.items = state.items.filter((t) => t.id !== action.payload);
		},
		toggleTaskStatus(state, action: { payload: Task }) {
			const task = state.items.find((t) => t.id === action.payload.id);
			if (!task) return;
			task.status = task.status === "DONE" ? "TODO" : "DONE";
			task.updatedAt = new Date().toISOString();
		},
		setFilters(state, action: { payload: TaskFilters }) {
			state.filters = action.payload;
		},
		setInitialTasks(state, action: { payload: Task[] }) {
			state.items = action.payload;
		},
	},
});

export const {
	addTask,
	updateTask,
	deleteTask,
	toggleTaskStatus,
	setFilters,
	setInitialTasks,
} = tasksSlice.actions;
