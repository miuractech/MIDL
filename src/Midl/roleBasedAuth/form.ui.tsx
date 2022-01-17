import { UseFormRegister } from "react-hook-form";

export const Input: React.FC<{
  placeHolder: string;
  type: string;
  register: UseFormRegister<{ email: string; password: string }>;
  field: "email" | "password";
  constraintsObj: object;
}> = (props) => {
  return (
    <input
      style={{ margin: 10, padding: 5 }}
      placeholder={props.placeHolder}
      type={props.type}
      size={50}
      {...props.register(props.field, { ...props.constraintsObj })}
    />
  );
};

export const ButtonWithOutStyle: React.FC<{ handleClick: () => void }> = (
  props
) => {
  return (
    <button
      style={{ color: "blue", border: "none", background: "none" }}
      onClick={() => props.handleClick()}
    >
      {props.children}
    </button>
  );
};

export const UniversalButton: React.FC<{ handleClick: () => void }> = (
  props
) => {
  return (
    <button
      style={{
        border: "none",
        background: "blue",
        color: "white",
        padding: 10,
        borderRadius: 5,
      }}
      onClick={() => props.handleClick()}
    >
      {props.children}
    </button>
  );
};
