import { createSlice } from "@reduxjs/toolkit";

interface SpinnerState {
  reload: boolean;
}

const initialState: SpinnerState = { reload: false };

const reloadSlice = createSlice({
  name: "reload",
  initialState,
  reducers: {
    setReload: (state) => {
      state.reload = !state.reload;
    },
  },
});

export const { setReload } = reloadSlice.actions;
export default reloadSlice.reducer;
