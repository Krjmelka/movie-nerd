import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MovieQuizProvider } from './context/movieQuizContext/index.tsx';
import { ResultProvider } from './context/resultContext/index.tsx';

createRoot(document.getElementById('root')!).render(
  <MovieQuizProvider>
    <ResultProvider>
      <App />
    </ResultProvider>
  </MovieQuizProvider>
);
