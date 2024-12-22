import {Action, ActionsCount, Board, ListWithCards, User} from "@/app/types";

const apiKey = process.env.NEXT_PUBLIC_TRELLO_API_KEY
const apiToken = process.env.NEXT_PUBLIC_TRELLO_API_TOKEN

export const fetchTrelloBoards = async (username: string): Promise<Board[]> => {
    if (!apiKey || !apiToken) {
        throw new Error('API key or token not found.')
    }

    const response = await fetch(`https://api.trello.com/1/members/${username}/boards?fields=id,name&key=${apiKey}&token=${apiToken}`)

    if (response.status == 404) {
        throw new Error('User not found')
    } else if (!response.ok) {
        throw new Error('Failed to fetch data.')
    }

    return await response.json()
}

export const fetchBoardUsers = async (boardId: string): Promise<User[]> => {
    if (!apiKey || !apiToken) {
        throw new Error('API key or token not found.')
    }

    const response = await fetch(`https://api.trello.com/1/boards/${boardId}/members?key=${apiKey}&token=${apiToken}`)

    if (response.status == 404) {
        throw new Error('Board not found')
    } else if (!response.ok) {
        throw new Error('Failed to fetch data.')
    }

    return response.json()
}

export const fetchListsWithCards = async (boardId: string): Promise<ListWithCards[]> => {
    if (!apiKey || !apiToken) {
        throw new Error('API key or token not found.')
    }

    const response = await fetch(`https://api.trello.com/1/boards/${boardId}/lists?cards=open&fields=id,name&key=${apiKey}&token=${apiToken}`)

    if (response.status == 404) {
        throw new Error('Board not found')
    } else if (!response.ok) {
        throw new Error('Failed to fetch data.')
    }

    return response.json()
}

export const fetchBoardCardActions = async (boardId: string, filter?: string): Promise<Action[]> => {
    if (!apiKey || !apiToken) {
        throw new Error('API key or token not found.')
    }

    filter = filter ? filter : "updateCard"

    const response = await fetch(`https://api.trello.com/1/boards/${boardId}/actions?fields=data,date&filter=${filter}&memberCreator_fields=id,fullName,username&limit=1000&key=${apiKey}&token=${apiToken}`)

    if (response.status == 404) {
        throw new Error('Board not found')
    } else if (!response.ok) {
        throw new Error('Failed to fetch data.')
    }

    return response.json()
}

export const fetchUserActionsCount = async (userId: string): Promise<ActionsCount> => {
    if (!apiKey || !apiToken) {
        throw new Error('API key or token not found.')
    }

    const response = await fetch(`https://api.trello.com/1/members/${userId}/actions?format=count&limit=1000&key=${apiKey}&token=${apiToken}`)

    if (response.status == 404) {
        throw new Error('User not found')
    } else if (!response.ok) {
        throw new Error('Failed to fetch data.')
    }

    return response.json()
}

export const fetchUsersActionsMap = async (users: User[]): Promise<Record<string, number>> => {
    const counts = await Promise.all(
        users.map(async (user) => {
            const result = await fetchUserActionsCount(user.id);
            return { userId: user.id, count: result._value };
        })
    );

    return counts.reduce((acc, { userId, count }) => {
        acc[userId] = count;
        return acc;
    }, {} as Record<string, number>);
};
