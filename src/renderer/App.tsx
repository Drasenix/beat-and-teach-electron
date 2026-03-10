import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import PatternWorkspace from './features/pattern/components/PatternWorkspace';
import Header from './components/Header';
import InstrumentConfiguration from './features/instruments/components/InstrumentsConfiguration';
import { InstrumentsProvider } from './features/instruments/contexts/InstrumentsContext';

export default function App() {
  return (
    <Router>
      <InstrumentsProvider>
        <div className="bg-background min-h-screen">
          <Header />
          <div className="pl-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/workspace" element={<PatternWorkspace />} />
              <Route
                path="/configuration"
                element={<InstrumentConfiguration />}
              />
            </Routes>
          </div>
        </div>
      </InstrumentsProvider>
    </Router>
  );
}
