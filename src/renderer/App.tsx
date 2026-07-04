import { createMemoryRouter, RouterProvider, Outlet } from 'react-router-dom';
import { MessageSquareText } from 'lucide-react';
import './App.css';
import Home from './components/Home';
import PatternWorkspace from './features/pattern/components/PatternWorkspace';
import Header from './components/Header';
import InstrumentConfiguration from './features/instruments/components/InstrumentsConfiguration';
import PatternsConfiguration from './features/pattern/components/PatternsConfiguration';
import LibraryScreen from './features/library/components/LibraryScreen';
import GuideScreen from './features/guide/components/GuideScreen';
import RecorderScreen from './features/recorder/components/RecorderScreen';
import { InstrumentsProvider } from './features/instruments/contexts/InstrumentsContext';
import { PatternsProvider } from './features/pattern/contexts/PatternsContext';
import { AudioProvider } from './features/audio/contexts/AudioContext';
import GuideModalProvider from './features/guide/components/GuideModalProvider';
import GuideModal from './features/guide/components/GuideModal';

const router = createMemoryRouter([
  {
    element: (
      <div className="bg-background min-h-screen">
        <Header />
        <div className="main-container">
          <Outlet />
        </div>
      </div>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'workspace', element: <PatternWorkspace /> },
      {
        path: 'configuration/instruments',
        element: <InstrumentConfiguration />,
      },
      { path: 'configuration/patterns', element: <PatternsConfiguration /> },
      { path: 'library', element: <LibraryScreen /> },
      { path: 'guide', element: <GuideScreen /> },
      { path: 'recorder', element: <RecorderScreen /> },
    ],
  },
]);

export default function App() {
  return (
    <AudioProvider>
      <PatternsProvider>
        <InstrumentsProvider>
          <GuideModalProvider>
            <RouterProvider router={router} />
            <GuideModal />
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfTFrfdn3AjHeKy9fYllv9aqS2XRSrkWce0nmpYVU6WKkVQRg/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-40 btn-primary flex items-center gap-2"
            >
              <MessageSquareText size={16} /> Donner mon avis
            </a>
          </GuideModalProvider>
        </InstrumentsProvider>
      </PatternsProvider>
    </AudioProvider>
  );
}
