import { ReactNode } from 'react';
import cn from 'classnames';
import { GameMode } from '../../types';
import { ASPECT_RATIO_MAP } from '../../constants';
import './style.scss';

type ProgressContainer = JSX.IntrinsicElements['div'] & {
  children: ReactNode;
  timeout: number;
  mode: GameMode;
  isPaused?: boolean;
};

export const ProgressContainer = ({
  children,
  timeout,
  mode,
  isPaused,
  className,
}: ProgressContainer) => {
  return (
    <div
      className={cn('frame', className, {
        'animation-paused': isPaused,
      })}
      style={
        {
          aspectRatio: ASPECT_RATIO_MAP[mode],
          '--round-time': `${timeout}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};
