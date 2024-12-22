import { Action } from '@/app/types';

export const parseHoursToString = (meanInHours: number): string => {
  if (meanInHours > 24) {
    const meanInDays = meanInHours / 24;
    return `${parseFloat(meanInDays.toFixed(2))} days`;
  }

  return `${parseFloat(meanInHours.toFixed(2))} hours`;
};

const getToDoCardsMeanTime = (
  createActions: Action[],
  updateActions: Action[]
): string | null => {
  if (!(createActions && updateActions)) return null;

  let totalTimeDiff = 0;
  let count = 0;

  createActions.forEach((createAction) => {
    const updateAction = updateActions.find(
      (updateAction) =>
        updateAction.data.listBefore &&
        updateAction.data.card.id === createAction.data.card.id &&
        updateAction.data.listBefore.name === 'To Do'
    );

    if (updateAction) {
      const startDate = new Date(createAction.date);
      const endDate = new Date(updateAction.date);

      const timeDiff = endDate.getTime() - startDate.getTime();

      totalTimeDiff += timeDiff / (1000 * 3600);
      count++;
    }
  });

  const meanInHours = count > 0 ? totalTimeDiff / count : 0;
  return parseHoursToString(meanInHours);
};

const getCardsMeanTimeForList = (
  updateActions: Action[],
  listName: string
): string | null => {
  if (!updateActions) return null;

  const startActions = updateActions.filter(
    (action) => action.data.listAfter && action.data.listAfter.name === listName
  );
  const endActions = updateActions.filter(
    (action) =>
      action.data.listBefore && action.data.listBefore.name === listName
  );

  const timeDiffs: number[] = startActions
    .map((startAction) => {
      const endAction = endActions.find(
        (end) => end.data.card.id === startAction.data.card.id
      );

      if (!endAction) {
        return null;
      }

      const startTime = new Date(startAction.date).getTime();
      const endTime = new Date(endAction.date).getTime();

      return (endTime - startTime) / (1000 * 3600);
    })
    .filter((time): time is number => time !== null);

  if (timeDiffs.length === 0) {
    return null;
  }

  const meanInHours =
    timeDiffs.reduce((sum, time) => sum + time, 0) / timeDiffs.length;
  return parseHoursToString(meanInHours);
};

const getDoneCardsMeanTime = (updateActions: Action[]): string | null => {
  if (!updateActions) return null;

  const startActions = updateActions.filter(
    (action) => action.data.listAfter && action.data.listAfter.name === 'Done'
  );

  const now = Date.now();
  const timeDiffs: number[] = startActions.map((startAction) => {
    const startTime = new Date(startAction.date).getTime();
    return (now - startTime) / (1000 * 60 * 60);
  });

  if (timeDiffs.length === 0) {
    return null;
  }

  const meanInHours =
    timeDiffs.reduce((sum, time) => sum + time, 0) / timeDiffs.length;
  return parseHoursToString(meanInHours);
};

export const getListCardsMeanTime = (
  listName: string,
  createActions: Action[],
  updateActions: Action[]
): string | null => {
  switch (listName) {
    case 'To Do':
      return getToDoCardsMeanTime(createActions, updateActions);
    case 'In Progress':
      return getCardsMeanTimeForList(updateActions, 'In Progress');
    case 'In Review':
      return getCardsMeanTimeForList(updateActions, 'In Review');
    case 'Done':
      return getDoneCardsMeanTime(updateActions);
    default:
      return 'N/A';
  }
};
