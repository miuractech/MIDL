import { Auth, onAuthStateChanged, User } from "firebase/auth";
import React from "react";
import { BehaviorSubject, from, Observable } from "rxjs";

/**
 *
 *
 * With The Reactive Nature of The RxJS Library, We Aim to Replace the Verbose React Context Pattern With This Simple Hook.
 *
 * @example
 *
 * ```
 *
 * const subject$ = new BehaviorSubject<string>("");
 *
 * const Input: React.FC = () => {
 *   return <input type="text" onChange={(e) => subject$.next(e.target.value)} />;
 * };
 *
 * const DisplayText: React.FC = () => {
 *   const state = useSubject(subject$);
 *
 *   return (
 *     <React.Fragment>
 *       //Both Work as Same
 *       <h1>{state}</h1>
 *       <h1>{subject$.value}</h1>
 *     </React.Fragment>
 *   );
 * };
 *
 * ```
 *
 */
export function useSubject<T>(subject$: BehaviorSubject<T>) {
  const [state, setState] = React.useState(subject$.value);

  React.useEffect(() => {
    const subjectSub = subject$.subscribe(setState);
    return () => {
      subjectSub.unsubscribe();
    };
  }, [subject$]);

  return state;
}

/**
 *
 * Before You Get Into the Nitty Gritty Details of Subjects and Observables, Please Be Sure to Check the Differences Between Them.
 * Basically At Runtime Unlike Subjects, Observables' Values are Not Known to the Application.
 *
 * @example
 *
 * ```
 *
 * const subject$ = new BehaviorSubject<string>("");
 * const obs$ = subject$.pipe(map((val) => val + "a"));
 *
 * const Input: React.FC = () => {
 *   return <input type="text" onChange={(e) => subject$.next(e.target.value)} />;
 * };
 *
 * const DisplayTextObservable: React.FC = () => {
 *   const state = useObservable(obs$);
 *
 *   return (
 *     // Output should be "inputtext+'a'+inputtext+'a'..."
 *     <React.Fragment>{state !== undefined && <h1>{state}</h1>}</React.Fragment>
 *   );
 * };
 *
 * ```
 *
 */
export function useObservable<T>(observable$: Observable<T>) {
  const [state, setState] = React.useState<T | undefined>();
  React.useEffect(() => {
    const sub = observable$.subscribe(setState);
    return () => {
      sub.unsubscribe();
    };
  }, [observable$]);

  return state;
}

/**
 *
 * This Hook Abstracts Away All the Redundant Data Fetching And Error Catching Code for Fetching Data on Component Mount.
 *
 * @example
 * ```
 *
 * const apiUrl = "https://jsonplaceholder.typicode.com/todos/";
 *
 * interface TRes {
 *   userId: number;
 *   id: number;
 *   title: string;
 *   completed: boolean;
 * }
 *
 * async function YourFetchFunction() {
 *   try {
 *     const res = await axios.get<Array<TRes>>(apiUrl);
 *     return res.data;
 *   } catch (error) {
 *     return new ApplicationError().handleCustomError(
 *       "Unknown",
 *       "Fetch Error",
 *       "Some Unknown Error Occurred Fetching the Data",
 *       "error"
 *     );
 *   }
 * }
 *
 * const FetchComponent: React.FC = () => {
 *   const [state, setState] = React.useState<Array<TRes>>([]);
 *   const [err, setErr] = React.useState("");
 *
 *   function stateUpdateCallback(res: Array<TRes> | TApplicationErrorObject) {
 *     if ("severity" in res) setErr(res.message);
 *     else {
 *       setState(res);
 *       setErr("");
 *     }
 *   }
 *
 *   useFetchDataOnMount<Array<TRes>, TApplicationErrorObject>(
 *     YourFetchFunction,
 *     stateUpdateCallback
 *   );
 *
 *   return (
 *     <React.Fragment>
 *       {state.map((s) => (
 *         <h1 key={s.id}>{s.title}</h1>
 *       ))}
 *       {err.length > 0 && <span style={{ color: "red" }}>{err}</span>}
 *     </React.Fragment>
 *   );
 * };
 *
 * ```
 *
 */
export function useFetchDataOnMount<T, E>(
  fetchCallback: () => Promise<T | E>,
  stateUpdateCallBackOrCatchError: (param: T | E) => void
) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const res = from(fetchCallback());
    const sub = res.subscribe((val) => {
      stateUpdateCallBackOrCatchError(val);
      setLoading(false);
    });

    return () => sub.unsubscribe();
  }, []);

  return { loading };
}

/**
 *
 * Fetches The Firebase User When Application Loads.
 * Examples Can be Found in the Midl Folder.
 *
 */
export function useFetchFirebaseUser(
  defaultErrorMessage: string,
  stateUpdateCallBack: (
    userParam: User | null,
    loadingParam: boolean,
    errorParam: string
  ) => void,
  auth: Auth
) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [firebaseUser, setFirebaseUser] = React.useState<null | User>(null);

  React.useEffect(() => {
    try {
      const sub = onAuthStateChanged(auth, (user) => {
        if (user !== null) {
          setFirebaseUser(user);
          stateUpdateCallBack(user, false, "");
        } else {
          stateUpdateCallBack(null, false, "");
        }
        setLoading(false);
      });
      return sub;
    } catch (error) {
      stateUpdateCallBack(null, false, defaultErrorMessage);
      setLoading(false);
      setError(defaultErrorMessage);
    }
  }, []);

  return { loading, error, firebaseUser };
}
