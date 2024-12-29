import { Action } from '@/app/types';
import React from 'react';
import { Loader2 } from 'lucide-react';

type Props = {
  actions: Action[] | undefined;
  isError: boolean;
  error: Error | null;
  isPending: boolean;
};

const RecentTasksClosed: React.FC<Props> = ({
  actions,
  isError,
  error,
  isPending
}) => {
  const header = (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      Recent tasks done:
    </h4>
  );

  if (isError) {
    return (
      <p style={{ color: 'red' }}>
        Tasks: {error?.message || 'Something went wrong. Please try again.'}
      </p>
    );
  }

  if (isPending) {
    return (
      <>
        {header}
        <Loader2 className="animate-spin" />
      </>
    );
  }

  if (!actions) return;

  const movedToDoneActions = actions.filter(
    (action) => action.data.listAfter?.name === 'Done'
  );

  return (
    <div className="overflow-x-auto">
      {header}
      <table>
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Task Name</th>
            <th className="border border-gray-300 px-4 py-2">User</th>
            <th className="border border-gray-300 px-4 py-2">Completed At</th>
          </tr>
        </thead>
        <tbody>
          {movedToDoneActions.map((action) => (
            <tr key={action.id}>
              <td className="border border-gray-300 px-4 py-2">
                {action.data.card.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {action.memberCreator.fullName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(action.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {movedToDoneActions.length === 0 && (
        <p className="mt-4 text-gray-500">No completed tasks found.</p>
      )}
    </div>
  );
};

export default RecentTasksClosed;
