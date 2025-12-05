import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authentification from './components/Authentification';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Authentification />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
