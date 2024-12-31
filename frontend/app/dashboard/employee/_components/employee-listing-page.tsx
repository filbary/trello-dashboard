'use client';

import React, { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import EmployeeTable from './employee-tables';
import {
  useBoardUsers,
  useBoardLists,
  useUsersActionsMap
} from '@/hooks/metrics/useMetrics';
import { Board } from "@/app/types";
import BoardDropdown from "@/app/dashboard/overview/_components/boardsDropdown";


export default function EmployeeListingPage({}) {
  const storedBoards = sessionStorage.getItem("boards");
  const [currentBoardId, setCurrentBoardId] = useState<string>('');
  const [boards, setBoards] = useState<Board[] | null>(null);

  // Fetch stored boards and set initial board ID
  useEffect(() => {
    if (storedBoards) {
      try {
        const parsedBoards = JSON.parse(storedBoards) as Board[];
        parsedBoards.push({ id: "dupskodupsko", name: "DUPA" });
        setBoards(parsedBoards);
        setCurrentBoardId(parsedBoards[0]?.id || '');
      } catch (error) {
        console.error("Error parsing stored boards:", error);
      }
    }
  }, [storedBoards]);

  const { getUsers, users } = useBoardUsers();
  const { getLists, listsWithCards } = useBoardLists();

  useEffect(() => {
    if(currentBoardId){
      getUsers(currentBoardId);
      getLists(currentBoardId)
    }
  }, [currentBoardId, getUsers, getLists]);

  const { actionCounts,  fetchActionsMap } = useUsersActionsMap();

  useEffect(() => {
    if(users){
      fetchActionsMap(users);
    }
  }, [users]);

  const handleBoardSelect = (board: Board) => {
    setCurrentBoardId(board.id);
  };

  return (
      <PageContainer scrollable>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <BoardDropdown boards={boards} onSelect={handleBoardSelect}/>
              <Heading title={`Employees (${users?.length || 0})`}/>
            </div>
          </div>
          <Separator/>
          <EmployeeTable
              data={users || []}
              totalData={users?.length || 0}
              listsWithCards={listsWithCards || []}
              actionCounts={actionCounts || {}}
          />
        </div>
      </PageContainer>
  );
}