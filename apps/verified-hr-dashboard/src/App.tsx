import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppProvider } from './context/AppContext';
import { Analytics } from './pages/Analytics';
import { CandidateProfile } from './pages/CandidateProfile';
import { Compare } from './pages/Compare';
import { FindTalent } from './pages/FindTalent';
import { JobDetail, JobsIndex } from './pages/Jobs';
import { Overview } from './pages/Overview';
import { SavedSearches } from './pages/SavedSearches';
import { Settings } from './pages/Settings';
import { ShortlistDetail, ShortlistsIndex } from './pages/Shortlists';
import { Team } from './pages/Team';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="talent" element={<FindTalent />} />
            <Route path="talent/:id" element={<CandidateProfile />} />
            <Route path="compare" element={<Compare />} />
            <Route path="shortlists" element={<ShortlistsIndex />} />
            <Route path="shortlists/:id" element={<ShortlistDetail />} />
            <Route path="jobs" element={<JobsIndex />} />
            <Route path="jobs/:id" element={<JobDetail />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="saved-searches" element={<SavedSearches />} />
            <Route path="team" element={<Team />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
