import { useEffect, useState, useRef } from 'react';
import cn from 'classnames';
import { MovieImage } from '../MovieImage';
import { Button } from '../Button';
import { useQuizResult } from '../../context/resultContext/useQuizResult';
import { GameMode, QuizData } from '../../types';
import { ROUND_TIME_MAP } from '../../constants';
import './style.scss';

type MovieQuizProps = {
  quizData: QuizData;
  gameMode: GameMode;
};

export const MovieQuiz = ({ quizData, gameMode }: MovieQuizProps) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const { sendResultData, isLoading, resultData } = useQuizResult();

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      sendResultData({ roundId: quizData.roundId });
    }, ROUND_TIME_MAP[gameMode] * 1000);
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [quizData, sendResultData, gameMode]);

  return (
    <div
      className={cn('movie-quiz', {
        loading: isLoading,
      })}
    >
      <MovieImage mode={gameMode} quizData={quizData} />
      {quizData.variants.map(variant => (
        <Button
          key={variant.id}
          disabled={isLoading || !!resultData}
          selected={variant.id === activeButton}
          onClick={() => {
            if (isLoading) return;
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
            }
            setActiveButton(variant.id);
            sendResultData({
              roundId: quizData.roundId,
              variantId: variant.id,
            });
          }}
          text={variant.title}
        />
      ))}
    </div>
  );
};
