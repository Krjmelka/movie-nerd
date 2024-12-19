import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { Button } from '../Button';
import './style.scss';
import { IMAGE_URL_PATH, MOVIE_POSTER_IMAGE_SIZE } from '../../constants';
import { IMDBLogo } from '../IMDBLogo/imdex';
import { QuizRoundResult } from '@movie-nerd/shared';
type QuizResultProps = {
  onSubmit: () => void;
  resultData: QuizRoundResult;
};

export const QuizResult = ({ onSubmit, resultData }: QuizResultProps) => {
  const { t } = useTranslation();
  const {
    isCorrect,
    poster: posterUrl,
    title: movieTitle,
    imdbUrl,
  } = resultData;
  return createPortal(
    <div className="quiz-result">
      <div className="quiz-result__container">
        <div
          className={cn('quiz-result__title', {
            success: isCorrect,
          })}
        >
          {t(isCorrect ? 'You were correct!' : 'You were wrong!')}
        </div>
        <a href={imdbUrl} target="_blank" className="imdb-link">
          <img
            src={`${IMAGE_URL_PATH}${MOVIE_POSTER_IMAGE_SIZE.w500}${posterUrl}`}
            alt="movie-image"
          />
          <IMDBLogo className="logo" />
        </a>
        <div className="quiz-result__movie-title">{movieTitle}</div>
        <Button text={t('Next')} onClick={() => onSubmit()} />
      </div>
    </div>,
    document.getElementById('root') as HTMLElement
  );
};
