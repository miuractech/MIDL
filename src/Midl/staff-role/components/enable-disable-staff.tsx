import { useDispatch } from "react-redux";

import { StaffRoleInterface } from "../interfaces/staff-role.interface";
import { TApplicationErrorObject } from "../../../lib";
import { TStaffRole } from "../types";
import {
  setEditedRole,
  setStaffRolesEditError,
} from "../store/staff-role.slice";

const { enableStaff, disableStaff } = StaffRoleInterface();

const EnableDisableStaff: React.FC<TStaffRole> = (props) => {
  const dispatch = useDispatch();

  function staffStateUpdateCallback(res: TStaffRole | TApplicationErrorObject) {
    if ("severity" in res) dispatch(setStaffRolesEditError(res));
    else dispatch(setEditedRole(res));
  }

  return (
    <button
      onClick={async () => {
        if (props.disabled)
          staffStateUpdateCallback(await enableStaff(props.id));
        else staffStateUpdateCallback(await disableStaff(props.id));
      }}
    >
      {props.disabled ? "Enable" : "Disable"}
    </button>
  );
};

export default EnableDisableStaff;
