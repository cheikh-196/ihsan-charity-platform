// ===================================
// IHSAN Frontend — App Routeur
// ===================================
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NeedsPage from './pages/NeedsPage';
import TransparencyPage from './pages/TransparencyPage';
import ValidatorPage from './pages/ValidatorPage';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/needs" element={<NeedsPage />} />
            <Route path="/transparency" element={<TransparencyPage />} />
            <Route path="/validator" element={<ValidatorPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
