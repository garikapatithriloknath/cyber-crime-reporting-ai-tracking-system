import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminComplaintManagementModule from '../components/modules/AdminComplaintManagementModule';

const AdminComplaintsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AdminComplaintManagementModule
        onSelectComplaint={(id) => navigate(`/admin/update-status?id=${id}`)}
        onEditStatus={(id) => navigate(`/admin/update-status?id=${id}`)}
      />
    </div>
  );
};

export default AdminComplaintsPage;
