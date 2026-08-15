import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import JobListView from './components/JobListView';
import PublicJobDetailView from './components/PublicJobDetailView';
import ApplicationListView from './components/ApplicationListView';
import ApplicationDetailView from './components/ApplicationDetailView';
import api from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [serverStatus, setServerStatus] = useState('checking');
  
  // Data states
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  
  // Selected detail states
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Check Server Health
  const checkHealth = async () => {
    try {
      const res = await api.get('/health');
      if (res.status === 'OK') {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (err) {
      setServerStatus('offline');
    }
  };

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      if (res.success && Array.isArray(res.data)) {
        setJobs(res.data);
      }
    } catch (err) {
      console.warn('Error loading jobs from API:', err.message);
    }
  };

  // Fetch Applications
  const fetchApplications = async () => {
    try {
      const res = await api.get('/jobs');
      if (res.success && Array.isArray(res.data)) {
        // Collect applications from all jobs
        const allApps = [];
        for (const j of res.data) {
          const jDetail = await api.get(`/jobs/${j.id}`);
          if (jDetail.success && jDetail.data?.applications) {
            jDetail.data.applications.forEach(app => {
              allApps.push({
                ...app,
                job: { title: j.title, department: j.department }
              });
            });
          }
        }
        setApplications(allApps);
      }
    } catch (err) {
      console.warn('Error loading applications:', err.message);
    }
  };

  useEffect(() => {
    checkHealth();
    fetchJobs();
    fetchApplications();

    // Periodic check
    const timer = setInterval(checkHealth, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setCurrentView('job-detail');
  };

  const handleSelectApplication = (app) => {
    setSelectedApplication(app);
    setCurrentView('application-detail');
  };

  const handleApplicationSubmitted = () => {
    fetchJobs();
    fetchApplications();
    setCurrentView('applications');
  };

  const handleStatusUpdated = () => {
    fetchApplications();
    if (selectedApplication) {
      api.get(`/applications/${selectedApplication.id}`).then(res => {
        if (res.success && res.data) {
          setSelectedApplication(res.data);
        }
      }).catch(err => console.error(err));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={(view) => {
          setCurrentView(view);
          setSelectedJob(null);
          setSelectedApplication(null);
        }} 
        serverStatus={serverStatus} 
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8">
          {currentView === 'dashboard' && (
            <DashboardView 
              jobs={jobs} 
              applications={applications} 
              onNavigate={(view) => setCurrentView(view)}
              onOpenCreateJob={() => setCurrentView('jobs')}
            />
          )}

          {currentView === 'jobs' && (
            <JobListView 
              jobs={jobs} 
              fetchJobs={fetchJobs} 
              onSelectJob={handleSelectJob}
              onOpenApplyModal={(job) => {
                setSelectedJob(job);
                setCurrentView('job-detail');
              }}
            />
          )}

          {currentView === 'job-detail' && selectedJob && (
            <PublicJobDetailView 
              job={selectedJob} 
              onBack={() => setCurrentView('jobs')}
              onApplicationSubmitted={handleApplicationSubmitted}
            />
          )}

          {currentView === 'applications' && (
            <ApplicationListView 
              applications={applications} 
              onSelectApplication={handleSelectApplication}
            />
          )}

          {currentView === 'application-detail' && selectedApplication && (
            <ApplicationDetailView 
              application={selectedApplication} 
              onBack={() => setCurrentView('applications')}
              onStatusUpdated={handleStatusUpdated}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950 py-5 text-center text-xs text-slate-500">
          <p>Dự án Đồ án Sinh viên - Hệ thống Quản lý Tuyển dụng Tích hợp AI (Decoupled Monorepo)</p>
          <p className="mt-1 font-mono text-[11px] text-slate-600">
            Node.js Express + Prisma ORM + SQLite + Google Gemini AI | React Vite + Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
