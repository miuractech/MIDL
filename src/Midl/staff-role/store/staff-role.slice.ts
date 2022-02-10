import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TApplicationErrorObject } from "../../../lib";
import { TStaffRole } from "../../../types/role.types";

interface TState {
  staffRole: Array<TStaffRole>;
  fetchError: TApplicationErrorObject | null;
  editError: TApplicationErrorObject | null;
  addError: TApplicationErrorObject | null;
}

const state: TState = {
  staffRole: [],
  fetchError: null,
  editError: null,
  addError: null,
};

export const staffRoleSlice = createSlice({
  name: "staff-roles",
  initialState: state,
  reducers: {
    setStaffRoles: (
      state: TState,
      action: PayloadAction<Array<TStaffRole>>
    ) => {
      state.staffRole = action.payload;
      return state;
    },
    setStaffRolesFetchError: (
      state: TState,
      action: PayloadAction<TApplicationErrorObject | null>
    ) => {
      state.fetchError = action.payload;
      return state;
    },
    setEditedRole: (state: TState, action: PayloadAction<TStaffRole>) => {
      const find = state.staffRole.findIndex((s) => s.id === action.payload.id);
      if (find !== -1) state.staffRole[find] = action.payload;
      return state;
    },
    setStaffRolesEditError: (
      state: TState,
      action: PayloadAction<TApplicationErrorObject | null>
    ) => {
      state.editError = action.payload;
      return state;
    },
    setAddedRole: (state: TState, action: PayloadAction<TStaffRole>) => {
      state.staffRole.push(action.payload);
      return state;
    },
    setStaffRolesAddError: (
      state: TState,
      action: PayloadAction<TApplicationErrorObject | null>
    ) => {
      state.addError = action.payload;
      return state;
    },
  },
});

export const {
  setStaffRoles,
  setStaffRolesFetchError,
  setEditedRole,
  setAddedRole,
  setStaffRolesAddError,
  setStaffRolesEditError,
} = staffRoleSlice.actions;

export default staffRoleSlice.reducer;
