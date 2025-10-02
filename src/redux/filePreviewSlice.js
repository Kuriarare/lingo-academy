import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  fileUrl: null,
};

const filePreviewSlice = createSlice({
  name: "filePreview",
  initialState,
  reducers: {
    openFilePreview: (state, action) => {
      state.isOpen = true;
      state.fileUrl = action.payload;
    },
    closeFilePreview: (state) => {
      state.isOpen = false;
      state.fileUrl = null;
    },
  },
});

export const { openFilePreview, closeFilePreview } = filePreviewSlice.actions;
export default filePreviewSlice.reducer;