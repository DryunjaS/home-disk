import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./SettingSlice";
import sensorReducer from "./SensorSlice";
import polygonReducer from "./PolygonSlice";
import journalReducer from "./JournalSlice";
import alertReducer from "./AlertSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};
const persistSensor = {
  key: "sensor",
  storage,
};
const persistPolygon = {
  key: "polygon",
  storage,
};
const persistJounal = {
  key: "jounal",
  storage,
};
const persistAlert = {
  key: "alert",
  storage,
};
const persistedReducerSetting = persistReducer(persistConfig, settingsReducer);
const persistedReducerSensor = persistReducer(persistSensor, sensorReducer);
const persistedReducerPolygon = persistReducer(persistPolygon, polygonReducer);
const persistedReducerJournal = persistReducer(persistJounal, journalReducer);
const persistedReducerAlert = persistReducer(persistAlert, alertReducer);

const store = configureStore({
  reducer: {
    settings: persistedReducerSetting,
    sensor: persistedReducerSensor,
    polygon: persistedReducerPolygon,
    journal: persistedReducerJournal,
    alert: persistedReducerAlert,
  },
});

export const persistor = persistStore(store);
export default store;

export type RootState = ReturnType<typeof store.getState>;
