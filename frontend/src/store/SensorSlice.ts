import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Sensor {
  id: string;
  name: string;
  status?: string;
}

interface SensorState {
  sensorList: Sensor[];
  currentSensor: Sensor | null;
}

const initialState: SensorState = {
  sensorList: [],
  currentSensor: null,
};

const sensorSlice = createSlice({
  name: "sensor",
  initialState,
  reducers: {
    setCurrentSensor: (state, action: PayloadAction<Sensor | null>) => {
      state.currentSensor = action.payload;
    },
    setSensorList: (state, action: PayloadAction<Sensor[]>) => {
      if (Array.isArray(action.payload)) {
        state.sensorList = action.payload;
      } else {
        state.sensorList = [];
      }
    },

    addSensor: (state, action: PayloadAction<Sensor>) => {
      const exists = state.sensorList.find(
        (sensor) => sensor.id === action.payload.id
      );

      if (!exists) {
        state.sensorList = [...state.sensorList, action.payload];
      }
    },

    updateSensor: (state, action: PayloadAction<Sensor>) => {
      const updatedSensor = action.payload;

      state.sensorList = state.sensorList.map((sensor) =>
        sensor.id === updatedSensor.id ? updatedSensor : sensor
      );
    },
    updateStatus: (
      state,
      action: PayloadAction<{ id: string; status: string }>
    ) => {
      const { id, status } = action.payload;
      state.sensorList = state.sensorList.map((sensor) =>
        sensor.id === id ? { ...sensor, status } : sensor
      );
    },
    deleteSensor: (state, action: PayloadAction<{ id: string }>) => {
      state.sensorList = state.sensorList.filter(
        (sensor) => sensor.id !== action.payload.id
      );
    },
  },
});

export const {
  setSensorList,
  addSensor,
  updateSensor,
  updateStatus,
  deleteSensor,
  setCurrentSensor,
} = sensorSlice.actions;

export default sensorSlice.reducer;
