import cn from 'classnames';
import './style.scss';

type ButtonProps = JSX.IntrinsicElements['button'] & {
  text: string;
  selected?: boolean;
};

export const Button = ({ text, className, selected, ...rest }: ButtonProps) => {
  return (
    <button
      {...rest}
      className={cn('button', className, {
        selected,
      })}
    >
      {text}
    </button>
  );
};
