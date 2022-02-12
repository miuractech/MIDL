import * as yup from "yup";

import { User } from "firebase/auth";
import IsAdmin from "../../../auth/components/is-admin";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TMetaProductFamily } from "../../types";
import { MetaProductFamilyDBInterface } from "../../interfaces";
import { from } from "rxjs";
import { useDispatch } from "react-redux";
import {
  setMetaProductFamilies,
  setMetaProductFamilyEditError,
} from "../../store/meta-product.family.slice";
import React from "react";

const validationSchema = yup.object({
  currentIndex: yup.number().required("This Index Field is Required"),
  nextIndex: yup.number().required("This Index Field is Required"),
});

const { reorderFamily } = MetaProductFamilyDBInterface();

const ReorderFamily: React.FC<{ family: TMetaProductFamily }> = ({
  family,
}) => {
  const [showForm, setShowForm] = React.useState(true);

  return (
    <div>
      <button onClick={() => setShowForm((val) => !val)}>
        {showForm ? "Hide" : "Show"}
      </button>
      {showForm ? (
        <IsAdmin
          LoadingRenderProp={() => <h1>Loading</h1>}
          NotSignedInRenderProp={() => <h1>Not Signed In</h1>}
          NotAdminRenderProp={() => <h1>Not Admin</h1>}
          AdminRenderProp={(props) => (
            <FormWrapper user={props.user} family={family} mounted={showForm} />
          )}
        />
      ) : null}
    </div>
  );
};

const FormWrapper: React.FC<{
  user: User;
  family: TMetaProductFamily;
  mounted: boolean;
}> = ({ user, family, mounted }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ currentIndex: number; nextIndex: number }>({
    resolver: yupResolver(validationSchema),
  });

  const dispatch = useDispatch();

  function submit(data: { currentIndex: number; nextIndex: number }) {
    if (user.displayName !== null) {
      const obs$ = from(
        reorderFamily(data.nextIndex, data.currentIndex, user.displayName)
      );
      const sub = obs$.subscribe((val) => {
        if ("severity" in val) dispatch(setMetaProductFamilyEditError(val));
        else {
          dispatch(setMetaProductFamilies(val));
          dispatch(setMetaProductFamilyEditError(null));
        }
      });
      if (!mounted) sub.unsubscribe();
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(submit)}>
        <input {...register("currentIndex")} defaultValue={family.index} />
        <input {...register("nextIndex")} />
        <button onClick={() => handleSubmit(submit)}>Submit</button>
      </form>
    </div>
  );
};

export default ReorderFamily;
