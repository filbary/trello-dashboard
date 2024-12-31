'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTrelloBoards } from '@/hooks/metrics/useMetrics';
import { useEffect } from 'react';

type UserFormValue = {
  name: string;
};

const customResolver = async (values: UserFormValue) => {
  const errors: Record<string, { message: string }> = {};

  if (!values.name?.trim()) {
    errors.name = { message: 'Name is required' };
  }

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors: errors
  };
};

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
  const { getBoards, boards, isPending, isError, error } = useTrelloBoards();

  const form = useForm<UserFormValue>({
    defaultValues: { name: '' },
    resolver: customResolver
  });

  const handleSubmit = form.handleSubmit((data) => {
    const username = data.name;
    getBoards(username); // Fetch Trello boards
  });

  // Handle boards and error state in a useEffect
  useEffect(() => {
    if (boards && Array.isArray(boards)) {
      sessionStorage.setItem('boards', JSON.stringify(boards));
      signIn('credentials', {
        name: form.getValues('name'),
        callbackUrl
      }).then(() => {
        toast.success('Logged in successfully!');
      });
    } else if (isError) {
      toast.error(error?.message ?? 'Failed to fetch boards. Please try again.');
    }
  }, [boards, isError, form, callbackUrl, error]);

  return (
      <>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="w-full space-y-2">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trello username</FormLabel>
                      <FormControl>
                        <Input
                            type="text"
                            placeholder="Enter your Trello username..."
                            disabled={isPending}
                            {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
            />
            <Button disabled={isPending} className="ml-auto w-full" type="submit">
              {isPending ? 'Fetching Boards...' : 'Continue'}
            </Button>
          </form>
        </Form>
        {isError && (
            <p style={{ color: 'red' }}>{error?.message ?? 'Something went wrong. Please try again.'}</p>
        )}
      </>
  );
}
