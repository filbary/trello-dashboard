import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StatusIndicator from '@/components/status-indicator';

type RecentChangesProps = {
  recentActions: {
    id: string;
    data: {
      card: { name: string };
      list: { name: string };
    };
    memberCreator: { fullName: string };
    date: string;
  }[];
};

const RecentChanges: React.FC<RecentChangesProps> = ({ recentActions }) => {
  const displayedActions = recentActions.slice(0, 6); // Show only the 5 most recent actions

  if (!displayedActions || displayedActions.length === 0) {
    return <p className="text-gray-500">No recent changes to display.</p>;
  }

  return (
    <div className="space-y-4">
      {displayedActions.map((action) => (
        <div key={action.id} className="flex items-center">
          <StatusIndicator type={action.data.list?.name || "Other"} />
          <div className="ml-4 flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{action.data.card.name}</p>
            <p className="text-sm text-muted-foreground">
              {action.memberCreator.fullName}
            </p>
          </div>
          <div className="ml-auto text-sm font-medium">
            {new Date(action.date).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentChanges;