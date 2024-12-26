import { ReactNode } from 'react';
import cn from 'classnames';
import './style.scss';

type ProgressContainer = JSX.IntrinsicElements['div'] & {
  children: ReactNode;
  timeout: number;
  aspectRatio: string;
  isPaused?: boolean;
};

export const ProgressContainer = ({
  children,
  timeout,
  isPaused,
  className,
  aspectRatio,
}: ProgressContainer) => {
  return (
    <div
      className={cn('frame', className, {
        'animation-paused': isPaused,
      })}
      style={
        {
          aspectRatio,
          '--round-time': `${timeout}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};
