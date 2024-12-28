import React from 'react';

type StatusType =
    | "frontend"
    | "backend"
    | "devops"
    | "documentation"
    | "design"
    | "testing"
    | "research"
    | "management"
    | "other";

interface StatusIndicatorProps {
  type: string;
}

const STATUS_STYLES: Record<StatusType, string> = {
  frontend: "text-purple-700 bg-purple-100",
  backend: "text-blue-800 bg-blue-200",
  devops: "text-teal-700 bg-teal-100",
  documentation: "text-gray-700 bg-gray-100",
  design: "text-yellow-700 bg-yellow-100",
  testing: "text-orange-700 bg-orange-100",
  research: "text-indigo-700 bg-indigo-100",
  management: "text-slate-700 bg-slate-200",
  other: "text-black bg-gray-200",
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ type }) => {
  const statusType = (type.toLowerCase().replace(' ', '') as StatusType) in STATUS_STYLES
      ? (type.toLowerCase().replace(' ', '') as StatusType)
      : "other";
  const statusStyle = STATUS_STYLES[statusType];

  return (
      <div
          className={`text-xs font-semibold rounded px-2 py-1 w-24 text-center ${statusStyle}`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
  );
};

export default StatusIndicator;