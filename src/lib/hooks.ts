import React from "react";
import { BehaviorSubject, from, Observable } from "rxjs";
import * as yup from "yup";

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
  fetchCallback: () => Promise<T | undefined>,
  stateUpdateCallBack: (param: T) => void,
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

export function useYupValidationResolver(validationSchema: any) {
  return React.useCallback(
    async (data) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        if (errors instanceof yup.ValidationError) {
          return {
            values: {},
            errors: errors.inner.reduce((allErrors, currentError) => {
              if (currentError.path !== undefined) {
                return {
                  ...allErrors,
                  [currentError?.path]: {
                    type: currentError.type ?? "validation",
                    message: currentError.message,
                  },
                };
              } else {
                return { ...allErrors };
              }
            }, {}),
          };
        }
      }
    },
    [validationSchema]
  );
}
