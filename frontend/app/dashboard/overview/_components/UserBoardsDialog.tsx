'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTrelloBoards } from '@/hooks/metrics/useMetrics';
import React, { useState } from 'react';

export function UserBoardsDialog() {
  const [username, setUsername] = useState('');
  const { getBoards, boards, isPending, isError, error } = useTrelloBoards();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getBoards(username);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Select you dashboard</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Type in your Trello username</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Type in your Trello username and select board you want to get metrics
          from
        </DialogDescription>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                className="col-span-3"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Loading...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
        {isError && (
          <p style={{ color: 'red' }}>
            {error?.message || 'Something went wrong. Please try again.'}
          </p>
        )}
        {boards && (
          <div>
            <h3>Boards:</h3>
            {boards.length > 0 ? (
              <ul>
                {boards.map((board) => (
                  <li key={board.id}>{board.name}</li>
                ))}
              </ul>
            ) : (
              <b style={{ color: 'gray' }}>User has no boards :(</b>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
