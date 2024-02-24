import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AuthenticatedAdminRoute from "./pages/authRoute/AuthenticatedAdminRoute";
import OgLogin from "./pages/organisation/OgLogin";
import OgRegister from "./pages/organisation/OgRegister";
import AdminLogin from "./pages/admin/AdminLogin";
import ListAllAuth from "./pages/authRoute/ListAllAuth";
import OrganisationAuth from "./pages/authRoute/organisationAuth";
import GenerateCertificateAuth from "./pages/authRoute/GenerateCertificate";
import Verify from "./pages/Verify";
import Regenerate from "./pages/Regenerate";
import ShowAllTemplateAuth from './pages/authRoute/ShowAllTemplateAuth'
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="ogLogin" element={<OgLogin />} />
          <Route path="OgRegister" element={<OgRegister />} />
          <Route path="admin" element={<AdminLogin />} />
          <Route path="regenerate" element={<Regenerate />} />
          <Route path="admin-dashboard" element={<AuthenticatedAdminRoute />} />
          <Route path="list-all-organisation" element={<ListAllAuth />} />
          <Route path="organisation-dashboard" element={<OrganisationAuth />} />
          <Route
            path="generate-certificate"
            element={<GenerateCertificateAuth />}
          />
          <Route
            path="show-templates"
            element={<ShowAllTemplateAuth />}
          />
          <Route path="verify" element={<Verify/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
