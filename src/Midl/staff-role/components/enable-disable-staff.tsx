import { useUpdateStaffRole } from "../hooks";
import { TStaffRole } from "../types";

const EnableDisableStaff: React.FC<TStaffRole> = (props) => {
  const { enableStaff, disableStaff } = useUpdateStaffRole(true);

  return (
    <button
      onClick={async () => {
        if (props.disabled) enableStaff(props.id);
        else disableStaff(props.id);
      }}
    >
      {props.disabled ? "Enable" : "Disable"}
    </button>
  );
};

export default EnableDisableStaff;
