import {
  AdminAuthInterface,
  AdminFirestoreInterface,
  useFetchUserIsAdmin,
} from "../admin";
import { InventoryGeoLocationInterface } from "../inventory";
import { MetaProductCategoryDBInterface } from "../meta-products/category.interface";
import { MetaProductFamilyDBInterface } from "../meta-products/family.interface";
import { MetaProductSubCategoryDBInterface } from "../meta-products/sub-category.interface";

const DependencyContainer = {
  admin: {
    hooks: {
      useFetchUserIsAdmin: useFetchUserIsAdmin,
    },
    interfaces: {
      AdminAuthInterface: AdminAuthInterface,
      AdminFirestoreInterface: AdminFirestoreInterface,
    },
  },
  metaProductFamily: {
    interfaces: {
      MetaProductFamilyDBInterface: MetaProductFamilyDBInterface,
    },
  },
  metaProductCategory: {
    interfaces: {
      MetaProductCategoryDBInterface: MetaProductCategoryDBInterface,
    },
  },
  metaProductSubCategory: {
    interfaces: {
      MetaProductSubCategoryDBInterface: MetaProductSubCategoryDBInterface,
    },
  },
  inventory: {
    interfaces: {
      InventoryGeoLocationInterface: InventoryGeoLocationInterface,
    },
  },
};

export default DependencyContainer;
