import { configureStore } from "@reduxjs/toolkit";
import spinnerReducer from "./slices/spinnerSlice";

export const store = configureStore({
  reducer: {
    spinner: spinnerReducer,
  },
});

// Lấy kiểu RootState & AppDispatch để dùng trong useSelector và useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
