import { configureStore } from "@reduxjs/toolkit";

import metaProductFamilyReducers from "./meta-product-family";
import metaProductCategoryReducers from "./meta-product.category";
import adminUserReducers from "../Midl/auth/store/admin.user.slice";
import staffRoleReducers from "../Midl/staff-role/store/staff-role.slice";

export const store = configureStore({
  reducer: {
    adminUser: adminUserReducers,
    staffRole: staffRoleReducers,
    metaProductFamily: metaProductFamilyReducers,
    metaProductCategory: metaProductCategoryReducers,
  },
  middleware: (middleware) =>
    middleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
