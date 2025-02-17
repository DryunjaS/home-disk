import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Journal {
  id: string;
  idSensor: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EventUnknown {
  id: string;
  description: string;
}

interface JournalState {
  journalList: Journal[];
  eventsUnknown: EventUnknown[];
  journalCount: number;
}

const initialState: JournalState = {
  journalList: [],
  eventsUnknown: [],
  journalCount: 0,
};

const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    setJournalList: (state, action: PayloadAction<Journal[]>) => {
      state.journalList = action.payload;
    },
    incrementJournalCount: (state) => {
      state.journalCount += 1;
    },
    removeJournalList: (state) => {
      state.journalList = [];
    },
    addJournal: (state, action: PayloadAction<Journal>) => {
      state.journalList = [action.payload];
    },
    addEventsUnknown: (state, action: PayloadAction<EventUnknown>) => {
      state.eventsUnknown = [...state.eventsUnknown, action.payload];
    },
    removeEventsUnknown: (state, action: PayloadAction<{ id: string }>) => {
      state.eventsUnknown = state.eventsUnknown.filter(
        // @ts-ignore
        (event) => event.sensor.id !== action.payload.id
      );
    },
    removeEventsAll: (state) => {
      state.eventsUnknown = [];
    },
  },
});

export const {
  setJournalList,
  addJournal,
  addEventsUnknown,
  removeEventsUnknown,
  removeEventsAll,
  removeJournalList,
  incrementJournalCount,
} = journalSlice.actions;

export default journalSlice.reducer;
