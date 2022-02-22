import { orderBy } from "firebase/firestore";

import React from "react";
import { useDispatch } from "react-redux";
import { from } from "rxjs";

import {
  setStaffRoles,
  setStaffRolesFetchError,
} from "../store/staff-role.slice";
import firebaseRepository from "./repo-instance";

export default function useGetAllStaffRoles(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const dispatch = useDispatch();

  function getStaffRoles() {
    setLoadingFlag(true);
    const obs$ = from(firebaseRepository.getAll([orderBy("createdAt")]));
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) {
        dispatch(setStaffRolesFetchError(res));
      } else {
        dispatch(setStaffRoles(res));
        dispatch(setStaffRolesFetchError(null));
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { loadingFlag, getStaffRoles };
}
