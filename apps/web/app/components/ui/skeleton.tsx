import { cn } from '~/utils/cn';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <span
      className={cn(
        'inline-block align-middle animate-pulse rounded-md bg-muted',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
