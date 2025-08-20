import { ReactNode } from 'react';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

function FieldRenderer({
  label,
  description,
  children,
}: {
  label?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>{children}</FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}

export { FieldRenderer };
