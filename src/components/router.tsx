import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import { auth } from "../config/firebase.config";
import { useFetchFirebaseUser } from "../lib";
import { DefaultErrorMessage } from "../Midl/settings";
import { adminUserState$ } from "../store/admin.user";
import Admin from "./admin";
import Family from "./family";
import { store } from "../store";
import { InventoryGeoLocationInterface } from "../Midl/inventory/inventory.interface";

const NotFound: React.FC = () => {
  return <h1>Not Found</h1>;
};
InventoryGeoLocationInterface()
  .getCitiesByCountryAndState("India", "Assam")
  .then((res) => console.log(res));

InventoryGeoLocationInterface().getStatesByCountry("India").then(console.log);

const ApplicationRouter: React.FC = () => {
  useFetchFirebaseUser(
    DefaultErrorMessage,
    (userParam, loadingParam, errorParam) => {
      adminUserState$.next({
        user: userParam,
        userLoading: loadingParam,
        error: errorParam,
        signOutMessage: "",
      });
    },
    auth
  );

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/meta-products/family" element={<Family />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default ApplicationRouter;

export { NotFound };
