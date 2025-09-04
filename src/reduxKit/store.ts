/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth/authSlice";
import courseSlice from "./reducers/admin/adminCourse";
import { userLanguageSlice } from "./reducers/auth/authSlice";
import { adminLanguageSlice } from "./reducers/admin/adminLanguage";
import { lessonSlice } from "./reducers/admin/adminLesson";
export const store = configureStore({
    reducer:{
        auth:authSlice.reducer,
        userLanguage:userLanguageSlice.reducer,
        adminLanguage:adminLanguageSlice.reducer,
        course:courseSlice.reducer,
        lesson:lessonSlice.reducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export type ExtendedAppDispatch = (action: any) => any;
export default store;