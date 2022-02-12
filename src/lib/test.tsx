import axios from "axios";
import React from "react";
import { BehaviorSubject, map } from "rxjs";
import {
  ApplicationError,
  reorder,
  TApplicationErrorObject,
  useFetchDataOnMount,
  useObservable,
  useSubject,
} from ".";

const apiUrl = "https://jsonplaceholder.typicode.com/todos/";

interface TRes {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

async function YourFetchFunction() {
  try {
    const res = await axios.get<Array<TRes>>(apiUrl);
    return res.data;
  } catch (error) {
    return new ApplicationError().handleCustomError(
      "Unknown",
      "Fetch Error",
      "Some Unknown Error Occurred Fetching the Data",
      "error"
    );
  }
}

const FetchComponent: React.FC = () => {
  const [state, setState] = React.useState<Array<TRes>>([]);
  const [err, setErr] = React.useState("");

  function stateUpdateCallback(res: Array<TRes> | TApplicationErrorObject) {
    if ("severity" in res) setErr(res.message);
    else {
      setState(res);
      setErr("");
    }
  }

  useFetchDataOnMount<Array<TRes>, TApplicationErrorObject>(
    YourFetchFunction,
    stateUpdateCallback
  );

  return (
    <React.Fragment>
      {state.map((s) => (
        <h1 key={s.id}>{s.title}</h1>
      ))}
      {err.length > 0 && <span style={{ color: "red" }}>{err}</span>}
    </React.Fragment>
  );
};

const arr: Array<{ index: number; name: string }> = [
  {
    index: 0,
    name: "Sanjeev",
  },
  {
    index: 1,
    name: "Somnath",
  },
];

const res = reorder(arr, 0, 1);

// output = [{index: 0, name: "Somnath"}, {index: 1, name: "Sanjeev"}]

const subject$ = new BehaviorSubject<string>("");
const obs$ = subject$.pipe(map((val) => val + "a"));

const Input: React.FC = () => {
  return <input type="text" onChange={(e) => subject$.next(e.target.value)} />;
};

const DisplayText: React.FC = () => {
  const state = useSubject(subject$);

  return (
    <React.Fragment>
      //Both Work as Same
      <h1>{state}</h1>
      <h1>{subject$.value}</h1>
    </React.Fragment>
  );
};

const DisplayTextObservable: React.FC = () => {
  const state = useObservable(obs$);

  return (
    // Output should be "inputtext+'a'+inputtext+'a'..."
    <React.Fragment>{state !== undefined && <h1>{state}</h1>}</React.Fragment>
  );
};

export {};
