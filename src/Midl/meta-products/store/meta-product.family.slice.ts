import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TApplicationErrorObject } from "rxf";
import { TMetaProductFamily } from "../types";

interface TState {
  metaProductFamilies: Array<TMetaProductFamily>;
  fetchError: TApplicationErrorObject | null;
  editError: TApplicationErrorObject | null;
  addError: TApplicationErrorObject | null;
}

const state: TState = {
  metaProductFamilies: [],
  fetchError: null,
  editError: null,
  addError: null,
};

const metaProductFamilySlice = createSlice({
  name: "metaProductFamily",
  initialState: state,
  reducers: {
    setMetaProductFamilies: (
      state: TState,
      action: PayloadAction<Array<TMetaProductFamily>>
    ) => {
      state.metaProductFamilies = action.payload;
    },
    setMetaProductFamilyFetchError: (
      state: TState,
      action: PayloadAction<TApplicationErrorObject | null>
    ) => {
      state.fetchError = action.payload;
    },
    setEditedMetaProductFamily: (
      state: TState,
      action: PayloadAction<TMetaProductFamily>
    ) => {
      const find = state.metaProductFamilies.findIndex(
        (s) => s.id === action.payload.id
      );
      if (find !== -1) state.metaProductFamilies[find] = action.payload;
    },
    setMetaProductFamilyEditError: (
      state: TState,
      action: PayloadAction<TApplicationErrorObject | null>
    ) => {
      state.editError = action.payload;
    },
    setAddedMetaProductFamily: (
      state: TState,
      action: PayloadAction<TMetaProductFamily>
    ) => {
      state.metaProductFamilies.push(action.payload);
    },
    setMetaProductFamilyAddError: (
      state: TState,
      action: PayloadAction<TApplicationErrorObject | null>
    ) => {
      state.addError = action.payload;
    },
  },
});

export const {
  setAddedMetaProductFamily,
  setEditedMetaProductFamily,
  setMetaProductFamilies,
  setMetaProductFamilyAddError,
  setMetaProductFamilyEditError,
  setMetaProductFamilyFetchError,
} = metaProductFamilySlice.actions;
export default metaProductFamilySlice.reducer;
