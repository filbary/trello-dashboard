import {
  fetchBoardCardActions,
  fetchBoardUsers,
  fetchListsWithCards,
  fetchTrelloBoards,
  fetchUsersActionsMap
} from '@/app/api/metrics/actions';
import { useMutation } from '@tanstack/react-query';
import { User } from '@/app/types';
import { useState } from 'react';

export const useTrelloBoards = () => {
  const {
    mutate: getBoards,
    data,
    isPending,
    isError,
    error
  } = useMutation({
    mutationFn: (username: string) => fetchTrelloBoards(username)
  });

  return {
    getBoards,
    boards: data,
    isPending,
    isError,
    error
  };
};

export const useBoardUsers = () => {
  const {
    mutate: getUsers,
    data,
    isPending,
    isError,
    error
  } = useMutation({
    mutationFn: (boardId: string) => fetchBoardUsers(boardId)
  });

  return {
    getUsers,
    users: data,
    isPending,
    isError,
    error
  };
};

export const useBoardLists = () => {
  const {
    mutate: getLists,
    data,
    isPending,
    isError,
    error
  } = useMutation({
    mutationFn: (boardId: string) => fetchListsWithCards(boardId)
  });

  return {
    getLists,
    listsWithCards: data,
    isPending,
    isError,
    error
  };
};

export const useBoardUpdateCardActions = (isCreateFilter?: boolean) => {
  const {
    mutate: getActions,
    data,
    isPending,
    isError,
    error
  } = useMutation({
    mutationFn: (boardId: string) =>
      fetchBoardCardActions(boardId, isCreateFilter ? 'createCard' : undefined)
  });

  return {
    getActions,
    actions: data,
    isPending,
    isError,
    error
  };
};

export const useUsersActionsMap = () => {
  const [actionCounts, setActionCounts] = useState<Record<string, number>>({});
  const [isFetching, setIsFetching] = useState(false);

  const fetchActionsMap = async (users: User[]) => {
    setIsFetching(true);
    try {
      const countsMap = await fetchUsersActionsMap(users);
      setActionCounts(countsMap);
    } finally {
      setIsFetching(false);
    }
  };

  return { actionCounts, isFetching, fetchActionsMap };
};
