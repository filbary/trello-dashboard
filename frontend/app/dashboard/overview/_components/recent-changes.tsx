'use client';

import React from 'react';
import StatusIndicator from '@/components/status-indicator';
import { ListWithCards } from '@/app/types';

type RecentChangesProps = {
  recentActions: {
    id: string;
    data: {
      card: { id: string; name: string };
      list: { name: string };
    };
    memberCreator: { fullName: string };
    date: string;
  }[];
  listsWithCards: ListWithCards[];
};

const RecentChanges: React.FC<RecentChangesProps> = ({ recentActions, listsWithCards }) => {
  const findCardDetails = (cardId: string, listsWithCards: ListWithCards[]) => {
    for (const list of listsWithCards) {
      const card = list.cards.find((card) => card.id === cardId);
      if (card) {
        return { shortUrl: card.shortUrl, type: card.labels[0]?.name.toLowerCase() || 'other' };
      }
    }
    return { shortUrl: '#', type: 'other' };
  };

  const displayedActions = recentActions.slice(0, 6);

  // Handle the case when there are no actions to display
  if (displayedActions.length === 0) {
    return <p className="text-muted-foreground">No recent changes to display.</p>;
  }

  return (
      <div className="space-y-4">
        {displayedActions.map((action) => {
          const { shortUrl, type } = findCardDetails(action.data.card.id, listsWithCards);

          return (
              <div key={action.id} className="flex items-center">
                <StatusIndicator type={type} />
                <div className="ml-4 flex-1">
                  <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                  >
                    <p className="text-sm font-medium leading-none text-foreground inline-block relative">
                      {action.data.card.name}
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                    </p>
                  </a>
                  <p className="text-sm text-muted-foreground">{action.memberCreator.fullName}</p>
                </div>
                <div className="ml-auto text-sm font-medium text-foreground">
                  {new Date(action.date).toLocaleDateString()}
                </div>
              </div>
          );
        })}
      </div>
  );
};

export default RecentChanges;
