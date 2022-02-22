import React from "react";
import { useDispatch } from "react-redux";
import { from } from "rxjs";

import {
  setEditedRole,
  setStaffRolesEditError,
} from "../store/staff-role.slice";
import { roleOptions } from "../types";
import firebaseRepository from "./repo-instance";

export default function useUpdateStaffRole(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const dispatch = useDispatch();

  function updateRole(role: roleOptions, id: string) {
    setLoadingFlag(true);
    const obs$ = from(firebaseRepository.updateOne({ role: role }, id));
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) dispatch(setStaffRolesEditError(res));
      else {
        dispatch(setEditedRole(res));
        dispatch(setStaffRolesEditError(null));
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  function enableStaff(id: string) {
    setLoadingFlag(true);
    const obs$ = from(firebaseRepository.updateOne({ disabled: false }, id));
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) dispatch(setStaffRolesEditError(res));
      else {
        dispatch(setEditedRole(res));
        dispatch(setStaffRolesEditError(null));
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  function disableStaff(id: string) {
    setLoadingFlag(true);
    const obs$ = from(firebaseRepository.updateOne({ disabled: true }, id));
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) dispatch(setStaffRolesEditError(res));
      else {
        dispatch(setEditedRole(res));
        dispatch(setStaffRolesEditError(null));
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { loadingFlag, updateRole, enableStaff, disableStaff };
}
