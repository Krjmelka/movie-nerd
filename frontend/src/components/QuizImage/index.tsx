import { useMemo } from 'react';
import { QuizRound } from '@movie-nerd/shared';
import { useQuizResult } from '../../context/resultContext/useQuizResult';
import {
  ROUND_TIME_MAP,
  MOVIE_FRAGMENT_IMAGE_SIZE,
  IMAGE_URL_PATH,
  MOVIE_POSTER_IMAGE_SIZE,
} from '../../constants';
import { ProgressContainer } from '../ProgressContainer';
import { GameMode, GameModeMap, QuizData } from '../../types';
import { Image as ImageComponent } from '../Image';
import './style.scss';

type QuizImageProps = {
  mode: GameMode;
  quizData: QuizData;
};

const isMovieQuizData = (_data: QuizData, mode: GameMode): _data is QuizRound =>
  mode === GameModeMap.MOVIE;

export const QuizImage = ({ mode, quizData }: QuizImageProps) => {
  const { isLoading, resultData } = useQuizResult();

  const quizImageContent = useMemo(() => {
    if (isMovieQuizData(quizData, mode)) {
      return (
        <ImageComponent
          src={`${IMAGE_URL_PATH}${MOVIE_FRAGMENT_IMAGE_SIZE.w780}${quizData.imageUrl}`}
          className="movie-img"
          alt="movie-image"
        />
      );
    } else {
      return (
        <div className="frame-container">
          {quizData.actors.map(actor => (
            <ImageComponent
              key={actor.id}
              className="actor-img"
              src={`${IMAGE_URL_PATH}${MOVIE_POSTER_IMAGE_SIZE.w185}${actor.profile_path}`}
              alt={`actor ${actor.name}`}
            />
          ))}
        </div>
      );
    }
  }, [mode, quizData]);
  return (
    <ProgressContainer
      mode={mode}
      timeout={ROUND_TIME_MAP[mode]}
      isPaused={isLoading || !!resultData}
    >
      {quizImageContent}
    </ProgressContainer>
  );
};
