import React from "react";
import { Route } from "react-router-dom";
import AdminDashboard from "../pages/Admin/Dashboard";
import ManageClients from "../pages/Admin/ManageClients";
import ManageGyms from "../pages/Admin/ManageGyms";
import ManageTrainers from "../pages/Admin/ManageTrainers";
import ManageUsers from "../pages/Admin/ManageUsers";
import ContactUsManagement from "../components/Admin/ContactUsManagement";
import AdminStats from "../pages/Admin/AdminStats";

// This file defines the routes for the Admin section of the application
const AdminRoutes = () => {
  return (
    <>
      {/* Main dashboard route */}
      <Route path="/admin/dashboard" exact component={AdminDashboard} />

      {/* Management routes */}
      <Route path="/admin/clients" exact component={ManageClients} />
      <Route path="/admin/gyms" exact component={ManageGyms} />
      <Route path="/admin/trainers" exact component={ManageTrainers} />
      <Route path="/admin/users" exact component={ManageUsers} />

      {/* Contact us management */}
      <Route
        path="/admin/contact-messages"
        exact
        component={ContactUsManagement}
      />

      {/* Stats and analytics */}
      <Route path="/admin/stats" exact component={AdminStats} />
    </>
  );
};

export default AdminRoutes;
