import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAlert {
  id: string;
  text: string;
  open: boolean;
  status: "success" | "warning" | "error" | "info";
  duration: number;
  createdAt: number;
}

interface AlertState {
  alertList: IAlert[];
}

const initialState: AlertState = {
  alertList: [],
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    addAlert: (
      state,
      action: PayloadAction<{
        text: string;
        status: "success" | "warning" | "error" | "info";
        duration: number;
      }>
    ) => {
      const { text, status, duration } = action.payload;
      const id = Date.now().toString();
      const newAlert: IAlert = {
        id,
        text,
        status,
        open: true,
        duration,
        createdAt: new Date().getTime(),
      };
      state.alertList = [
        newAlert,
        ...state.alertList.filter((alert) => alert.id !== id),
      ];
    },

    closeAlert: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const alertIndex = state.alertList.findIndex((alert) => alert.id === id);
      if (alertIndex !== -1) {
        state.alertList[alertIndex].open = false;
      }
    },

    removeAlert: (state, action: PayloadAction<string>) => {
      state.alertList = state.alertList.filter(
        (alert) => alert.id !== action.payload
      );
    },
    removeAll: (state) => {
      state.alertList = [];
    },
  },
});

export const { addAlert, closeAlert, removeAlert, removeAll } =
  alertSlice.actions;
export default alertSlice.reducer;
