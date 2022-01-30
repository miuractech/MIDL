import { FirebaseError } from "firebase/app";

import { TApplicationErrorObject } from "./types/application.error.type";

export class ApplicationError {
  handleDefaultError(
    name: string,
    message: string,
    severity: "error" | "fatal"
  ): TApplicationErrorObject {
    return this.mapToErrorObject("Unknown/Default", name, message, severity);
  }

  handleFirebaseError(
    error: FirebaseError,
    severity: "error" | "fatal"
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

  private mapToErrorObject(
    code: string,
    name: string,
    message: string,
    severity: "error" | "fatal" | "info"
  ): TApplicationErrorObject {
    return {
      code: code,
      name: name,
      message: message,
      severity: severity,
    };
  }
}
