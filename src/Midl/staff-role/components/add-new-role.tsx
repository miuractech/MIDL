import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuidv4 } from "uuid";
import React from "react";

import { roleOptionsList } from "../settings";
import { useAddStaffRole } from "../hooks";
import { roleOptions } from "../types";
import { User } from "firebase/auth";

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
  const { loadingFlag, addStaffRole } = useAddStaffRole(mounted);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; role: string }>({
    resolver: yupResolver(validationSchema),
  });

  function submit(data: { email: string; role: string }) {
    addStaffRole({
      id: uuidv4(),
      email: data.email,
      role: data.role as roleOptions,
    });
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
      {!loadingFlag ? (
        <button onClick={() => handleSubmit(submit)}>submit</button>
      ) : (
        <span>Sending Request</span>
      )}
    </form>
  );
};

export default FormWrapper;
