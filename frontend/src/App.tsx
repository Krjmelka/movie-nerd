import { useTranslation } from 'react-i18next';
import { MovieQuiz } from './components/MovieQuiz';
import { useMovieQuiz } from './context/movieQuizContext/useMovieQuiz';
import { Loading } from './components/Loading';
import { useQuizResult } from './context/resultContext/useQuizResult';
import { QuizResult } from './components/QuizResult';
import { Button } from './components/Button';
import { LanguagePicker } from './components/LanguagePicker';
import { useGameMode } from './context/gameModeContext/useGameMode';
import { GameMode, GameModeMap, QuizData } from './types';
import './app.scss';

function App() {
  const { isLoading, quizData, fetchQuizData } = useMovieQuiz();
  const { resultData, resetResultData } = useQuizResult();
  const { isGameStarted, setGameMode, gameMode } = useGameMode();
  const { t } = useTranslation();

  return (
    <div className="container">
      {isGameStarted ? (
        <>
          {isLoading || !quizData ? (
            <Loading />
          ) : (
            <MovieQuiz
              quizData={quizData as QuizData}
              gameMode={gameMode as GameMode}
            />
          )}
          {resultData && (
            <QuizResult
              onSubmit={() => {
                fetchQuizData();
                resetResultData();
              }}
              resultData={resultData}
            />
          )}
        </>
      ) : (
        <>
          <Button
            text={t('Guess by movie image')}
            onClick={() => {
              setGameMode(GameModeMap.MOVIE);
            }}
          />
          <Button
            text={t('Guess by movie actors')}
            onClick={() => {
              setGameMode(GameModeMap.ACTORS);
            }}
          />
          <LanguagePicker />
        </>
      )}
    </div>
  );
}

export default App;
