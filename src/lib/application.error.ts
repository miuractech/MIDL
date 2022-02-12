import { FirebaseError } from "firebase/app";

import {
  TApplicationErrorObject,
  TSeverity,
} from "./types/application.error.type";

/**
 *
 * This Class is Used for Composing Different Types of Errors that Suit the Developers' Needs.
 * More Methods are Possibly Coming and Some Modifications
 *
 * @example
 *
 * ```
 *
 * async function YourFetchFunction() {
 *   try {
 *     const res = await axios.get<Array<TRes>>(apiUrl);
 *     return res.data;
 *   } catch (error) {
 *     return new ApplicationError().handleCustomError(
 *       "Unknown",
 *       "Fetch Error",
 *       "Some Unknown Error Occurred Fetching the Data",
 *       "error"
 *     );
 *   }
 * }
 *
 * ```
 *
 */
export class ApplicationError {
  handleDefaultError(
    name: string,
    message: string,
    severity: TSeverity
  ): TApplicationErrorObject {
    return this.mapToErrorObject("Unknown/Default", name, message, severity);
  }

  handleFirebaseError(
    error: FirebaseError,
    severity: TSeverity
  ): TApplicationErrorObject {
    return this.mapToErrorObject(
      error.code,
      error.name,
      error.message,
      severity
    );
  }

  handleDocumentNotFound(): TApplicationErrorObject {
    return this.mapToErrorObject(
      "Document/Resource Not Found",
      "No Document",
      "This Specific Document Cannot be Found",
      "info"
    );
  }

  handleCustomError(
    code: string,
    name: string,
    message: string,
    severity: TSeverity
  ) {
    return this.mapToErrorObject(code, name, message, severity);
  }

  private mapToErrorObject(
    code: string,
    name: string,
    message: string,
    severity: TSeverity
  ): TApplicationErrorObject {
    return {
      code: code,
      name: name,
      message: message,
      severity: severity,
    };
  }
}
