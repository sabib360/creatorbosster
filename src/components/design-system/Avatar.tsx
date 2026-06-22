import { ImgHTMLAttributes, HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away';
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = 'md', status, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full border border-white/[0.06]',
        {
          'h-6 w-6': size === 'xs',
          'h-8 w-8': size === 'sm',
          'h-10 w-10': size === 'md',
          'h-12 w-12': size === 'lg',
          'h-16 w-16': size === 'xl',
        },
        className
      )}
      {...props}
    >
      {props.children}
      {status && (
        <span className={cn(
          'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0B1120]',
          {
            'bg-emerald-400': status === 'online',
            'bg-white/30': status === 'offline',
            'bg-amber-400': status === 'away',
          }
        )} />
      )}
    </div>
  )
);
Avatar.displayName = 'Avatar';

const AvatarImage = forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      className={cn('aspect-square h-full w-full object-cover', className)}
      {...props}
    />
  )
);
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-white/[0.06] text-sm font-medium text-white/60',
        className
      )}
      {...props}
    />
  )
);
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
