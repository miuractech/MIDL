import { User } from "firebase/auth";
import React from "react";
import { from } from "rxjs";

import { ADMIN } from "../settings";

/**
 * This function lets you check if the current is Admin. 
 * 
 * @example
 * ```
 * import { useFetchUserIsAdmin } from "../Midl/admin";
 * 
 * const App = () =>{
 *  const { isAdmin, loadingIsAdmin } = useFetchUserIsAdmin();
 * 
 *  if(loadingIsAdmin) return <>Loading...</>
 *  else{ 
 *    return(
 *      <>
 *        {isAdmin? 'admin' : 'you\'re not admin'}
 *      </>
 *    )
 *  }
 * }
 * ```
 * 
 */
export function useFetchUserIsAdmin(userParam: User | null) {
  const [isAdmin, setIsAdmin] = React.useState<
    "notSignedIn" | "isAdmin" | "notAdmin"
  >("notSignedIn");
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
          setIsAdmin("notAdmin");
        }
      }
    });
    setLoadingIsAdmin(false);
    return () => sub.unsubscribe();
  }, [userParam]);

  return { isAdmin, loadingIsAdmin };
}
