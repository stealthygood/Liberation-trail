import { GameProvider } from './context/GameContext';
import ScreenManager from './components/ScreenManager';
import Layout from './components/Layout';
import './index.css';

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <Layout>
          <ScreenManager />
        </Layout>
      </GameProvider>
    </ErrorBoundary>
  );
}

export default App;
