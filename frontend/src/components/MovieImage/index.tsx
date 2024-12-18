import cn from 'classnames';
import './style.scss';
import { useQuizResult } from '../../context/resultContext';
import {
  ROUND_TIME,
  MOVIE_FRAGMENT_IMAGE_SIZE,
  IMAGE_URL_PATH,
} from '../../constants';
import React from 'react';

type MovieImageProps = JSX.IntrinsicElements['img'] & {
  imageUrl: string;
};

export const MovieImage = ({
  imageUrl,
  className,
  ...rest
}: MovieImageProps) => {
  const { isLoading, resultData } = useQuizResult();
  return (
    <div
      className={cn('frame', {
        'animation-paused': isLoading || !!resultData,
      })}
      style={
        {
          '--round-time': `${ROUND_TIME}s`,
        } as React.CSSProperties
      }
    >
      <img
        onContextMenu={event => {
          event.preventDefault();
          return false;
        }}
        onDragStart={event => {
          event.preventDefault();
          return false;
        }}
        {...rest}
        className={cn('image', className)}
        src={`${IMAGE_URL_PATH}${MOVIE_FRAGMENT_IMAGE_SIZE.w780}${imageUrl}`}
        alt="movie-image"
      />
    </div>
  );
};
