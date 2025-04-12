import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import CreatorDashboard from './pages/CreatorDashboard';
import MemberDashboard from './pages/MemberDashboard';
import CreatorSettings from './pages/CreatorSettings';
import MemberSettings from './pages/MemberSettings';
import ProtectedRoute from './components/ProtectedRoute';
import CreatorSignup from './pages/CreatorSignup';
import MemberSignup from './pages/MemberSignup';
import ChatList from './components/ChatList/ChatList';
import { AblyProvider } from './contexts/AblyContext';
import ChatPage from './pages/Chat/ChatPage';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Settings/Settings';
import CreatorProfile from './pages/Profile/CreatorProfile';

function App() {
  return (
    <BrowserRouter>
      <AblyProvider>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/creator-signup" element={<CreatorSignup />} />
            <Route path="/member-signup" element={<MemberSignup />} />

            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator/:id" 
              element={
                <ProtectedRoute>
                  <CreatorProfile />
                </ProtectedRoute>
              } 
            />

            {/* Creator-only routes */}
            <Route 
              path="/creator-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['creator']}>
                  <CreatorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator-settings" 
              element={
                <ProtectedRoute allowedRoles={['creator']}>
                  <CreatorSettings />
                </ProtectedRoute>
              } 
            />

            {/* Member-only routes */}
            <Route 
              path="/member-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['member']}>
                  <MemberDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/member-settings" 
              element={
                <ProtectedRoute allowedRoles={['member']}>
                  <MemberSettings />
                </ProtectedRoute>
              } 
            />

            {/* Default route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Layout>
      </AblyProvider>
    </BrowserRouter>
  );
}

export default App;
