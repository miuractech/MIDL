export type TSeverity = "error" | "fatal" | "info";

export interface TApplicationErrorObject {
  name: string;
  code: string;
  message: string;
  severity: TSeverity;
}
