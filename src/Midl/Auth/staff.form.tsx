import { useForm } from "react-hook-form";

import Button from "./blue.button";

interface IForm {
  email: string;
  option: "manager" | "staff" | "printing" | "shipping";
}

const StaffForm: React.FC<{
  placeHolderEmail?: string;
  placeHolderRole?: string;
  closeForm: () => void;
  submitForm: (email: string, option: string) => void;
  buttonValue: string;
  headerValue: string;
}> = (props) => {
  const { register, handleSubmit } = useForm<IForm>();
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  function submit(data: IForm) {
    props.submitForm(data.email, data.option);
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
              placeholder={
                props.placeHolderEmail ? props.placeHolderEmail : "Email"
              }
              {...register("email", {
                required: true,
                pattern: emailRegex,
                value: props.placeHolderEmail ? props.placeHolderEmail : "",
              })}
            />
            <select
              defaultValue={
                props.placeHolderRole ? props.placeHolderRole : "staff"
              }
              {...register("option", { required: true })}
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
            <Button handleClick={handleSubmit(submit)}>
              {props.buttonValue}
            </Button>
            <Button handleClick={() => props.closeForm()}>Close</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;
