import { User } from "firebase/auth";
import React from "react";
import { from } from "rxjs";

import { ADMIN } from "../settings";

/**
 * The User's Admin-State Type
 */
export type TUserIsAdmin = "isAdmin" | "isNotAdmin" | "isNotSignedIn";

/**
 * This function lets you check if the current is Admin.
 *
 * @example
 * ```
 * import React from "react";
 * import { useSelector } from "react-redux";
 *
 * import { RootState } from "../../../store";
 * import { AdminAuthHooks } from "../hooks/auth.hooks";
 *
 * const { useFetchUserIsAdmin } = AdminAuthHooks();
 *
 * const IsAdmin: React.FC<{ RenderProp: React.FC }> = (props) => {
 *   const { user } = useSelector((state: RootState) => state.adminUser);
 *   const { isAdmin, loadingIsAdmin } = useFetchUserIsAdmin(user);
 *
 *   if (loadingIsAdmin) return <h1>{"Loading User's Admin State."}</h1>;
 *   else if (isAdmin === "isNotSignedIn")
 *     return (
 *       <h1>{"You Are Not Signed in. Please Sign in, and Then Try Again"}</h1>
 *     );
 *   else if (isAdmin === "isNotAdmin") return <h1>{"You Are Not an Admin."}</h1>;
 *   else return <props.RenderProp />;
 * };
 *
 * export default IsAdmin;
 *
 * ```
 *
 */
function useFetchUserIsAdmin(userParam: User | null): {
  isAdmin: TUserIsAdmin;
  loadingIsAdmin: boolean;
} {
  const [isAdmin, setIsAdmin] = React.useState<TUserIsAdmin>("isNotSignedIn");
  const [loadingIsAdmin, setLoadingIsAdmin] = React.useState(true);

  React.useEffect(() => {
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
    });
    setLoadingIsAdmin(false);
    return () => sub.unsubscribe();
  }, [userParam]);

  return { isAdmin, loadingIsAdmin };
}

export interface TAdminAuthHooks {
  useFetchUserIsAdmin: typeof useFetchUserIsAdmin;
}

export const AdminAuthHooks = (): TAdminAuthHooks => {
  return {
    useFetchUserIsAdmin,
  };
};
