import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Admin from "./admin";

/**
 *
 * @returns Element
 */
const NotFound: React.FC = () => {
  return <h1>Not Found</h1>;
};

/**
 *
 * @RouteOne -- [[Admin]]
 * @RouteTwo (Default Not Found) -- [[NotFound]]
 * @Returns Renders All the Specified Routes
 */
const ApplicationRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default ApplicationRouter;

export { NotFound };
