import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserDashboardModule from '../components/modules/UserDashboardModule';

const UserDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <UserDashboardModule onNavigate={(path) => navigate(path)} />
    </div>
  );
};

export default UserDashboardPage;
