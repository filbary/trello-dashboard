import { Action } from "@/app/types";

const parseHours = (timeInMilliseconds: number): number => {
    return timeInMilliseconds / (1000 * 3600);
};

const calculateMeanTime = (timeDiffs: number[]): number | null => {
    if (timeDiffs.length === 0) {
        return null;
    }
    return timeDiffs.reduce((sum, time) => sum + time, 0) / timeDiffs.length;
};

const getToDoCardsMeanTime = (
  createActions: Action[],
  updateActions: Action[]
): number | null => {
    if (!(createActions && updateActions)) return null;

    const timeDiffs: number[] = createActions
      .map((createAction) => {
          const updateAction = updateActions.find(
            (updateAction) =>
              updateAction.data.listBefore &&
              updateAction.data.card.id === createAction.data.card.id &&
              updateAction.data.listBefore.name === "To Do"
          );

          if (!updateAction) return null;

          const startDate = new Date(createAction.date).getTime();
          const endDate = new Date(updateAction.date).getTime();
          return parseHours(endDate - startDate);
      })
      .filter((time): time is number => time !== null);

    return calculateMeanTime(timeDiffs);
};

const getCardsMeanTimeForList = (
  updateActions: Action[],
  listName: string
): number | null => {
    if (!updateActions) return null;

    const startActions = updateActions.filter(
      (action) => action.data.listAfter && action.data.listAfter.name === listName
    );
    const endActions = updateActions.filter(
      (action) => action.data.listBefore && action.data.listBefore.name === listName
    );

    const timeDiffs: number[] = startActions
      .map((startAction) => {
          const endAction = endActions.find(
            (end) => end.data.card.id === startAction.data.card.id
          );

          if (!endAction) return null;

          const startTime = new Date(startAction.date).getTime();
          const endTime = new Date(endAction.date).getTime();
          return parseHours(endTime - startTime);
      })
      .filter((time): time is number => time !== null);

    return calculateMeanTime(timeDiffs);
};

const getDoneCardsMeanTime = (updateActions: Action[]): number | null => {
    if (!updateActions) return null;

    const startActions = updateActions.filter(
      (action) => action.data.listAfter && action.data.listAfter.name === "Done"
    );

    const now = Date.now();
    const timeDiffs: number[] = startActions.map((startAction) => {
        const startTime = new Date(startAction.date).getTime();
        return parseHours(now - startTime);
    });

    return calculateMeanTime(timeDiffs);
};

export const getListCardsMeanTime = (
  listName: string,
  createActions: Action[],
  updateActions: Action[]
): number | null => {
    switch (listName) {
        case "To Do":
            return getToDoCardsMeanTime(createActions, updateActions);
        case "In Progress":
            return getCardsMeanTimeForList(updateActions, "In Progress");
        case "In Review":
            return getCardsMeanTimeForList(updateActions, "In Review");
        case "Done":
            return getDoneCardsMeanTime(updateActions);
        default:
            return null;
    }
};

export const getSumOfMeanTimes = (
  listNames: string[],
  createActions: Action[],
  updateActions: Action[]
): number | null => {
    if (!listNames || listNames.length === 0) return null;

    const meanTimes = listNames
      .map((listName) => getListCardsMeanTime(listName, createActions, updateActions))
      .filter((meanTime): meanTime is number => meanTime !== null);

    if (meanTimes.length === 0) {
        return null;
    }

    return meanTimes.reduce((sum, time) => sum + time, 0);
};