import { TFirestoreDefault } from "./firestore.default.types";

export type metaProductFamilyStatus =
  | "deleted"
  | "archived"
  | "published"
  | "unpublished";

export interface TMetaProductFamily extends TFirestoreDefault {
  name: string;
  index: number;
  createdBy: string;
  updatedBy: string;
  status: metaProductFamilyStatus;
}
