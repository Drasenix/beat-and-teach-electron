import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import PatternWorkspace from './features/pattern/components/PatternWorkspace';
import Header from './components/Header';
import InstrumentConfiguration from './features/instruments/components/InstrumentsConfiguration';
import PatternsConfiguration from './features/pattern/components/PatternsConfiguration';
import LibraryScreen from './features/library/components/LibraryScreen';
import GuideScreen from './features/guide/components/GuideScreen';
import { InstrumentsProvider } from './features/instruments/contexts/InstrumentsContext';
import { PatternsProvider } from './features/pattern/contexts/PatternsContext';
import { AudioProvider } from './features/audio/contexts/AudioContext';
import GuideModalProvider from './features/guide/components/GuideModalProvider';
import GuideModal from './features/guide/components/GuideModal';

export default function App() {
  return (
    <Router>
      <AudioProvider>
        <PatternsProvider>
          <InstrumentsProvider>
            <GuideModalProvider>
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
                      element={<PatternsConfiguration />}
                    />
                    <Route path="/library" element={<LibraryScreen />} />
                    <Route path="/guide" element={<GuideScreen />} />
                  </Routes>
                </div>
              </div>
              <GuideModal />
            </GuideModalProvider>
          </InstrumentsProvider>
        </PatternsProvider>
      </AudioProvider>
    </Router>
  );
}
