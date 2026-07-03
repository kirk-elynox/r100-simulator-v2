import { cn } from '@/lib/utils';
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> { variant?: 'default' | 'outline' | 'secondary' }
export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div className={cn(
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
      variant === 'default'   && 'bg-electric-violet/20 text-electric-violet-dark',
      variant === 'secondary' && 'bg-zinc-800 text-zinc-400',
      variant === 'outline'   && 'border border-zinc-700 text-zinc-400',
      className
    )} {...props} />
  );
}
