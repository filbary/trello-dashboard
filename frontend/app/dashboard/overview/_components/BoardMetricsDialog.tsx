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
import {
  useBoardLists,
  useBoardUpdateCardActions
} from '@/hooks/metrics/useMetrics';
import React, { useState } from 'react';
import RecentTasksClosed from '@/app/dashboard/overview/_components/metrics/RecentTasksClosed';
import ListsSummary from '@/app/dashboard/overview/_components/metrics/ListsSummary';
import NearDueDateCards from '@/app/dashboard/overview/_components/metrics/NearDueDateCards';
import { countActionsInLastDays } from '@/app/dashboard/overview/_components/metrics/utils';
import { Separator } from '@/components/ui/separator';

export function BoardMetricsDialog() {
  const [boardId, setBoardId] = useState('');
  const {
    getLists,
    listsWithCards,
    isPending: isListsPending,
    isError: isListsError,
    error: listError
  } = useBoardLists();

  const {
    getActions: getUpdateActions,
    actions: updateActions,
    isPending: isUpdateActionsPending,
    isError: isUpdateActionsError,
    error: updateActionsError
  } = useBoardUpdateCardActions();

  const {
    getActions: getCreateActions,
    actions: createActions,
    isPending: isCreateActionsPending,
    isError: isCreateActionsError,
    error: createActionsError
  } = useBoardUpdateCardActions(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getLists(boardId);
    getUpdateActions(boardId);
    getCreateActions(boardId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Board metrics</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-[40vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Type in board id</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Type in board id to see its metrics
        </DialogDescription>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="boardId" className="text-right">
                Board id
              </Label>
              <Input
                id="boardId"
                className="col-span-3"
                value={boardId}
                onChange={(e) => setBoardId(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isListsPending}>
              {isListsPending ? 'Loading...' : 'Apply'}
            </Button>
          </DialogFooter>
        </form>
        <ListsSummary
          lists={listsWithCards}
          createActions={createActions}
          updateActions={updateActions}
          isListsError={isListsError}
          listsError={listError}
          isActionsPending={isCreateActionsPending}
          isActionsError={isCreateActionsError}
          actionsError={createActionsError}
        />
        {createActions && (
          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Tasks created in last 30 days:{' '}
              {countActionsInLastDays(createActions, 30)}
            </h4>
            <Separator />
          </div>
        )}
        <NearDueDateCards
          lists={listsWithCards}
          isListsError={isListsError}
          listsError={listError}
        />
        <RecentTasksClosed
          actions={updateActions}
          isError={isUpdateActionsError}
          error={updateActionsError}
          isPending={isUpdateActionsPending}
        />
      </DialogContent>
    </Dialog>
  );
}
