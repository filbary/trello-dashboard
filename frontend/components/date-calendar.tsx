'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import * as React from 'react';

export function CalendarDatePicker({
    className
}: React.HTMLAttributes<HTMLDivElement>) {
  // Current date
  const currentDate = new Date();

  return (
      <div className={cn('grid gap-2', className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
                id="date"
                variant={'outline'}
                className={cn(
                    'w-[260px] justify-start text-left font-normal'
                )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(currentDate, 'LLL dd, y')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
                initialFocus
                mode="single"
                selected={currentDate}
                disabled={{ before: currentDate, after: currentDate }}
                onSelect={() => {}} // No-op since selection is disabled
            />
          </PopoverContent>
        </Popover>
      </div>
  );
}
