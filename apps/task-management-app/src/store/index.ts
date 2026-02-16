import { configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { taskUiSlice } from "./slices/task-ui-slice";

export const store = configureStore({
	reducer: {
		taskUi: taskUiSlice.reducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/** Typed useSelector; use instead of plain useSelector. */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/** Typed useDispatch; use instead of plain useDispatch. */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
