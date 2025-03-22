import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Navbar from "./Components/Common/Navbar";
import VerificationBanner from "./Components/Layout/VerificationBanner";
import Footer from "./Components/Common/footer.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import OwnerDashboard from "./pages/Gym_Owner/OwnerDashboard.jsx";
import RegisterGym from "./pages/Gym_Owner/RegisterGym.jsx";
import ManageGym from "./pages/Gym_Owner/ManageGym.jsx";
import UserProfile from "./pages/userProfile/UserProfile.jsx";
import OwnerReviewsDashboard from "./pages/Gym_Owner/OwnerReviewsDashboard.jsx";
import TrainerDashboard from "./pages/Trainer/TrainerDashboard.jsx";
import TrainerRegistration from "./pages/Trainer/TrainerRegistration.jsx";
import ClientDashboard from "./pages/Clientt/ClientDashboard.jsx";
import GymList from "./pages/Clientt/GymList.jsx";
import TrainerList from "./pages/Trainer/TrainerList.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import ProtectedRoute from "./Route Protector/ProtectedRoute.jsx";
import AdminRoute from "./Route Protector/AdminRoute.jsx";
import NonAdminRoute from "./Route Protector/NonAdminRoute.jsx";
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminGymManagement from "./pages/Admin/AdminGymManagement.jsx";
import AdminTrainerManagement from "./pages/Admin/AdminTrainerManagement.jsx";
import AdminClientManagement from "./pages/Admin/AdminClientManagement.jsx";
import ContactUsManagement from "./pages/Admin/ContactUsManagement.jsx";
import TrainerSession from "./pages/Trainer/TrainerDashboard.jsx";
import TrainerWorkoutPlans from "./pages/Trainer/TrainerWorkoutPlans.jsx";
import ClientProgress from "./pages/Trainer/ClientProgress.jsx";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import "./App.css";

function App() {
  const { user } = useAuthContext();

  // Check if the current user is an admin
  const isAdmin = user && user.role === "admin";

  return (
    <div className="App">
      <BrowserRouter>
        {/* Only show Navbar and VerificationBanner if user is not admin */}
        {!isAdmin && <Navbar />}
        {!isAdmin && <VerificationBanner />}
        <div className="pages">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/email-verification" element={<EmailVerification />} />

            {/* Non-Admin Routes */}
            <Route
              path="/"
              element={
                <NonAdminRoute>
                  <Home />
                </NonAdminRoute>
              }
            />
            <Route
              path="/about"
              element={
                <NonAdminRoute>
                  <AboutUs />
                </NonAdminRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <NonAdminRoute>
                  <ContactUs />
                </NonAdminRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="/" element={<AdminDashboard />} />
                      <Route path="/dashboard" element={<AdminDashboard />} />
                      <Route path="/gyms" element={<AdminGymManagement />} />
                      <Route
                        path="/trainers"
                        element={<AdminTrainerManagement />}
                      />
                      <Route
                        path="/clients"
                        element={<AdminClientManagement />}
                      />
                      <Route
                        path="/messages"
                        element={<ContactUsManagement />}
                      />
                    </Routes>
                  </AdminLayout>
                </AdminRoute>
              }
            />

            {/* Protected Non-Admin Routes */}
            <Route
              path="/owner-dashboard"
              element={
                <NonAdminRoute>
                  <ProtectedRoute allowedRole="gym_owner">
                    <OwnerDashboard />
                  </ProtectedRoute>
                </NonAdminRoute>
              }
            />
            <Route
              path="/register-gym"
              element={
                <NonAdminRoute>
                  <ProtectedRoute allowedRole="gym_owner">
                    <RegisterGym />
                  </ProtectedRoute>
                </NonAdminRoute>
              }
            />
            <Route
              path="/gym-dashboard/:gymId"
              element={
                <NonAdminRoute>
                  <ProtectedRoute allowedRole="gym_owner">
                    <ManageGym />
                  </ProtectedRoute>
                </NonAdminRoute>
              }
            />
            <Route
              path="/user-profile"
              element={
                <NonAdminRoute>
                  <ProtectedRoute
                    allowedRole={["client", "trainer", "gym_owner"]}
                  >
                    <UserProfile />
                  </ProtectedRoute>
                </NonAdminRoute>
              }
            />
            <Route
              path="/reviews-dashboard"
              element={
                <NonAdminRoute>
                  <ProtectedRoute allowedRole="gym_owner">
                    <OwnerReviewsDashboard />
                  </ProtectedRoute>
                </NonAdminRoute>
              }
            />
            <Route
              path="/trainer-dashboard"
              element={
                <NonAdminRoute>
                  <ProtectedRoute allowedRole="trainer">
                    <TrainerDashboard />
                  </ProtectedRoute>
                </NonAdminRoute>
              }
            />
            <Route
              path="/trainer/registration"
              element={
                <NonAdminRoute>
                  <ProtectedRoute allowedRole="trainer">
                    <TrainerRegistration />
                  </ProtectedRoute>
                </NonAdminRoute>
              }
            />
            <Route
              path="/client-dashboard"
              element={
                <NonAdminRoute>
                  <ProtectedRoute allowedRole="client">
                    <ClientDashboard />
                  </ProtectedRoute>
                </NonAdminRoute>
              }
            />
            <Route
              path="/gym-list"
              element={
                <NonAdminRoute>
                  <ProtectedRoute
                    allowedRole={["client", "trainer", "gym_owner"]}
                  >
                    <GymList />
                  </ProtectedRoute>
                </NonAdminRoute>
              }
            />
            <Route
              path="/trainer-list"
              element={
                <NonAdminRoute>
                  <ProtectedRoute
                    allowedRole={["client", "trainer", "gym_owner"]}
                  >
                    <TrainerList />
                  </ProtectedRoute>
                </NonAdminRoute>
              }
            />
            <Route
              path="/manage-gym"
              element={
                <NonAdminRoute>
                  <ProtectedRoute allowedRole="gym_owner">
                    <ManageGym />
                  </ProtectedRoute>
                </NonAdminRoute>
              }
            />
            <Route
              path="/trainer/session"
              element={
                <NonAdminRoute>
                  <ProtectedRoute allowedRole="trainer">
                    <TrainerSession />
                  </ProtectedRoute>
                </NonAdminRoute>
              }
            />
            <Route
              path="/trainer/workout-plans"
              element={
                <NonAdminRoute>
                  <ProtectedRoute allowedRole="trainer">
                    <TrainerWorkoutPlans />
                  </ProtectedRoute>
                </NonAdminRoute>
              }
            />
            <Route
              path="/trainer/client-progress"
              element={
                <NonAdminRoute>
                  <ProtectedRoute allowedRole="trainer">
                    <ClientProgress />
                  </ProtectedRoute>
                </NonAdminRoute>
              }
            />
          </Routes>
        </div>
        {/* Only show Footer if user is not admin */}
        {!isAdmin && <Footer />}
      </BrowserRouter>
    </div>
  );
}

export default App;
