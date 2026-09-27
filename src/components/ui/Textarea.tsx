import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...rest }, ref) => <textarea ref={ref} className={cn('input', 'textarea', className)} {...rest} />,
);
Textarea.displayName = 'Textarea';
