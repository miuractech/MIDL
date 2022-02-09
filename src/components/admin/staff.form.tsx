import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import UniversalButton from "../global/universal.button";
import { roleOptions } from "../../types/role.types";
import React from "react";
import { from } from "rxjs";

interface IForm {
  email: string;
  role: roleOptions;
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Must Be a Valid Email Address")
    .max(200, "Exceeding Max Character Limit of 200")
    .required("This Email Field is Required"),
  role: yup.string(),
});

const StaffForm: React.FC<{
  placeHolderEmail?: string;
  placeHolderRole?: string;
  closeForm: () => void;
  submitForm: (email: string, role: roleOptions) => Promise<void>;
  buttonValue: string;
  headerValue: string;
  serverError: string;
  mounted: boolean;
}> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(validationSchema),
  });
  const [loading, setLoading] = React.useState(false);

  function submit(data: IForm) {
    setLoading(true);
    const sub = from(props.submitForm(data.email, data.role)).subscribe(() => {
      if (props.mounted) setLoading(false);
    });
    if (!props.mounted) sub.unsubscribe();
  }

  return (
    <div
      style={{
        position: "fixed",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        height: "100vh",
        width: "100vw",
        zIndex: "1000",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        right: 0,
      }}
    >
      <div
        style={{
          background: "white",
          zIndex: "2000",
          borderRadius: 4,
          minWidth: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>{props.headerValue}</h3>
        <form
          onSubmit={handleSubmit(submit)}
          style={{ margin: "20px 0px 20px 0px" }}
        >
          <div>
            <input
              defaultValue={
                props.placeHolderEmail ? props.placeHolderEmail : "Email"
              }
              readOnly={props.placeHolderEmail !== undefined}
              {...register("email")}
            />
            <span style={{ color: "red" }}>{errors.email?.message}</span>
            <select
              defaultValue={
                props.placeHolderRole ? props.placeHolderRole : "staff"
              }
              {...register("role")}
            >
              <option>manager</option>
              <option>staff</option>
              <option>printing</option>
              <option>shipping</option>
            </select>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            {loading === false ? (
              <UniversalButton handleClick={handleSubmit(submit)}>
                {props.buttonValue}
              </UniversalButton>
            ) : (
              <span style={{ color: "green" }}>
                Sending Request... Be Patient Please!
              </span>
            )}

            <UniversalButton handleClick={() => props.closeForm()}>
              Close
            </UniversalButton>
          </div>
        </form>
        {props.serverError.length > 0 && (
          <span style={{ color: "red" }}>{props.serverError}</span>
        )}
      </div>
    </div>
  );
};

export default StaffForm;
