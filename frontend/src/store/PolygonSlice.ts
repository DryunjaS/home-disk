import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Polygon {
  id: string;
  name: string;
}

interface PolygonState {
  polygonList: any[];
}

const initialState: PolygonState = {
  polygonList: [],
};

const polygonSlice = createSlice({
  name: "polygon",
  initialState,
  reducers: {
    setPolygonList: (state, action: PayloadAction<Polygon[]>) => {
      if (Array.isArray(action.payload)) {
        state.polygonList = action.payload;
      } else {
        state.polygonList = [];
      }
    },

    addPolygonStore: (state, action: PayloadAction<Polygon>) => {
      state.polygonList = [...state.polygonList, action.payload];
    },
    updatePolygon: (state, action: PayloadAction<Polygon>) => {
      state.polygonList = state.polygonList.map((polygon) => {
        if (polygon.id === action.payload.id) {
          return {
            ...action.payload,
          };
        }
        return polygon;
      });
    },
    deletePolygon: (state, action: PayloadAction<string>) => {
      state.polygonList = state.polygonList.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

export const { setPolygonList, addPolygonStore, updatePolygon, deletePolygon } =
  polygonSlice.actions;

export default polygonSlice.reducer;
