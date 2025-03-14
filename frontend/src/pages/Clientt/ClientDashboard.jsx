import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const ClientDashboard = () => {
  const { user } = useAuthContext();

  return (
    <div className="dashboard-container">
      <h1>Client Dashboard</h1>
      <div className="dashboard-content">
        <h2>Welcome, {user.name}</h2>
        <h1>IM A CLIENT</h1>
      </div>
    </div>
  );
};

export default ClientDashboard;
