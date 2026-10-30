import React from 'react';
import { useLocation } from 'react-router-dom';
import ComplaintTrackingModule from '../components/modules/ComplaintTrackingModule';

const TrackComplaintPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialId = searchParams.get('id') || '';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ComplaintTrackingModule initialComplaintId={initialId} />
    </div>
  );
};

export default TrackComplaintPage;
