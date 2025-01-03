import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { MovieQuizProvider } from './context/movieQuizContext/MovieQuizProvider.tsx';
import { ResultProvider } from './context/resultContext/ResultProvider.tsx';
import ErrorBoundary from './components/ErrorBoundary/index.tsx';
import './i18n/i18n';
import './index.css';
import { GameModeProvider } from './context/gameModeContext/GameModeProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <GameModeProvider>
      <MovieQuizProvider>
        <ResultProvider>
          <App />
        </ResultProvider>
      </MovieQuizProvider>
    </GameModeProvider>
  </ErrorBoundary>
);
