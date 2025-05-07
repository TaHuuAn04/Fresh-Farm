import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  fullName: string;
  role: string;
  age: number;
  email: string;
  phoneNumber: string;
  id: string;
  isAuthenticated: boolean;
}

const initialState: InitialState = {
  fullName: "User",
  role: "customer",
  age: 0,
  email: "",
  phoneNumber: "",
  id: "",
  isAuthenticated: false,
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
      state.isAuthenticated = action.payload.isAuthenticated;
      state.id = action.payload.id;
    },
  },
});

export const { changeState } = userSlice.actions;
export default userSlice.reducer;
