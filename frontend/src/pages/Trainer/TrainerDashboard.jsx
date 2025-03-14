import React from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';

const TrainerDashboard = () => {
  const { user } = useAuthContext();

  return (
    <div className="dashboard-container">
      <h1>Trainer Dashboard</h1>
      <div className="dashboard-content">
        <h2>Welcome, {user.name}</h2>
        <h1>IM A trainer</h1>
      </div>
    </div>
  );
};

export default TrainerDashboard;
