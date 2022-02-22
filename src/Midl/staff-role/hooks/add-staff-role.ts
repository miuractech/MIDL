import { where } from "firebase/firestore";
import React from "react";
import { useDispatch } from "react-redux";
import { ApplicationError } from "rxf";
import { from } from "rxjs";

import { setAddedRole, setStaffRolesAddError } from "../store/staff-role.slice";
import { roleOptions } from "../types";
import firebaseRepository from "./repo-instance";

async function addStaffRoleAsyncWrapper(payload: {
  id: string;
  email: string;
  role: roleOptions;
}) {
  const dup = await firebaseRepository.getAll([
    where("email", "==", payload.email),
  ]);
  if ("severity" in dup) return dup;
  else if (dup.length > 0) {
    return new ApplicationError().handleCustomError(
      "Duplicate Field",
      "Duplicate Email",
      "The Email is Already Taken",
      "info"
    );
  } else
    return await firebaseRepository.createOne(
      { ...payload, disabled: false },
      payload.id
    );
}

export default function useAddStaffRole(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const dispatch = useDispatch();

  function addStaffRole(payload: {
    id: string;
    email: string;
    role: roleOptions;
  }) {
    setLoadingFlag(true);
    const obs$ = from(addStaffRoleAsyncWrapper(payload));
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) dispatch(setStaffRolesAddError(res));
      else {
        dispatch(setAddedRole(res));
        dispatch(setStaffRolesAddError(null));
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { loadingFlag, addStaffRole };
}
