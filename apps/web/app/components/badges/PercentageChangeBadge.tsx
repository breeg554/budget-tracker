import { cn } from '~/utils/cn';

export type PercentageChangeBadgeProps = {
  value: number;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;

export const PercentageChangeBadge = ({
  value,
  ...rest
}: PercentageChangeBadgeProps) => {
  if (value > 0) {
    return <NegativeBadge value={value} {...rest} />;
  } else if (value < 0) {
    return <PositiveBadge value={value} {...rest} />;
  } else {
    return <NeutralBadge value={value} {...rest} />;
  }
};

function PositiveBadge({
  value,
  className,
  ...rest
}: PercentageChangeBadgeProps) {
  return (
    <BadgeWrapper
      className={cn('text-green-600 bg-green-500/15', className)}
      {...rest}
    >
      {value.toFixed(1)}%
    </BadgeWrapper>
  );
}

function NegativeBadge({
  value,
  className,
  ...rest
}: PercentageChangeBadgeProps) {
  return (
    <BadgeWrapper
      className={cn('text-red-600 bg-red-500/15', className)}
      {...rest}
    >
      {value.toFixed(1)}%
    </BadgeWrapper>
  );
}

function NeutralBadge({
  value,
  className,
  ...rest
}: PercentageChangeBadgeProps) {
  return (
    <BadgeWrapper
      className={cn('text-foreground bg-gray-500/15', className)}
      {...rest}
    >
      {value.toFixed(1)}%
    </BadgeWrapper>
  );
}

function BadgeWrapper({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-1 rounded text-[10px] w-fit flex items-center justify-center h-fit',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
