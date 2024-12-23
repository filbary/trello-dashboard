import React from 'react';

type StatusType =
  | 'todo'
  | 'backlog'
  | 'inreview'
  | 'done'
  | 'inprogress'
  | 'blocked'
  | 'other';

interface StatusIndicatorProps {
  type: string;
}

const STATUS_STYLES: Record<StatusType, string> = {
  todo: 'text-gray-600 bg-gray-100',
  backlog: 'text-purple-600 bg-purple-100',
  inreview: 'text-yellow-600 bg-yellow-100',
  done: 'text-green-600 bg-green-100',
  inprogress: 'text-blue-600 bg-blue-100',
  blocked: 'text-red-600 bg-red-100',
  other: 'text-black bg-gray-200'
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ type }) => {
  const statusType =
    (type.toLowerCase().replace(' ', '') as StatusType) in STATUS_STYLES
      ? (type.toLowerCase().replace(' ', '') as StatusType)
      : 'other';
  const statusStyle = STATUS_STYLES[statusType];

  const statusText = statusType
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div
      className={`w-24 rounded px-2 py-1 text-center text-xs font-semibold ${statusStyle}`}
    >
      {type}
    </div>
  );
};

export default StatusIndicator;
