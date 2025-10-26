import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import VPSList from "./pages/VPS/VPSList";
import VPSDetails from "./pages/VPS/VPSDetails";
import AIModelsList from "./pages/Admin/AIModelsList";
import AIChat from "./pages/Chat/AIChat";
import { AdminOnly, PrivateRoute, PublicOnly } from "./route-guards";
import SignUpSuccess from "./pages/AuthPages/SignUpSuccess";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>

          {/* Auth Layout */}
          <Route element={<PublicOnly />}>
            <Route path="/" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signup-success" element={<SignUpSuccess />} />
          </Route>

          {/* Dashboard Layout */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>

              <Route index path="/vps" element={<VPSList />} />
              <Route index path="/vps/:id" element={<VPSDetails />} />
              <Route path="/" element={<Home />} />

              {/*Profile */}
              <Route path="/profile" element={<UserProfiles />} />

              {/*AI Chat */}
              <Route path="/aichat/:id" element={<AIChat />} />

              {/* Admin */}
              <Route element={<AdminOnly />}>
                <Route path="/ai-models" element={<AIModelsList />} />
              </Route>

            </Route>
          </Route>


          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
