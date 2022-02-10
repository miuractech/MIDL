import { useDispatch, useSelector } from "react-redux";

import { AdminAuthInterface } from "../interfaces/auth.interfaces";
import { TApplicationErrorObject } from "../../../lib";
import { RootState } from "../../../store";
import { setAdminUserState } from "../store/admin.user.slice";

const { userSignOut } = AdminAuthInterface();

const UserSignOut: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.adminUser);

  function userStateUpdateCallback(
    res: TApplicationErrorObject | { message: string }
  ) {
    if ("severity" in res) {
      dispatch(
        setAdminUserState({
          user: user,
          userLoading: false,
          error: res.message,
          signOutMessage: "",
        })
      );
    } else {
      dispatch(
        setAdminUserState({
          user: null,
          userLoading: false,
          error: "",
          signOutMessage: res.message,
        })
      );
    }
  }

  return (
    <button
      onClick={async () => {
        userStateUpdateCallback(await userSignOut());
      }}
    >
      Sign Out
    </button>
  );
};

export default UserSignOut;
