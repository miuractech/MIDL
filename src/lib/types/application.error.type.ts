export interface TApplicationErrorObject {
  name: string;
  code: string;
  message: string;
  severity: "error" | "fatal" | "info";
}
