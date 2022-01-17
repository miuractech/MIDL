import React from "react";
import { BehaviorSubject, from, Observable } from "rxjs";

export function useSubject<T>(subject$: BehaviorSubject<T>) {
  const [state, setState] = React.useState(subject$.value);

  React.useEffect(() => {
    const subjectSub = subject$.subscribe(setState);
    return () => {
      subjectSub.unsubscribe();
    };
  }, []);

  return state;
}

export function useObservable<T>(observable$: Observable<T>) {
  const [state, setState] = React.useState<T | undefined>();
  React.useEffect(() => {
    const sub = observable$.subscribe(setState);
    return () => {
      sub.unsubscribe();
    };
  }, []);

  return state;
}

export function useStartupData<T>(
  fetchCallback: () => Promise<Array<T> | undefined>,
  stateUpdateCallBack: (param: Array<T>) => void,
  errorMessage: string
) {
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const res = from(fetchCallback());
      const sub = res.subscribe((val) => {
        val !== undefined && stateUpdateCallBack(val);
      });
      setLoading(false);
      return () => sub.unsubscribe();
    } catch (error) {
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  return { error, loading };
}
