import { TFirestoreDefault } from "rxf";

export type metaProductStatus =
  | "deleted"
  | "archived"
  | "published"
  | "unpublished";

export interface TMetaProductSubCategory extends TFirestoreDefault {
  name: string;
  index: number;
  familyId: string;
  categoryId: string;
  createdBy: string;
  updatedBy: string;
  status: metaProductStatus;
}

export interface TMetaProductCategory extends TFirestoreDefault {
  name: string;
  index: number;
  familyId: string;
  createdBy: string;
  updatedBy: string;
  status: metaProductStatus;
}

export interface TMetaProductFamily extends TFirestoreDefault {
  name: string;
  index: number;
  createdBy: string;
  updatedBy: string;
  status: metaProductStatus;
}
