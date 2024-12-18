import { useEffect, useState, useRef } from 'react';
import cn from 'classnames';
import { QuizRound } from '@movie-nerd/shared';
import { MovieImage } from '../MovieImage';
import { Button } from '../Button';
import './style.scss';
import { useQuizResult } from '../../context/resultContext';
import { ROUND_TIME } from '../../constants';

type MovieQuizProps = {
  quizData: QuizRound;
};

export const MovieQuiz = ({ quizData }: MovieQuizProps) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const { sendResultData, isLoading, resultData } = useQuizResult();

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      sendResultData({ roundId: quizData.roundId });
    }, ROUND_TIME * 1000);
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [quizData, sendResultData]);

  return (
    <div
      className={cn('movie-quiz', {
        loading: isLoading,
      })}
    >
      <MovieImage imageUrl={quizData.imageUrl} />
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
