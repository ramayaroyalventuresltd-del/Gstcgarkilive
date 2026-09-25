import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { LoginScreen } from './components/LoginScreen';
import { HeaderNav, TabType } from './components/HeaderNav';
import { OverviewView } from './views/OverviewView';
import { StaffView } from './views/StaffView';
import { ClassesView } from './views/ClassesView';
import { SubjectsView } from './views/SubjectsView';
import { StudentsView } from './views/StudentsView';
import { AssignmentsView } from './views/AssignmentsView';
import { ResultsView } from './views/ResultsView';
import { ScratchCardsView } from './views/ScratchCardsView';
import { AdminsView } from './views/AdminsView';
import { SettingsView } from './views/SettingsView';
import { Check, ShieldCheck, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const { toastMessage } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [targetStudentId, setTargetStudentId] = useState<string | undefined>(undefined);
  const [scratchCheckerOpen, setScratchCheckerOpen] = useState(false);

  // If user is not logged in
  if (!user) {
    return (
      <>
        <LoginScreen onOpenScratchChecker={() => setScratchCheckerOpen(true)} />

        {/* Modal scratch checker if accessed directly from login page */}
        {scratchCheckerOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-300 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setScratchCheckerOpen(false)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <ScratchCardsView />
            </div>
          </div>
        )}
      </>
    );
  }

  const handleNavigateToResult = (studentId: string) => {
    setTargetStudentId(studentId);
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-[#F9F7F1] flex flex-col text-stone-900 selection:bg-emerald-800 selection:text-white">
      {/* Primary Navigation Header */}
      <HeaderNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && <OverviewView onNavigate={setActiveTab} />}
        {activeTab === 'classes' && <ClassesView />}
        {activeTab === 'subjects' && <SubjectsView />}
        {activeTab === 'staff' && <StaffView />}
        {activeTab === 'students' && (
          <StudentsView onViewStudentResult={handleNavigateToResult} />
        )}
        {activeTab === 'assignments' && <AssignmentsView />}
        {activeTab === 'results' && (
          <ResultsView initialStudentId={targetStudentId} />
        )}
        {activeTab === 'scratchCards' && <ScratchCardsView />}
        {activeTab === 'admins' && <AdminsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Official Footer */}
      <footer className="bg-stone-100 border-t border-stone-200/80 py-6 px-4 text-center text-xs text-stone-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">GSTC Garki</span>
            <span>·</span>
            <span>Government Science &amp; Technical College</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-stone-500">
            <span>Area 10, Garki, Abuja, FCT</span>
            <span>·</span>
            <span>Accredited Technical Education Portal</span>
          </div>
        </div>
      </footer>

      {/* Video-matching Dark Green Toast notification (e.g. "Staff saved" at 01:05) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-[#14532D] text-white rounded-lg shadow-lg border border-emerald-700/80 text-xs sm:text-sm font-semibold tracking-wide">
            <div className="w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainLayout />
      </DataProvider>
    </AuthProvider>
  );
}
