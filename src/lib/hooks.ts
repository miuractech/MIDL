import { Auth, onAuthStateChanged, User } from "firebase/auth";
import React from "react";
import { BehaviorSubject, from, Observable } from "rxjs";

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
