import { createSlice } from "@reduxjs/toolkit";
import type { TaskFilters } from "@/features/task-management/types";

const defaultFilters: TaskFilters = {
	search: "",
	status: "all",
	priority: "all",
};

interface TaskUiState {
	filters: TaskFilters;
	formOpen: boolean;
	editingTaskId: string | null;
}

const initialState: TaskUiState = {
	filters: defaultFilters,
	formOpen: false,
	editingTaskId: null,
};

export const taskUiSlice = createSlice({
	name: "taskUi",
	initialState,
	reducers: {
		setFilters(state, action: { payload: TaskFilters }) {
			state.filters = action.payload;
		},
		setFormOpen(state, action: { payload: boolean }) {
			state.formOpen = action.payload;
			if (!action.payload) {
				state.editingTaskId = null;
			}
		},
		openCreateForm(state) {
			state.editingTaskId = null;
			state.formOpen = true;
		},
		openEditForm(state, action: { payload: string }) {
			state.editingTaskId = action.payload;
			state.formOpen = true;
		},
		closeForm(state) {
			state.formOpen = false;
			state.editingTaskId = null;
		},
	},
});

export const {
	setFilters,
	setFormOpen,
	openCreateForm,
	openEditForm,
	closeForm,
} = taskUiSlice.actions;
