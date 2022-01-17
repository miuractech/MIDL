import { BehaviorSubject, combineLatestWith, map } from "rxjs";
import { IRolesDoc } from "../Midl/Auth/types";

const fetchedRoles$ = new BehaviorSubject<Array<IRolesDoc>>([]);
const edited$ = new BehaviorSubject<IRolesDoc | null>(null);
const rolesCached$ = edited$.pipe(
  combineLatestWith(fetchedRoles$),
  map(([edited, val]) => {
    if (edited !== null) {
      if (val.length === 0) {
        val.push(edited);
      } else {
        const index = val.findIndex((role) => role.id === edited.id);
        if (index !== -1) {
          val[index] = edited;
        }
      }
    }
    return val;
  })
);

export { fetchedRoles$, rolesCached$, edited$ };
