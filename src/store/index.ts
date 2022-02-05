import { configureStore } from "@reduxjs/toolkit";

import staffRoleReducers from "./staff-role";
import metaProductFamilyReducers from "./meta-product-family";

export const store = configureStore({
  reducer: {
    staffRoles: staffRoleReducers,
    metaProductFamily: metaProductFamilyReducers,
  },
  middleware: (middleware) =>
    middleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
