/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import {
  adminAddLessonAction,
  adminGetLessons,
  deleteLessonAction,
} from "../../actions/admin/adminLessonAction"

export interface LessonState {
  lessonData: any | null;
  error: string | null;
  loading: boolean;
  lessons: any[];
  message: string | null;
}

const initialState: LessonState = {
  lessonData: null,
  error: null,
  loading: false,
  lessons: [],
  message: null,
};

export const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    updateLessonError: (state, { payload }) => {
      state.error = payload;
    },
    clearLessonMessage: (state) => {
      state.message = null;
      state.error = null;
    },
    resetLessonState: (state) => {
      state.lessonData = null;
      state.error = null;
      state.loading = false;
      state.message = null;
      state.lessons = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Lesson
      .addCase(adminAddLessonAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(adminAddLessonAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.lessonData = payload;
        state.message = "Lesson added successfully!";
        if (payload && payload.lesson) {
          state.lessons.push(payload.lesson);
        }
      })
      .addCase(adminAddLessonAction.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // Get Lessons
      .addCase(adminGetLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminGetLessons.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.lessons = payload.lessons || [];
      })
      .addCase(adminGetLessons.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // Delete Lesson
      .addCase(deleteLessonAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLessonAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = "Lesson deleted successfully!";
        // filter out deleted lesson
        if (payload && payload.deletedId) {
          state.lessons = state.lessons.filter(
            (lesson) => lesson._id !== payload.deletedId
          );
        }
      })
      .addCase(deleteLessonAction.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });
  },
});

export const {
  updateLessonError,
  clearLessonMessage,
  resetLessonState,
} = lessonSlice.actions;

export default lessonSlice.reducer;
