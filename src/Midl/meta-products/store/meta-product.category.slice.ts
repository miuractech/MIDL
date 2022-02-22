import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TApplicationErrorObject } from "rxf";

import { TMetaProductCategory } from "../types";

interface TState {
  metaProductCategories: Array<TMetaProductCategory>;
  fetchError: TApplicationErrorObject | null;
  editError: TApplicationErrorObject | null;
  addError: TApplicationErrorObject | null;
}

const state: TState = {
  metaProductCategories: [],
  fetchError: null,
  editError: null,
  addError: null,
};

export const metaProductCategorySlice = createSlice({
  name: "metaProductCategory",
  initialState: state,
  reducers: {
    setMetaProductCategories: (
      state: TState,
      action: PayloadAction<Array<TMetaProductCategory>>
    ) => {
      state.metaProductCategories = action.payload;
    },
    setMetaProductCategoryFetchError: (
      state: TState,
      action: PayloadAction<TApplicationErrorObject | null>
    ) => {
      state.fetchError = action.payload;
    },
    setEditedMetaProductCategory: (
      state: TState,
      action: PayloadAction<TMetaProductCategory>
    ) => {
      const find = state.metaProductCategories.findIndex(
        (s) => s.id === action.payload.id
      );
      if (find !== -1) state.metaProductCategories[find] = action.payload;
    },
    setMetaProductCategoryEditError: (
      state: TState,
      action: PayloadAction<TApplicationErrorObject | null>
    ) => {
      state.editError = action.payload;
    },
    setAddedMetaProductCategory: (
      state: TState,
      action: PayloadAction<TMetaProductCategory>
    ) => {
      state.metaProductCategories.push(action.payload);
    },
    setMetaProductCategoryAddError: (
      state: TState,
      action: PayloadAction<TApplicationErrorObject | null>
    ) => {
      state.addError = action.payload;
    },
  },
});

export const {
  setAddedMetaProductCategory,
  setEditedMetaProductCategory,
  setMetaProductCategories,
  setMetaProductCategoryAddError,
  setMetaProductCategoryEditError,
  setMetaProductCategoryFetchError,
} = metaProductCategorySlice.actions;
export default metaProductCategorySlice.reducer;
