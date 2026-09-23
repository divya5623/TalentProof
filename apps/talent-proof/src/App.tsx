import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Shell } from './components/layout/Shell'
import { Landing } from './pages/Landing'
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { StudentDashboard } from './pages/student/Dashboard'
import { StudentProfile } from './pages/student/Profile'
import { SubmitProject } from './pages/student/Submit'
import { ProjectDetail } from './pages/student/ProjectDetail'
import { AnalysisReport } from './pages/student/Analysis'
import { ExecutionPage } from './pages/student/Execution'
import { AssessmentPage } from './pages/student/Assessment'
import { VerificationReport } from './pages/student/Report'
import { StudentInbox } from './pages/student/Inbox'
import { TechMatrixPage } from './pages/TechMatrix'
import { SharePage } from './pages/public/Share'
import { RecruiterDiscover } from './pages/recruiter/Discover'
import { CandidatePage } from './pages/recruiter/Candidate'
import { RecruiterRequests } from './pages/recruiter/Requests'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/tech-matrix" element={<TechMatrixPage />} />
            <Route path="/share/:shareId" element={<SharePage />} />

            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/submit" element={<SubmitProject />} />
            <Route path="/student/inbox" element={<StudentInbox />} />
            <Route path="/student/projects/:id" element={<ProjectDetail />} />
            <Route path="/student/projects/:id/analysis" element={<AnalysisReport />} />
            <Route path="/student/projects/:id/execution" element={<ExecutionPage />} />
            <Route path="/student/projects/:id/assessment" element={<AssessmentPage />} />
            <Route path="/student/projects/:id/report" element={<VerificationReport />} />

            <Route path="/recruiter" element={<RecruiterDiscover />} />
            <Route path="/recruiter/candidates/:id" element={<CandidatePage />} />
            <Route path="/recruiter/requests" element={<RecruiterRequests />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
