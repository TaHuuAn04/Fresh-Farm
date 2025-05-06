import { createSlice } from "@reduxjs/toolkit";

interface SpinnerState {
  appear: boolean;
}

const initialState: SpinnerState = { appear: false };

const spinnerSlice = createSlice({
  name: "spinner",
  initialState,
  reducers: {
    appearSpinner: (state) => {
      state.appear = true;
    },
    disappearSpinner: (state) => {
      state.appear = false;
    },
  },
});

export const { appearSpinner, disappearSpinner } = spinnerSlice.actions;
export default spinnerSlice.reducer;
