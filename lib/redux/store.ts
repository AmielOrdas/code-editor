// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./slice";

const store = configureStore({
  reducer: rootReducer,
});
export type RootState = ReturnType<typeof store.getState>;
export type TDispatch = typeof store.dispatch;
export default store;
