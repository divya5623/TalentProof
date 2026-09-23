import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { PublicLayout } from './components/PublicLayout'
import { RequireStep } from './components/RequireStep'
import { AppProvider } from './context/AppContext'
import { CertificateStudio } from './pages/CertificateStudio'
import { Claims } from './pages/Claims'
import { ExamRoom } from './pages/ExamRoom'
import { ExamsLobby } from './pages/ExamsLobby'
import { GitHubEvidence } from './pages/GitHubEvidence'
import { Home } from './pages/Home'
import { Onboarding } from './pages/Onboarding'
import { Profile } from './pages/Profile'
import { ProjectAudit } from './pages/ProjectAudit'
import { ProjectsLobby } from './pages/ProjectsLobby'
import { PublicShare } from './pages/PublicShare'
import { Reconcile } from './pages/Reconcile'
import { ResumeEvidence } from './pages/ResumeEvidence'
import { Settings } from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="certificate/share" element={<PublicShare />} />
          </Route>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route
              path="claims"
              element={
                <RequireStep step="claims">
                  <Claims />
                </RequireStep>
              }
            />
            <Route
              path="evidence/resume"
              element={
                <RequireStep step="evidence">
                  <ResumeEvidence />
                </RequireStep>
              }
            />
            <Route
              path="evidence/github"
              element={
                <RequireStep step="evidence">
                  <GitHubEvidence />
                </RequireStep>
              }
            />
            <Route
              path="reconcile"
              element={
                <RequireStep step="reconcile">
                  <Reconcile />
                </RequireStep>
              }
            />
            <Route
              path="exams"
              element={
                <RequireStep step="exams">
                  <ExamsLobby />
                </RequireStep>
              }
            />
            <Route
              path="exams/:skillId"
              element={
                <RequireStep step="exams">
                  <ExamRoom />
                </RequireStep>
              }
            />
            <Route
              path="projects"
              element={
                <RequireStep step="projects">
                  <ProjectsLobby />
                </RequireStep>
              }
            />
            <Route
              path="projects/:repoId"
              element={
                <RequireStep step="projects">
                  <ProjectAudit />
                </RequireStep>
              }
            />
            <Route
              path="certificate"
              element={
                <RequireStep step="certificate">
                  <CertificateStudio />
                </RequireStep>
              }
            />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
