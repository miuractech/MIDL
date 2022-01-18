import { UseFormRegister } from "react-hook-form";

const GenericRegisterLoginInput: React.FC<{
  placeHolder: string;
  type: string;
  register: UseFormRegister<{ email: string; password: string }>;
  field: "email" | "password";
}> = (props) => {
  return (
    <input
      style={{ margin: 10, padding: 5 }}
      placeholder={props.placeHolder}
      type={props.type}
      size={50}
      {...props.register(props.field)}
    />
  );
};

export default GenericRegisterLoginInput;
