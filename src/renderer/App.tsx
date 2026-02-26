import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Choix from './features/pattern/components/Choice';
import Header from './components/Header';
import Redact from './features/pattern/components/Redact';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choix" element={<Choix />} />
        <Route path="/redact" element={<Redact />} />
      </Routes>
    </Router>
  );
}
