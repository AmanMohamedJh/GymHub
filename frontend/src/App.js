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
import TrainerSession from "./pages/Trainer/TrainerDashboard.jsx";
import TrainerWorkoutPlans from "./pages/Trainer/TrainerWorkoutPlans.jsx";
import ClientProgress from "./pages/Trainer/ClientProgress.jsx";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import "./App.css";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <VerificationBanner />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route
              path="/owner-dashboard"
              element={
                <ProtectedRoute allowedRole="gym_owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register-gym"
              element={
                <ProtectedRoute allowedRole="gym_owner">
                  <RegisterGym />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gym-dashboard/:gymId"
              element={
                <ProtectedRoute allowedRole="gym_owner">
                  <ManageGym />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-profile"
              element={
                <ProtectedRoute
                  allowedRole={["client", "trainer", "gym_owner"]}
                >
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews-dashboard"
              element={
                <ProtectedRoute allowedRole="gym_owner">
                  <OwnerReviewsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainer-dashboard"
              element={
                <ProtectedRoute allowedRole="trainer">
                  <TrainerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainer/registration"
              element={
                <ProtectedRoute allowedRole="trainer">
                  <TrainerRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client-dashboard"
              element={
                <ProtectedRoute allowedRole="client">
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gym-list"
              element={
                <ProtectedRoute
                  allowedRole={["client", "trainer", "gym_owner"]}
                >
                  <GymList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainer-list"
              element={
                <ProtectedRoute
                  allowedRole={["client", "trainer", "gym_owner"]}
                >
                  <TrainerList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-gym"
              element={
                <ProtectedRoute allowedRole="gym_owner">
                  <ManageGym />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainer/session"
              element={
                <ProtectedRoute allowedRole="trainer">
                  <TrainerSession />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainer/workout-plans"
              element={
                <ProtectedRoute allowedRole="trainer">
                  <TrainerWorkoutPlans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainer/client-progress"
              element={
                <ProtectedRoute allowedRole="trainer">
                  <ClientProgress />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
