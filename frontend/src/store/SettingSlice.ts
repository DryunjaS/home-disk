import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "dark",
  fontSize: 16,
  timeModalOpen: false,
  isOpenDrawer: false,
  centerMap: { x: 52.93498, y: 36.0024 },
  zoomMap: 15,
  targetStyle: {
    style: {
      strokeStyle: "solid",
      strokeWidth: 5,
      strokeColorLine: { r: 251, g: 33, b: 33, a: 1 },
      strokeColorDot: { r: 251, g: 33, b: 33, a: 1 },
    },
  },
};

const settingsSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    toggleTimeModalOpen: (state) => {
      state.timeModalOpen = !state.timeModalOpen;
    },
    openDrawer: (state) => {
      state.isOpenDrawer = true;
    },
    closenDrawer: (state) => {
      state.isOpenDrawer = false;
    },
    increaseFontSize: (state) => {
      state.fontSize += 1;
    },
    decreaseFontSize: (state) => {
      if (state.fontSize > 10) {
        state.fontSize -= 1;
      }
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    setCenterMap: (state, action) => {
      state.centerMap = action.payload;
    },
    setZoomMap: (state, action) => {
      state.zoomMap = action.payload;
    },
    setTargetStyle: (state, action) => {
      state.targetStyle = action.payload;
    },
  },
});

export const {
  toggleTheme,
  increaseFontSize,
  decreaseFontSize,
  setFontSize,
  toggleTimeModalOpen,
  openDrawer,
  closenDrawer,
  setCenterMap,
  setZoomMap,
  setTargetStyle,
} = settingsSlice.actions;

export default settingsSlice.reducer;
