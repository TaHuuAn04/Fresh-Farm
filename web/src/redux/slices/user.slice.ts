import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  fullName: string;
  role: string;
}

const initialState: InitialState = { fullName: "User", role: "customer" };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeState: (state, action) => {
      state.fullName = action.payload.fullName;
      state.role = action.payload.role;
    },
  },
});

export const { changeState } = userSlice.actions;
export default userSlice.reducer;
