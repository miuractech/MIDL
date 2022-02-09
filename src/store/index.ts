import { configureStore } from "@reduxjs/toolkit";

import staffRoleReducers from "./staff-role";
import metaProductFamilyReducers from "./meta-product-family";
import metaProductCategoryReducers from "./meta-product.category";

export const store = configureStore({
  reducer: {
    staffRoles: staffRoleReducers,
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
