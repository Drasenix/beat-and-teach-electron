import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import PatternWorkspace from './features/pattern/components/PatternWorkspace';
import Header from './components/Header';
import InstrumentConfiguration from './features/instruments/components/InstrumentsConfiguration';
import PatternConfiguration from './features/pattern/components/PatternConfiguration';
import { InstrumentsProvider } from './features/instruments/contexts/InstrumentsContext';
import { PatternsProvider } from './features/pattern/contexts/PatternsContext';

export default function App() {
  return (
    <Router>
      <PatternsProvider>
        <InstrumentsProvider>
          <div className="bg-background min-h-screen">
            <Header />
            <div className="main-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/workspace" element={<PatternWorkspace />} />
                <Route
                  path="/configuration/instruments"
                  element={<InstrumentConfiguration />}
                />
                <Route
                  path="/configuration/patterns"
                  element={<PatternConfiguration />}
                />
              </Routes>
            </div>
          </div>
        </InstrumentsProvider>
      </PatternsProvider>
    </Router>
  );
}
