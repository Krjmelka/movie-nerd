import cn from 'classnames';

type ImageProps = JSX.IntrinsicElements['img'];

export const Image = ({ className, ...rest }: ImageProps) => {
  return (
    <img
      onContextMenu={event => {
        event.preventDefault();
        return false;
      }}
      onDragStart={event => {
        event.preventDefault();
        return false;
      }}
      className={cn('image', className)}
      {...rest}
    />
  );
};
