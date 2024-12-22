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
  useBoardUsers,
  useUsersActionsMap
} from '@/hooks/metrics/useMetrics';
import React, { useEffect, useState } from 'react';
import { getUsersCardCount } from '@/app/dashboard/overview/_components/metrics/utils';
import { Loader2 } from 'lucide-react';

export function BoardUsersDialog() {
  const [boardId, setBoardId] = useState('');
  const { getUsers, users, isPending, isError, error } = useBoardUsers();
  const {
    getLists,
    listsWithCards,
    isPending: isListPending,
    isError: isListError,
    error: listError
  } = useBoardLists();

  const {
    actionCounts,
    isFetching: isActionsCountFetching,
    fetchActionsMap
  } = useUsersActionsMap();

  useEffect(() => {
    if (users) {
      fetchActionsMap(users);
    }
  }, [users]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getUsers(boardId);
    getLists(boardId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Check users</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Type in board id</DialogTitle>
        </DialogHeader>
        <DialogDescription>Type in board id to see its users</DialogDescription>
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
            <Button type="submit" disabled={isPending || isListPending}>
              {isPending ? 'Loading...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
        {(isError || isListError) && (
          <p style={{ color: 'red' }}>
            {error?.message ||
              listError?.message ||
              'Something went wrong. Please try again.'}
          </p>
        )}
        {users && (
          <div>
            <h3>Users:</h3>
            {users.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">
                      Full name
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Username
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Tasks count
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Actions count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {user.fullName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {user.username}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {isListPending && <Loader2 className="animate-spin" />}
                        {listsWithCards &&
                          getUsersCardCount(user, listsWithCards)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {isActionsCountFetching && (
                          <Loader2 className="animate-spin" />
                        )}
                        {!isActionsCountFetching && actionCounts[user.id]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <b style={{ color: 'gray' }}>Board has no users :(</b>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
