import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import {
  SubscriptionProvider,
  RequireSubscription,
} from "./context/Subscription/SubscriptionContext";
import "./context/Subscription/SubscriptionContext.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GymContextProvider } from "./context/Gym_Owner/GymContext";
import { EquipmentContextProvider } from "./context/Gym_Owner/EquipmentContext";
import { ProfileProvider } from "./context/Client/clientProfileContex";
import ClientRegister from "./pages/Clientt/ClientRegister";

// Styles
import "./styles/common.css";
import "./App.css";

// Layout Components
import Navbar from "./Components/Common/Navbar";
import VerificationBanner from "./Components/Layout/VerificationBanner";
import SubscriptionBanner from "./Components/Layout/SubscriptionBanner";
import Footer from "./Components/Common/footer.jsx";

// Page Components
import Home from "./pages/Home.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import UserProfile from "./pages/userProfile/UserProfile.jsx";

// Owner Components
import OwnerDashboard from "./pages/Gym_Owner/OwnerDashboard.jsx";
import RegisterGym from "./pages/Gym_Owner/RegisterGym.jsx";
import ManageGym from "./pages/Gym_Owner/ManageGym.jsx";
import OwnerReviewsDashboard from "./pages/Gym_Owner/OwnerReviewsDashboard.jsx";
import EquipmentManagement from "./pages/Gym_Owner/EquipmentManagement.jsx";
import ConfirmationGym from "./pages/Gym_Owner/ConfirmationGym.jsx";
import GymClients from "./pages/Gym_Owner/GymClients.jsx";
import GymReviews from "./pages/Gym_Owner/GymReviews";
import AdManager from "./pages/Gym_Owner/AdManager.jsx";
// Trainer Components
import TrainerDashboard from "./pages/Trainer/TrainerDashboard.jsx";
import TrainerRegistration from "./pages/Trainer/TrainerRegistration.jsx";
import ManageTrainerSession from "./pages/Trainer/ManageTrainerSession.jsx";
import AddTrainerSession from "./pages/Trainer/AddTrainerSession.jsx";

import ManageTrainerTips from "./pages/Trainer/ManageTrainerTips.jsx";
import TrainerTips from "./pages/Trainer/TrainerTips.jsx";
import ClientProgress from "./pages/Trainer/ClientProgress.jsx";

// Client Components
import ClientDashboard from "./pages/Clientt/ClientDashboard.jsx";
import ClientBrowseGym from "./pages/Clientt/BrowseGym.jsx";
import ClientBrowseTrainer from "./pages/Clientt/BrowseTrainers.jsx";
import TrainerDetails from "./pages/Trainer/TrainerDetails.jsx";
import ClientProgressTracking from "./pages/Clientt/ProgressTracking.jsx";
import ClientWorkoutlogForm from "./pages/Clientt/workoutLogForm.jsx";
import ClientFitnessGoalForm from "./pages/Clientt/FitnessGoalForm.jsx";
import ClientBMIUpdateForm from "./pages/Clientt/BMIUpdateForm.jsx";
import SeeGymDetails from "./pages/Clientt/SeeGymDetails";

// Admin Components
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminGymManagement from "./pages/Admin/AdminGymManagement.jsx";
import AdminTrainerManagement from "./pages/Admin/AdminTrainerManagement.jsx";
import AdminClientManagement from "./pages/Admin/AdminClientManagement.jsx";
import ContactUsManagement from "./pages/Admin/ContactUsManagement.jsx";

// Route Protection
import ProtectedRoute from "./Route Protector/ProtectedRoute.jsx";
import AdminRoute from "./Route Protector/AdminRoute.jsx";
import NonAdminRoute from "./Route Protector/NonAdminRoute.jsx";

// Verification and Subscription
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import SubscriptionPage from "./pages/Subscription/SubscriptionPage";
import SuccessPage from "./pages/Subscription/SuccessPage";
import FailurePage from "./pages/Subscription/FailurePage";
import MySubscription from "./pages/Subscription/MySubscription";
import EditAboutUs from "./pages/Admin/EditAboutUs.jsx";
import EditProfileSetting from "./pages/Admin/EditProfileSetting.jsx";
import EditSubscription from "./pages/Admin/Subscription.jsx";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <SubscriptionProvider>
          <GymContextProvider>
            <EquipmentContextProvider>
              {/* Only show Navbar if user is not admin */}
              {(!user || user.role !== "admin") && <Navbar />}
              {user && user.role !== "admin" && <VerificationBanner />}
              {user &&
                (user.role === "gym_owner" || user.role === "client") && (
                  <SubscriptionBanner />
                )}
              <Routes>
                {/* Client Registration Route */}
                <Route path="/client-register" element={<ClientRegister />} />
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route
                  path="/email-verification"
                  element={<EmailVerification />}
                />

                {/* Subscription Routes */}
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route
                  path="/my-subscription"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole={["gym_owner", "client"]}>
                        <MySubscription />
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route path="/subscription/success" element={<SuccessPage />} />
                <Route path="/subscription/failure" element={<FailurePage />} />

                {/* Owner Routes */}
                <Route
                  path="/owner-dashboard"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="gym_owner">
                        <RequireSubscription>
                          <OwnerDashboard />
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/register-gym"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="gym_owner">
                        <RequireSubscription>
                          <RegisterGym />
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/confirmation-gym"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="gym_owner">
                        <RequireSubscription>
                          <ConfirmationGym />
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/manage-gym"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="gym_owner">
                        <RequireSubscription>
                          <ManageGym />
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/gym-dashboard/:gymId"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="gym_owner">
                        <RequireSubscription>
                          <ManageGym />
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/owner-reviews-dashboard"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="gym_owner">
                        <OwnerReviewsDashboard />
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/reviews-dashboard"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="gym_owner">
                        <RequireSubscription>
                          <OwnerReviewsDashboard />
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/owner-reviews"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="gym_owner">
                        <RequireSubscription>
                          <OwnerReviewsDashboard />
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/equipment-management"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="gym_owner">
                        <RequireSubscription>
                          <EquipmentManagement />
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/ad-manager"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="gym_owner">
                        <RequireSubscription>
                          <AdManager />
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/owner/gym/clients/:gymId"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="gym_owner">
                        <GymClients />
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/gym-owner/clients"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="gym_owner">
                        <GymClients />
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />

                {/* Other Protected Routes */}
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

                {/* Trainer Routes */}
                <Route
                  path="/trainer-dashboard"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="trainer">
                        <RequireSubscription>
                          <TrainerDashboard />
                        </RequireSubscription>
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
                  path="/trainer/manage-tips"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="trainer">
                        <RequireSubscription>
                          <ManageTrainerTips />
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/trainer/client-progress"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="trainer">
                        <RequireSubscription>
                          <ClientProgress />
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />

                <Route
                  path="/trainer/manage-sessions"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="trainer">
                        <RequireSubscription>
                          <ManageTrainerSession />
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/trainer/add-session"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="trainer">
                        <RequireSubscription>
                          <AddTrainerSession />
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />

                {/* Client Routes */}
                <Route
                  path="/client-dashboard"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="client">
                        <RequireSubscription>
                          <ProfileProvider>
                            <ClientDashboard />
                          </ProfileProvider>
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/client-progress-tracking"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="client">
                        <RequireSubscription>
                          <ProfileProvider>
                            <ClientProgressTracking />
                          </ProfileProvider>
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/client-fitness-goal"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="client">
                        <RequireSubscription>
                          <ProfileProvider>
                            <ClientFitnessGoalForm />
                          </ProfileProvider>
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/client-update-BMI"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="client">
                        <RequireSubscription>
                          <ProfileProvider>
                            <ClientBMIUpdateForm />
                          </ProfileProvider>
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/client-log-workout"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute allowedRole="client">
                        <RequireSubscription>
                          <ProfileProvider>
                            <ClientWorkoutlogForm />
                          </ProfileProvider>
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/client-browse-gym"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute
                        allowedRole={["client", "trainer", "gym_owner"]}
                      >
                        <ProfileProvider>
                          <ClientBrowseGym />
                        </ProfileProvider>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/client-browse-trainer"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute
                        allowedRole={["client", "trainer", "gym_owner"]}
                      >
                        <ProfileProvider>
                          <ClientBrowseTrainer />
                        </ProfileProvider>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/trainer/details/:trainerId"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute
                        allowedRole={["client", "trainer", "gym_owner"]}
                      >
                        <TrainerDetails />
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />
                <Route
                  path="/gyms/:gymId"
                  element={
                    <RequireSubscription>
                      <ProfileProvider>
                        <SeeGymDetails />
                      </ProfileProvider>
                    </RequireSubscription>
                  }
                />
                <Route path="/gyms/:gymId/reviews" element={<GymReviews />} />

                <Route
                  path="/trainer-tips"
                  element={
                    <NonAdminRoute>
                      <ProtectedRoute
                        allowedRole={["client", "trainer", "gym_owner"]}
                      >
                        <RequireSubscription>
                          <TrainerTips />
                        </RequireSubscription>
                      </ProtectedRoute>
                    </NonAdminRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route
                    path="gym-management"
                    element={<AdminGymManagement />}
                  />
                  <Route
                    path="trainer-management"
                    element={<AdminTrainerManagement />}
                  />
                  <Route
                    path="client-management"
                    element={<AdminClientManagement />}
                  />
                  <Route
                    path="contact-management"
                    element={<ContactUsManagement />}
                  />
                  <Route
                    path="edit-about-us"
                    element={<EditAboutUs />}
                  />
                   <Route
                    path="edit-subscription"
                    element={<EditSubscription />}
                  />
                  <Route
                    path="profile-settings"
                    element={<EditProfileSetting />}
                  />
                </Route>
              </Routes>
              {/* Only show Footer if user is not admin */}
              {(!user || user.role !== "admin") && <Footer />}
            </EquipmentContextProvider>
          </GymContextProvider>
        </SubscriptionProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
