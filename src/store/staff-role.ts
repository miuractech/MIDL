import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TApplicationErrorObject } from "../lib";
import { TStaffRole } from "../types/role.types";

interface TState {
  staffRoles: Array<TStaffRole>;
  fetchError: TApplicationErrorObject | null;
  editError: TApplicationErrorObject | null;
  addError: TApplicationErrorObject | null;
}

const state: TState = {
  staffRoles: [],
  fetchError: null,
  editError: null,
  addError: null,
};

export const staffRolesSlice = createSlice({
  name: "staff-roles",
  initialState: state,
  reducers: {
    setRoles: (state: TState, action: PayloadAction<Array<TStaffRole>>) => {
      state.staffRoles = action.payload;
    },
    setStaffRolesFetchError: (
      state: TState,
      action: PayloadAction<TApplicationErrorObject | null>
    ) => {
      state.fetchError = action.payload;
    },
    setEditedRole: (state: TState, action: PayloadAction<TStaffRole>) => {
      const find = state.staffRoles.findIndex(
        (s) => s.id === action.payload.id
      );
      if (find !== -1) state.staffRoles[find] = action.payload;
    },
    setStaffRolesEditError: (
      state: TState,
      action: PayloadAction<TApplicationErrorObject | null>
    ) => {
      state.editError = action.payload;
    },
    setAddedRole: (state: TState, action: PayloadAction<TStaffRole>) => {
      state.staffRoles.push(action.payload);
    },
    setStaffRolesAddError: (
      state: TState,
      action: PayloadAction<TApplicationErrorObject | null>
    ) => {
      state.addError = action.payload;
    },
  },
});

export const {
  setRoles,
  setStaffRolesFetchError,
  setEditedRole,
  setAddedRole,
  setStaffRolesAddError,
  setStaffRolesEditError,
} = staffRolesSlice.actions;

export default staffRolesSlice.reducer;
