import React from 'react';
import { Action, ListWithCards } from '@/app/types';
import { getListCardsMeanTime } from '@/app/dashboard/overview/_components/metrics/meanTimeInListUtils';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type Props = {
  lists?: ListWithCards[];
  createActions?: Action[];
  updateActions?: Action[];
  isListsError: boolean;
  listsError: Error | null;
  isActionsPending: boolean;
  isActionsError: boolean;
  actionsError: Error | null;
};

const ListsSummary: React.FC<Props> = ({
  lists,
  createActions,
  updateActions,
  isListsError,
  listsError,
  isActionsPending,
  isActionsError,
  actionsError
}) => {
  if (isActionsPending)
    return (
      <div>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Total tasks{' '}
        </h4>
        <Loader2 className="animate-spin" />
      </div>
    );

  if (isListsError || isActionsError) {
    return (
      <p style={{ color: 'red' }}>
        {listsError?.message ||
          actionsError?.message ||
          'Something went wrong. Please try again.'}
      </p>
    );
  }

  if (!(createActions && updateActions && lists)) return;

  if (lists.length === 0) {
    return <b style={{ color: 'gray' }}>Board has no lists :(</b>;
  }

  const totalCards = lists.reduce((sum, list) => sum + list.cards.length, 0);

  return (
    <div>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Total tasks: {totalCards}
      </h4>
      <table>
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">List name</th>
            <th className="border border-gray-300 px-4 py-2">
              Current tasks count
            </th>
            <th className="border border-gray-300 px-4 py-2">
              Cards mean time inside
            </th>
          </tr>
        </thead>
        <tbody>
          {lists.map((list) => (
            <tr key={list.id}>
              <td className="border border-gray-300 px-4 py-2">{list.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                {list.cards.length}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {getListCardsMeanTime(list.name, createActions, updateActions)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Separator className="mt-2" />
    </div>
  );
};

export default ListsSummary;
