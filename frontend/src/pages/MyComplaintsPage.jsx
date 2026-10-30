import React from 'react';
import { useNavigate } from 'react-router-dom';
import MyComplaintsModule from '../components/modules/MyComplaintsModule';

const MyComplaintsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <MyComplaintsModule
        onNewComplaintClick={() => navigate('/submit-complaint')}
        onSelectComplaint={(id) => navigate(`/track-complaint?id=${id}`)}
      />
    </div>
  );
};

export default MyComplaintsPage;
