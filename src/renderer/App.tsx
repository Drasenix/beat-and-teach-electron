import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import PatternConstruction from './features/pattern/components/PatternConstruction';
import Header from './components/Header';
import InstrumentConfiguration from './features/instruments/components/InstrumentsConfiguration';

export default function App() {
  return (
    <div className="bg-background min-h-screen">
      <Router>
        <Header />
        <div className="pl-16" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/construction" element={<PatternConstruction />} />
          <Route path="/configuration" element={<InstrumentConfiguration />} />
        </Routes>
      </Router>
    </div>
  );
}
