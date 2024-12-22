import React from 'react';
import { ListWithCards } from '@/app/types';
import { parseHoursToString } from '@/app/dashboard/overview/_components/metrics/meanTimeInListUtils';
import { Separator } from '@/components/ui/separator';
import { getUpcomingCards } from '@/app/dashboard/overview/_components/metrics/utils';

type Props = {
  lists?: ListWithCards[];
  isListsError: boolean;
  listsError: Error | null;
};

const NearDueDateCards: React.FC<Props> = ({
  lists,
  isListsError,
  listsError
}) => {
  if (!lists) return;

  if (isListsError) {
    return (
      <p style={{ color: 'red' }}>
        {listsError?.message || 'Something went wrong. Please try again.'}
      </p>
    );
  }

  const cardsWithTimeLeft = getUpcomingCards(lists);

  return (
    <div>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Tasks near due date
      </h4>
      <table>
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Task name</th>
            <th className="border border-gray-300 px-4 py-2">Time left</th>
          </tr>
        </thead>
        <tbody>
          {cardsWithTimeLeft.map((upcomingCard) => (
            <tr key={upcomingCard.name}>
              <td className="border border-gray-300 px-4 py-2">
                {upcomingCard.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {parseHoursToString(upcomingCard.timeLeftInHours)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Separator className="mt-2" />
    </div>
  );
};

export default NearDueDateCards;
