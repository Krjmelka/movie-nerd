import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MovieQuiz } from './components/MovieQuiz';
import { useMovieQuiz } from './context/movieQuizContext/useMovieQuiz';
import './app.scss';
import { Loading } from './components/Loading';
import { useQuizResult } from './context/resultContext/useQuizResult';
import { QuizResult } from './components/QuizResult';
import { Button } from './components/Button';
import { LanguagePicker } from './components/LanguagePicker';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const { isLoading, quizData, fetchQuizData } = useMovieQuiz();
  const { resultData, resetResultData } = useQuizResult();
  const { t } = useTranslation();

  return (
    <div className="container">
      {gameStarted ? (
        <>
          {isLoading || !quizData ? (
            <Loading />
          ) : (
            <MovieQuiz quizData={quizData} />
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
            text={t('Bring it on!')}
            onClick={() => {
              fetchQuizData();
              setGameStarted(true);
            }}
          />
          <LanguagePicker />
        </>
      )}
    </div>
  );
}

export default App;
