export type TSeverity = "error" | "fatal" | "info";

/**
 *
 * Default Frontend Application Error Type at for Midl-Related Projects
 *
 */
export interface TApplicationErrorObject {
  name: string;
  code: string;
  message: string;
  severity: TSeverity;
}
