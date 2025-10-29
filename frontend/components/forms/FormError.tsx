import { cn } from '@/lib/utils';

type Props = {
  message?: string;
  as?: 'p' | 'span';
  className?: string;
};

export const FormError: React.FC<Props> = ({ message, as, className }) => {
  const Element = as || 'p';

  if (!message) {
    return null;
  }

  return (
    <Element
      className={cn('text-semantic-error text-sm', className)}
      data-emotional-impact="Caring, helpful, not punitive"
      data-buffr-host-component="form-error"
    >
      {message}
    </Element>
  );
};
