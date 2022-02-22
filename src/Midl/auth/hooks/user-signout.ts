import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { from } from "rxjs";

import { RootState } from "../../../store";
import { setAdminUserState } from "../store/admin.user.slice";
import firebaseAuth from "./auth-instance";

export default function useUserSignOut(mounted: boolean) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.adminUser.user);
  const [loadingFlag, setLoadingFlag] = React.useState(false);

  function userSignOut() {
    setLoadingFlag(true);
    const obs$ = from(firebaseAuth.firebaseUserSignOut());
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) {
        dispatch(
          setAdminUserState({
            user: user,
            userLoading: false,
            error: res.message,
            signOutMessage: "",
          })
        );
      } else {
        dispatch(
          setAdminUserState({
            user: null,
            userLoading: false,
            error: "",
            signOutMessage: res.message,
          })
        );
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { loadingFlag, userSignOut };
}
