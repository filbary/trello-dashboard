import { Action, CardWithTimeLeft, ListWithCards, Metrics, User } from '@/app/types';
import {
    getListCardsMeanTime,
    getSumOfMeanTimes
} from '@/app/dashboard/overview/_components/metrics/meanTimeInListUtils';

export const getUsersCardCount = (user: User, listsWithCards: ListWithCards[]): number => {
    return listsWithCards.reduce((totalCount, list) => {
        const userCardsCount = list.cards.filter((card) => card.idMembers.includes(user.id)).length;
        return totalCount + userCardsCount;
    }, 0);
};

export const parseHoursToString = (meanInHours: number): string => {
    if (meanInHours > 24) {
        const meanInDays = meanInHours / 24;
        return `${parseFloat(meanInDays.toFixed(2))} days`;
    }
    return `${parseFloat(meanInHours.toFixed(2))} hours`;
};

export const getUpcomingCards = (listsWithCards: ListWithCards[]): CardWithTimeLeft[] => {
    const now = Date.now();
    const allCards = listsWithCards.flatMap((list) => list.cards);
    return allCards
      .filter((card) => new Date(card.due).getTime() > now)
      .map((card) => ({
          name: card.name,
          timeLeftInHours: ((new Date(card.due).getTime() - now) / (1000 * 3600)),
      }))
      .sort((a, b) => a.timeLeftInHours - b.timeLeftInHours);
};

export const countActionsInLastDays = (actions: Action[], days: number): number => {
    const now = Date.now();
    const daysAgo = now - days * 24 * 60 * 60 * 1000;
    return actions.filter((action) => {
        const actionDate = new Date(action.date).getTime();
        return actionDate >= daysAgo && actionDate <= now;
    }).length;
};

const getTotalActiveCards = (listsWithCards: ListWithCards[]): number => {
    return listsWithCards
      .filter((list) => ["To Do", "In Progress", "In Review"].includes(list.name))
      .reduce((total, list) => total + list.cards.length, 0);
};

const getAverageTaskCompletionTime = (createActions: Action[], updateActions: Action[]): string => {
    return parseHoursToString(getSumOfMeanTimes(["To Do", 'In Progress'], createActions, updateActions) || 0);
};

const getPendingTasks = (listsWithCards: ListWithCards[]): number => {
    const now = Date.now();
    return listsWithCards.flatMap((list) =>
      list.cards.filter(
        (card) => card.due && new Date(card.due).getTime() < now && !card.dueComplete
      )
    ).length;
};

const getTotalCompletedCards = (listsWithCards: ListWithCards[]): number => {
    return listsWithCards
      .filter((list) => list.name === "Done")
      .reduce((total, list) => total + list.cards.length, 0);
};

const getRecentTasksDone = (updateActions: Action[]): { cardName: string; completedBy: string; completedOn: string; }[] => {
    const completedActions = updateActions.filter(
      (action) => action.data.listAfter?.name === "Done"
    );
    return completedActions.map((action) => ({
        cardName: action.data.card.name,
        completedBy: action.memberCreator.fullName,
        completedOn: new Date(action.date).toLocaleDateString(),
    }));
};

export const prepareAllMetrics = (listsWithCards: ListWithCards[], updateActions: Action[], createActions: Action[]): Metrics => {
    return {
        totalActiveCards: getTotalActiveCards(listsWithCards),
        averageTaskCompletionTime: getAverageTaskCompletionTime(createActions, updateActions),
        pendingTasks: getPendingTasks(listsWithCards),
        totalCompletedCards: getTotalCompletedCards(listsWithCards),
        recentTasksDone: getRecentTasksDone(updateActions),
    };
};

type BarGraphData = {
    date: string; // YYYY-MM-DD
    created: number;
    completed: number;
}[];

export function prepareBarGraphData(
  createActions: Action[],
  updateActions: Action[]
): BarGraphData {
    const formatDate = (date: string): string => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const isInCurrentMonth = (date: string): boolean => {
        const now = new Date();
        const actionDate = new Date(date);
        return (
          actionDate.getFullYear() === now.getFullYear() &&
          actionDate.getMonth() === now.getMonth()
        );
    };

    const groupActionsByDay = (actions: Action[]): Record<string, number> => {
        const grouped: Record<string, number> = {};
        actions.forEach((action) => {
            const date = formatDate(action.date);
            grouped[date] = (grouped[date] || 0) + 1;
        });
        return grouped;
    };

    const getAllDatesInCurrentMonth = (): string[] => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0);
        const dates: string[] = [];
        let currentDate = startOfMonth;
        while (currentDate <= endOfMonth) {
            dates.push(formatDate(currentDate.toISOString()));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const createActionsInMonth = createActions.filter((action) =>
      isInCurrentMonth(action.date)
    );
    const updateActionsInMonth = updateActions.filter((action) =>
      isInCurrentMonth(action.date)
    );

    const createdGrouped = groupActionsByDay(createActionsInMonth);
    const completedGrouped = groupActionsByDay(updateActionsInMonth);

    const allDates = getAllDatesInCurrentMonth();
    const barGraphData: BarGraphData = allDates.map((date) => ({
        date,
        created: createdGrouped[date] || 0,
        completed: completedGrouped[date] || 0,
    }));

    return barGraphData;
}

export function preparePieChartData(listsWithCards: ListWithCards[]) {
    const nameToConfigKey: Record<string, string> = {
        'To Do': 'todo',
        'In Progress': 'inProgress',
        'In Review': 'inReview',
        'Done': 'done'
    };

    return listsWithCards.map((list) => ({
        table: nameToConfigKey[list.name] || list.name,
        tasks: list.cards.length,
        fill: `hsl(var(--chart-${Object.keys(nameToConfigKey).indexOf(list.name) + 1}))`
    }));
}

export function prepareAreaGraphData(
  listsWithCards: ListWithCards[]
): { date: string; frontend: number; backend: number; devops: number }[] {
    const dateCounts: Record<string, { frontend: number; backend: number; devops: number }> = {};

    listsWithCards.forEach((list) => {
        list.cards.forEach((card) => {
            if (!card.start) return;
            try {
                const startDate = new Date(card.start).toISOString().split("T")[0];
                if (!dateCounts[startDate]) {
                    dateCounts[startDate] = { frontend: 0, backend: 0, devops: 0 };
                }
                card.labels.forEach((label) => {
                    const labelNameLower = label.name?.toLowerCase() || "";
                    if (labelNameLower === "frontend") {
                        dateCounts[startDate].frontend += 1;
                    } else if (labelNameLower === "backend") {
                        dateCounts[startDate].backend += 1;
                    } else if (labelNameLower === "devops") {
                        dateCounts[startDate].devops += 1;
                    }
                });
            } catch (error) {
                console.error(`Error processing card: ${card.id}`, error);
            }
        });
    });

    return Object.entries(dateCounts)
      .map(([date, counts]) => {
          if (!date) {
              console.warn("Undefined date detected in dateCounts");
              return { date: "", frontend: 0, backend: 0, devops: 0 };
          }
          return { date, ...counts };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}