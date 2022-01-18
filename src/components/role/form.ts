import * as yup from "yup";

export interface IForm {
  email: string;
  password: string;
}

export const validationSchema = yup.object({
  email: yup
    .string()
    .email("Must Be a Valid Email Address")
    .max(200, "Exceeding Max Character Limit of 200")
    .required("This Email Field is Required"),
  password: yup
    .string()
    .min(5, "Password Too Short.")
    .max(30, "Exceeding Max Character Limit of 200.")
    .required("This Password Field is Required."),
});
