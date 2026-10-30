import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAuthModule from '../components/modules/UserAuthModule';
import UserDashboardModule from '../components/modules/UserDashboardModule';
import NewComplaintModule from '../components/modules/NewComplaintModule';
import ComplaintTrackingModule from '../components/modules/ComplaintTrackingModule';
import MyComplaintsModule from '../components/modules/MyComplaintsModule';
import AiPredictionModule from '../components/modules/AiPredictionModule';
import NotificationsModule from '../components/modules/NotificationsModule';
import UserProfileModule from '../components/modules/UserProfileModule';
import AdminDashboardModule from '../components/modules/AdminDashboardModule';
import AdminComplaintManagementModule from '../components/modules/AdminComplaintManagementModule';
import AdminUpdateStatusModule from '../components/modules/AdminUpdateStatusModule';
import ReportsAnalyticsModule from '../components/modules/ReportsAnalyticsModule';
import BottomReferencePanels from '../components/modules/BottomReferencePanels';

const MasterCollageView = () => {
  const navigate = useNavigate();
  const [selectedComplaintId, setSelectedComplaintId] = useState('COM-2024-002');
  const [lastPrediction, setLastPrediction] = useState({
    category: 'Phishing',
    confidenceCategory: 92,
    priority: 'High',
    confidencePriority: 88,
  });

  const handleComplaintCreated = (complaint) => {
    setSelectedComplaintId(complaint.id);
    if (complaint.confidenceCategory) {
      setLastPrediction({
        category: complaint.category,
        confidenceCategory: complaint.confidenceCategory,
        priority: complaint.priority,
        confidencePriority: complaint.confidencePriority,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#07132B] text-slate-900 pb-12">
      {/* Top Banner matching reference image exactly */}
      <header className="master-header-banner py-5 px-4 text-center shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-wider uppercase font-sans drop-shadow-md">
            CYBER CRIME REPORTING AND AI TRACKING SYSTEM
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-blue-200/90 font-medium tracking-wide mt-1">
            Application Dashboards – All Modules & Sections
          </p>
        </div>
      </header>

      {/* Main Grid Container with all 12 modules */}
      <main className="max-w-[1720px] mx-auto px-3 sm:px-5 lg:px-6 pt-6 space-y-6">
        
        {/* ROW 1: Modules 1, 2, 3, 4 */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Module 1: USER AUTHENTICATION */}
          <div className="xl:col-span-3">
            <UserAuthModule />
          </div>

          {/* Module 2: USER DASHBOARD */}
          <div className="xl:col-span-5">
            <UserDashboardModule onNavigate={(path) => navigate(path)} />
          </div>

          {/* Module 3: NEW COMPLAINT FORM */}
          <div className="xl:col-span-2">
            <NewComplaintModule onComplaintCreated={handleComplaintCreated} />
          </div>

          {/* Module 4: COMPLAINT TRACKING */}
          <div className="xl:col-span-2">
            <ComplaintTrackingModule initialComplaintId={selectedComplaintId} />
          </div>
        </section>

        {/* ROW 2: Modules 5, 6, 7, 8 */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Module 5: MY COMPLAINTS */}
          <div className="xl:col-span-5">
            <MyComplaintsModule
              onNewComplaintClick={() => navigate('/submit-complaint')}
              onSelectComplaint={(id) => setSelectedComplaintId(id)}
            />
          </div>

          {/* Module 6: AI PREDICTION RESULTS */}
          <div className="xl:col-span-3">
            <AiPredictionModule
              category={lastPrediction.category}
              categoryConfidence={lastPrediction.confidenceCategory}
              priority={lastPrediction.priority}
              priorityConfidence={lastPrediction.confidencePriority}
            />
          </div>

          {/* Module 7: NOTIFICATIONS */}
          <div className="xl:col-span-2">
            <NotificationsModule onViewAll={() => navigate('/notifications')} />
          </div>

          {/* Module 8: USER PROFILE */}
          <div className="xl:col-span-2">
            <UserProfileModule />
          </div>
        </section>

        {/* ROW 3: Modules 9, 10, 11, 12 */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Module 9: ADMIN DASHBOARD */}
          <div className="xl:col-span-4">
            <AdminDashboardModule onNavigate={(path) => navigate(path)} />
          </div>

          {/* Module 10: ADMIN – COMPLAINT MANAGEMENT */}
          <div className="xl:col-span-4">
            <AdminComplaintManagementModule
              onSelectComplaint={(id) => setSelectedComplaintId(id)}
              onEditStatus={(id) => setSelectedComplaintId(id)}
            />
          </div>

          {/* Module 11: ADMIN – UPDATE STATUS */}
          <div className="xl:col-span-2">
            <AdminUpdateStatusModule
              initialComplaintId={selectedComplaintId}
              onStatusUpdated={(updated) => setSelectedComplaintId(updated.id)}
            />
          </div>

          {/* Module 12: REPORTS & ANALYTICS */}
          <div className="xl:col-span-2">
            <ReportsAnalyticsModule />
          </div>
        </section>

        {/* ROW 4: Bottom Reference Panels */}
        <section className="pt-2">
          <BottomReferencePanels />
        </section>

      </main>
    </div>
  );
};

export default MasterCollageView;
