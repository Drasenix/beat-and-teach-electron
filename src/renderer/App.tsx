import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import PatternConstruction from './features/pattern/components/PatternConstruction';
import Header from './components/Header';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/construction" element={<PatternConstruction />} />
      </Routes>
    </Router>
  );
}
