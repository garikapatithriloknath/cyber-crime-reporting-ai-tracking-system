import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboardModule from '../components/modules/AdminDashboardModule';

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AdminDashboardModule onNavigate={(path) => navigate(path)} />
    </div>
  );
};

export default AdminDashboardPage;
