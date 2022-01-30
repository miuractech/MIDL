import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import UniversalButton from "../global/universal.button";
import { useSubject } from "../../lib/hooks";
import { fetchRolesError$, staffFormError$ } from "../../store/error";
import { useFetchUserIsAdmin } from "../../Midl/Auth/auth.hooks";
import { user$ } from "../../store/user";

interface IForm {
  email: string;
  role: "manager" | "staff" | "printing" | "shipping";
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
  submitForm: (email: string, role: string) => void;
  buttonValue: string;
  headerValue: string;
}> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(validationSchema),
  });

  function submit(data: IForm) {
    props.submitForm(data.email, data.role);
  }

  useSubject(staffFormError$);
  const { isAdmin } = useFetchUserIsAdmin(user$.value);

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
            <UniversalButton handleClick={handleSubmit(submit)}>
              {props.buttonValue}
            </UniversalButton>
            <UniversalButton handleClick={() => props.closeForm()}>
              Close
            </UniversalButton>
          </div>
        </form>
        {fetchRolesError$.value !== null && !isAdmin && (
          <span style={{ color: "red" }}>{fetchRolesError$.value.message}</span>
        )}
      </div>
    </div>
  );
};

export default StaffForm;
