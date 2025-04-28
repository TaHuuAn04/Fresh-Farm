import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  fullName: string;
  role: string;
  age: number;
  email: string;
  phoneNumber: string;
}

const initialState: InitialState = {
  fullName: "User",
  role: "customer",
  age: 0,
  email: "",
  phoneNumber: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeState: (state, action) => {
      state.fullName = action.payload.fullName;
      state.role = action.payload.role;
      state.age = action.payload.age;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
    },
  },
});

export const { changeState } = userSlice.actions;
export default userSlice.reducer;
