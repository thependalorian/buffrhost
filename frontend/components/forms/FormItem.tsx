import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export const FormItem: React.FC<Props> = ({ className, children }) => {
  return (
    <div
      className={cn('flex flex-col gap-2', className)}
      data-emotional-impact="Welcoming, professional, supportive"
      data-buffr-host-component="form-item"
    >
      {children}
    </div>
  );
};
