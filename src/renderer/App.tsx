import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Choix from './components/Choix';
import Pattern from './components/Pattern';
import Header from './components/Header';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choix" element={<Choix />} />
        <Route path="/pattern" element={<Pattern />} />
      </Routes>
    </Router>
  );
}
