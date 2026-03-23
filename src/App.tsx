
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import { AuthProvider } from './context/AuthContext';
import Pricing from './pages/Pricing';
import GeneralSettings from './pages/settings/GeneralSettings';
import AccountSettings from './pages/settings/AccountSettings';
import { RequireAuth } from './components/RequireAuth';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/projects"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />

          <Route
            path="/projects/:id"
            element={<Navigate to="story" replace />}
          />
          <Route
            path="/projects/:id/:tab"
            element={
              <RequireAuth>
                <Editor />
              </RequireAuth>
            }
          />
          <Route path="/pricing" element={<Pricing />} />

          {/* Settings Routes */}
          <Route
            path="/settings"
            element={<Navigate to="/settings/general" replace />}
          />
          <Route
            path="/settings/general"
            element={
              <RequireAuth>
                <GeneralSettings />
              </RequireAuth>
            }
          />
          <Route
            path="/settings/account"
            element={
              <RequireAuth>
                <AccountSettings />
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
