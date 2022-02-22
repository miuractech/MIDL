import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TApplicationErrorObject } from "rxf";
import { TMetaProductSubCategory } from "../types";

interface TState {
  metaProductSubCategories: Array<TMetaProductSubCategory>;
  fetchError: TApplicationErrorObject | null;
  editError: TApplicationErrorObject | null;
  addError: TApplicationErrorObject | null;
}

const state: TState = {
  metaProductSubCategories: [],
  fetchError: null,
  editError: null,
  addError: null,
};

export const metaProductSubCategorySlice = createSlice({
  name: "metaProductSubCategory",
  initialState: state,
  reducers: {
    setMetaProductSubCategories: (
      state: TState,
      action: PayloadAction<Array<TMetaProductSubCategory>>
    ) => {
      state.metaProductSubCategories = action.payload;
    },
    setMetaProductSubCategoryFetchError: (
      state: TState,
      action: PayloadAction<TApplicationErrorObject | null>
    ) => {
      state.fetchError = action.payload;
    },
    setEditedMetaProductSubCategory: (
      state: TState,
      action: PayloadAction<TMetaProductSubCategory>
    ) => {
      const find = state.metaProductSubCategories.findIndex(
        (s) => s.id === action.payload.id
      );
      if (find !== -1) state.metaProductSubCategories[find] = action.payload;
    },
    setMetaProductSubCategoryEditError: (
      state: TState,
      action: PayloadAction<TApplicationErrorObject | null>
    ) => {
      state.editError = action.payload;
    },
    setAddedMetaProductSubCategory: (
      state: TState,
      action: PayloadAction<TMetaProductSubCategory>
    ) => {
      state.metaProductSubCategories.push(action.payload);
    },
    setMetaProductSubCategoryAddError: (
      state: TState,
      action: PayloadAction<TApplicationErrorObject | null>
    ) => {
      state.addError = action.payload;
    },
  },
});

export const {
  setMetaProductSubCategories,
  setAddedMetaProductSubCategory,
  setEditedMetaProductSubCategory,
  setMetaProductSubCategoryAddError,
  setMetaProductSubCategoryEditError,
  setMetaProductSubCategoryFetchError,
} = metaProductSubCategorySlice.actions;
export default metaProductSubCategorySlice.reducer;
