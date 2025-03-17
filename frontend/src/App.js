import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Navbar from "./Components/Common/Navbar";
import Footer from "./Components/Common/footer.jsx";
import OwnerDashboard from "./pages/Gym_Owner/OwnerDashboard.jsx";
import RegisterGym from "./pages/Gym_Owner/RegisterGym.jsx";
import ManageGym from "./pages/Gym_Owner/ManageGym.jsx";
import OwnerProfile from "./pages/Gym_Owner/OwnerProfile.jsx";
import OwnerReviewsDashboard from "./pages/Gym_Owner/OwnerReviewsDashboard.jsx";
import TrainerDashboard from "./pages/Trainer/TrainerDashboard.jsx";
import ClientDashboard from "./pages/Clientt/ClientDashboard.jsx";
import GymList from "./pages/Clientt/GymList.jsx";
import TrainerList from "./pages/Trainer/TrainerList.jsx";
import ProtectedRoute from "./Route Protector/ProtectedRoute.jsx";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
              path="/owner-profile"
              element={
                <ProtectedRoute allowedRole="gym_owner">
                  <OwnerProfile />
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
              path="/reviews-dashboard"
              element={
                <ProtectedRoute allowedRole="gym_owner">
                  <OwnerReviewsDashboard />
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
