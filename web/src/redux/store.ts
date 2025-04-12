import { configureStore } from "@reduxjs/toolkit";
import spinnerReducer from "./slices/spinnerSlice";
import userReducer from "./slices/user.slice";

export const store = configureStore({
  reducer: {
    spinner: spinnerReducer,
    user: userReducer,
  },
});

// Lấy kiểu RootState & AppDispatch để dùng trong useSelector và useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
