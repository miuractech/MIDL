import { User } from "firebase/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";

import IsAdmin from "../../../auth/components/is-admin";
import { MetaProductFamilyDBInterface } from "../../interfaces";
import { from } from "rxjs";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddedMetaProductFamily,
  setMetaProductFamilyAddError,
} from "../../store/meta-product.family.slice";
import { RootState } from "../../../../store";
import React from "react";

const { addNewFamily } = MetaProductFamilyDBInterface();

const validationSchema = yup.object({
  name: yup
    .string()
    .max(15, "Exceeding Max Character Limit of 200")
    .required("This Name Field is Required"),
});

const AddFamily: React.FC = () => {
  return (
    <IsAdmin
      LoadingRenderProp={() => <h1>Loading</h1>}
      NotSignedInRenderProp={() => <h1>Not Signed In</h1>}
      NotAdminRenderProp={() => <h1>Not Admin</h1>}
      AdminRenderProp={(props) => <FormWrapper user={props.user} />}
    />
  );
};

const FormWrapper: React.FC<{ user: User }> = (props) => {
  const { metaProductFamilies, addError } = useSelector(
    (state: RootState) => state.metaProductFamily
  );
  const [showForm, setShowForm] = React.useState(true);

  return (
    <React.Fragment>
      <button onClick={() => setShowForm((val) => !val)}>
        {showForm ? "Hide" : "Show"}
      </button>
      {metaProductFamilies.map((m) => (
        <h1 key={m.id}>{m.name}</h1>
      ))}
      {showForm ? <AddForm user={props.user} mounted={showForm} /> : null}
      {addError !== null && (
        <span style={{ color: "red" }}>{addError.message}</span>
      )}
    </React.Fragment>
  );
};

const AddForm: React.FC<{ user: User; mounted: boolean }> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>({
    resolver: yupResolver(validationSchema),
  });
  const dispatch = useDispatch();
  const [sendingRequest, setSendingRequest] = React.useState(false);

  function submit(data: { name: string }) {
    setSendingRequest(true);
    if (props.user.displayName !== null) {
      const obs$ = from(
        addNewFamily(
          { name: data.name, createdBy: props.user?.displayName },
          uuidv4()
        )
      );
      const sub = obs$.subscribe((val) => {
        setSendingRequest(false);
        if ("severity" in val) dispatch(setMetaProductFamilyAddError(val));
        else {
          dispatch(setAddedMetaProductFamily(val));
          dispatch(setMetaProductFamilyAddError(null));
        }
      });
      if (!props.mounted) sub.unsubscribe();
    }
  }
  return (
    <form onSubmit={handleSubmit(submit)}>
      <input {...register("name")} />
      <span style={{ color: "red" }}>{errors.name?.message}</span>
      <button onClick={() => handleSubmit(submit)}>Submit</button>
      {sendingRequest ? <p>sending request, please wait</p> : null}
    </form>
  );
};

export default AddFamily;
