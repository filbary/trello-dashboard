export type Board = {
    id: string
    name: string
}

export type Card = {
    id: string
    name: string
    start: string
    due: string
    dueComplete: boolean
    idMembers: string[]
    labels: { id: string; name: string }[];
}

export type CardWithTimeLeft = {
    name: string;
    timeLeftInHours: number;
};

export type TrelloList = {
    id: string
    name: string
}

export type ListWithCards = {
    id: string
    name: string
    cards: Card[]
}

export type User = {
    id: string
    fullName: string
    username: string
}

export type ActionData = {
    card: Card
    listBefore: TrelloList
    listAfter: TrelloList
    list: TrelloList
}

export type Action = {
    id: string
    data: ActionData
    date: string
    memberCreator: User
}

export type ActionsCount = {
    _value: number
}

export type Metrics = {
    totalActiveCards: number;
    averageTaskCompletionTime: string;
    pendingTasks: number;
    totalCompletedCards: number;
    recentTasksDone: {
        cardName: string;
        completedBy: string;
        completedOn: string;
    }[];
};
