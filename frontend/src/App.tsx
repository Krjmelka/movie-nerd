import { useState } from 'react';
import { MovieQuiz } from './components/MovieQuiz';
import { useMovieQuiz } from './context/movieQuizContext';
import './app.scss';
import { Loading } from './components/Loading';
import { useQuizResult } from './context/resultContext';
import { QuizResult } from './components/QuizResult';
import { Button } from './components/Button';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const { isLoading, quizData, fetchQuizData } = useMovieQuiz();
  const { resultData, resetResultData } = useQuizResult();
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
        <Button
          text="bring it on!"
          onClick={() => {
            fetchQuizData();
            setGameStarted(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
