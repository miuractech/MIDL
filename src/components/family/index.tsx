import React from "react";
import { v4 as uuidv4 } from "uuid";

import { useSubject } from "../../lib";
import { useFetchUserIsAdmin } from "../../Midl/admin/admin.hooks";
import { MetaProductFamilyDBInterface } from "../../Midl/meta-products/family.interface";
import { adminUserState$ } from "../../store/admin.user";

const { addNewFamily, reorderFamily } = MetaProductFamilyDBInterface();

const Family: React.FC = () => {
  useSubject(adminUserState$);
  const { isAdmin } = useFetchUserIsAdmin(adminUserState$.value.user);

  return (
    <div>
      {isAdmin === "isAdmin" && (
        <React.Fragment>
          <button
            onClick={async () => {
              if (
                adminUserState$.value.user !== null &&
                adminUserState$.value.user.displayName !== null
              ) {
                const res = await addNewFamily(
                  {
                    name: "women",
                    createdBy: adminUserState$.value.user.displayName,
                  },
                  uuidv4()
                );
                console.log(res);
              }
            }}
          >
            Add
          </button>
          <button
            onClick={async () => {
              if (
                adminUserState$.value.user !== null &&
                adminUserState$.value.user.displayName !== null
              ) {
                console.log(
                  await reorderFamily(
                    1,
                    0,
                    adminUserState$.value.user.displayName
                  )
                );
              }
            }}
          >
            Reorder
          </button>
        </React.Fragment>
      )}
    </div>
  );
};

export default Family;
