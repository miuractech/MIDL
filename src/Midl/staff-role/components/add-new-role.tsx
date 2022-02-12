import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import { from } from "rxjs";

import { roleOptionsList } from "../settings";
import { useDispatch } from "react-redux";
import { StaffRoleInterface } from "../interfaces/staff-role.interface";
import { roleOptions } from "../types";
import { setAddedRole, setStaffRolesAddError } from "../store/staff-role.slice";
import { User } from "firebase/auth";

const { addStaffRole } = StaffRoleInterface();

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Must Be a Valid Email Address")
    .max(200, "Exceeding Max Character Limit of 200")
    .required("This Email Field is Required"),
  role: yup
    .string()
    .test("RoleOptions Test", "Is In RoleOptions List", (val) =>
      val !== undefined ? roleOptionsList.includes(val) : false
    ),
});

const FormWrapper: React.FC<{ user: User }> = (props) => {
  const [showForm, setShowForm] = React.useState(true);

  return (
    <div>
      <button onClick={() => setShowForm((val) => !val)}>
        {showForm ? "Hide" : "Show"}
      </button>
      {showForm ? <AddNewRole mounted={showForm} /> : null}
    </div>
  );
};

const AddNewRole: React.FC<{ mounted: boolean }> = ({ mounted }) => {
  const [sendingRequest, setSendingRequest] = React.useState(false);

  // useForm Custom Hook Takes Care of All Kinds of Form Validation.
  // You Just Need to Pass a ValidationSchema Like in This Case One has been Passed in,
  // Which Prevents Form Submitting Until the Inputs are in Accordance with the Schema.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; role: string }>({
    resolver: yupResolver(validationSchema),
  });
  const dispatch = useDispatch();

  function submit(data: { email: string; role: string }) {
    setSendingRequest(true);

    // from Function exported by rxjs Library Converts the Returned Promise
    // into an Observable,
    // Which Helps us With Some Clean Up,
    // In Case the User Immediately Closes the Form Upon Submitting it.
    // Which is Also Why the Mounted Prop is Passed to Check
    // if The Form Component is Mounted or Not.
    // If Not Mounted, We Unsubscribe from the Event.
    const obs$ = from(
      addStaffRole({
        email: data.email,
        role: data.role as roleOptions,
        id: uuidv4(),
      })
    );
    const sub = obs$.subscribe((val) => {
      if (mounted) {
        setSendingRequest(false);
        if ("severity" in val) dispatch(setStaffRolesAddError(val));
        else {
          dispatch(setStaffRolesAddError(null));
          dispatch(setAddedRole(val));
        }
      }
    });
    if (!mounted) sub.unsubscribe();
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <input {...register("email")} />
      <span style={{ color: "red" }}>{errors.email?.message}</span>
      <select defaultValue={roleOptionsList[0]} {...register("role")}>
        {roleOptionsList.map((role) => (
          <option key={role}>{role}</option>
        ))}
      </select>
      {!sendingRequest ? (
        <button onClick={() => handleSubmit(submit)}>submit</button>
      ) : (
        <span>Sending Request</span>
      )}
    </form>
  );
};

export default FormWrapper;
