import { User } from "firebase/auth";
import React from "react";
import { from } from "rxjs";

import { ADMIN, TUserIsAdmin } from "../settings";

export default function useFetchUserIsAdmin(userParam: User | null): {
  isAdmin: TUserIsAdmin;
  loadingIsAdminFlag: boolean;
} {
  const [isAdmin, setIsAdmin] = React.useState<TUserIsAdmin>("isNotSignedIn");
  const [loadingIsAdminFlag, setLoadingIsAdminFlag] = React.useState(false);

  React.useEffect(() => {
    setLoadingIsAdminFlag(true);
    const observable$ = from(
      userParam !== null
        ? userParam?.getIdTokenResult()
        : new Promise<null>((res, rej) => res(null))
    );
    const sub = observable$.subscribe((token) => {
      if (token !== null) {
        if (token !== undefined && token.claims["role"] === ADMIN) {
          setIsAdmin("isAdmin");
        } else {
          setIsAdmin("isNotAdmin");
        }
      }
      setLoadingIsAdminFlag(false);
    });
    return () => sub.unsubscribe();
  }, [userParam]);

  return { isAdmin, loadingIsAdminFlag };
}
