import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Admin from "./admin";
import Role from "./role";

const ApplicationRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/role" element={<Role />} />
        <Route path="/*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default ApplicationRouter;
