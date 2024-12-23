import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StatusIndicator from '@/components/status-indicator';

export function RecentChanges() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <StatusIndicator type="In Progress" />
        <div className="ml-4 flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">
            Implement Authentication
          </p>
          <p className="text-sm text-muted-foreground">Olivia Martin</p>
        </div>
        <div className="ml-auto text-sm font-medium">2023-10-21</div>
      </div>

      <div className="flex items-center">
        <StatusIndicator type="Done" />
        <div className="ml-4 flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">
            Set Up Database Schema
          </p>
          <p className="text-sm text-muted-foreground">Jackson Lee</p>
        </div>
        <div className="ml-auto text-sm font-medium">2023-10-20</div>
      </div>

      <div className="flex items-center">
        <StatusIndicator type="In Review" />
        <div className="ml-4 flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">
            UI Design for Dashboard
          </p>
          <p className="text-sm text-muted-foreground">Isabella Nguyen</p>
        </div>
        <div className="ml-auto text-sm font-medium">2023-10-19</div>
      </div>

      <div className="flex items-center">
        <StatusIndicator type="Blocked" />
        <div className="ml-4 flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">API Integration</p>
          <p className="text-sm text-muted-foreground">William Kim</p>
        </div>
        <div className="ml-auto text-sm font-medium">2023-10-18</div>
      </div>

      <div className="flex items-center">
        <StatusIndicator type="Backlog" />
        <div className="ml-4 flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">
            Set Up Testing Framework
          </p>
          <p className="text-sm text-muted-foreground">Sofia Davis</p>
        </div>
        <div className="ml-auto text-sm font-medium">2023-10-17</div>
      </div>

      {/* Example of Other status type */}
      <div className="flex items-center">
        <StatusIndicator type="Unknown" />
        <div className="ml-4 flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">Legacy Code Review</p>
          <p className="text-sm text-muted-foreground">John Doe</p>
        </div>
        <div className="ml-auto text-sm font-medium">2023-10-16</div>
      </div>
    </div>
  );
}
