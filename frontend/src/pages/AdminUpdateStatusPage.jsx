import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdminUpdateStatusModule from '../components/modules/AdminUpdateStatusModule';

const AdminUpdateStatusPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialId = searchParams.get('id') || 'COM-2024-002';
  const [activeId, setActiveId] = useState(initialId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <AdminUpdateStatusModule
        initialComplaintId={activeId}
        onStatusUpdated={(updated) => setActiveId(updated.id)}
      />
    </div>
  );
};

export default AdminUpdateStatusPage;
