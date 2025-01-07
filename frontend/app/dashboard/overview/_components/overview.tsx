'use client';

import React, {useState} from 'react';
import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { PieGraph } from './pie-graph';
import {CalendarDatePicker} from '@/components/date-calendar';
import PageContainer from '@/components/layout/page-container';
import RecentChanges from './recent-changes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import NumberTicker from '@/components/ui/number-ticker';
import BlurFade from '@/components/ui/blur-fade';
import {
  useBoardLists,
  useBoardUpdateCardActions
} from '@/hooks/metrics/useMetrics';
import {
  prepareAllMetrics,
  prepareAreaGraphData,
  prepareBarGraphData,
  preparePieChartData
} from '@/app/dashboard/overview/_components/metrics/utils';
import TotalCardsIcon from '@/components/svg/TotalCardsIcon';
import AvarageProgressIcon from '@/components/svg/AvarageProgressIcon';
import UrgentTaskIcon from '@/components/svg/UrgentTaskIcon';
import TotalCompletedTasksIcon from '@/components/svg/TotalCompletedTasksIcon';
import {Board, Metrics} from '@/app/types';
import BoardDropdown from "@/app/dashboard/overview/_components/boardsDropdown";
import {useSession} from "next-auth/react";
import TimerPopover from "@/components/timer-popover";


export default function OverViewPage() {
  const storedBoards = sessionStorage.getItem("boards");
  const [currentBoardId, setCurrentBoardId] = useState<string>('');
  const [boards, setBoards] = useState<Board[] | null>(null);

  React.useEffect(() => {
    if (storedBoards) {
      try {
        const parsedBoards = JSON.parse(storedBoards) as Board[];
        setBoards(parsedBoards);
        setCurrentBoardId(parsedBoards[0]?.id || ''); // Set the first board ID as default
      } catch (error) {
        console.error("Error parsing stored boards:", error);
      }
    }
  }, [storedBoards]);
  const {
    getLists,
    listsWithCards,
    isPending: isListsPending
  } = useBoardLists();

  const {
    getActions: getUpdateActions,
    actions: updateActions,
    isPending: isUpdateActionsPending,
    isError: isUpdateActionsError,
    error: updateActionsError
  } = useBoardUpdateCardActions();
  const {
    getActions: getCreateActions,
    actions: createActions,
    isPending: isCreateActionsPending,
    isError: isCreateActionsError,
    error: createActionsError
  } = useBoardUpdateCardActions(true);

  React.useEffect(() => {
    if (currentBoardId) {
      getLists(currentBoardId);
      getCreateActions(currentBoardId);
      getUpdateActions(currentBoardId);
    }
  }, [currentBoardId, getLists, getCreateActions, getUpdateActions]);

  const defaultMetrics: Metrics = {
    totalActiveCards: 0,
    averageTaskCompletionTime: '',
    pendingTasks: 0,
    totalCompletedCards: 0,
    recentTasksDone: []
  };

  const metrics =
      listsWithCards &&
      Array.isArray(listsWithCards) &&
      updateActions &&
      createActions
          ? prepareAllMetrics(listsWithCards, updateActions, createActions)
          : defaultMetrics;

  const movedToDoneActions = updateActions
      ? [...updateActions]
          .filter((action) => action.data.listAfter?.name === 'Done')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      : [];

  const barGraphData =
      createActions && updateActions
          ? prepareBarGraphData(createActions, movedToDoneActions)
          : [];

  const pieChartData =
      listsWithCards && Array.isArray(listsWithCards)
          ? preparePieChartData(listsWithCards)
          : [];

  const areaGraphData =
      listsWithCards && Array.isArray(listsWithCards)
          ? prepareAreaGraphData(listsWithCards)
          : [];

  const handleBoardSelect = (board: Board) => {
    setCurrentBoardId(board.id);
    console.log("Selected Board:", board.id);
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <BlurFade delay={0.25} inView>
            <h2 className="text-2xl font-bold tracking-tight">
              Hi, Welcome back 👋
            </h2>
          </BlurFade>
          <div className="hidden items-center space-x-2 md:flex">
            <TimerPopover/>
            <CalendarDatePicker/>
          </div>

        </div>
        <br/>
        <BoardDropdown boards={boards} onSelect={handleBoardSelect}/>
        <br/>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Cards
                  </CardTitle>
                  <TotalCardsIcon></TotalCardsIcon>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <NumberTicker
                        value={metrics.totalActiveCards}
                        decimalPlaces={0}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Progress
                  </CardTitle>
                  <AvarageProgressIcon></AvarageProgressIcon>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics.averageTaskCompletionTime}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Urgent Tasks
                  </CardTitle>
                  <UrgentTaskIcon></UrgentTaskIcon>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics.pendingTasks}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Completed Tasks
                  </CardTitle>
                  <TotalCompletedTasksIcon></TotalCompletedTasksIcon>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <NumberTicker
                        value={metrics.totalCompletedCards}
                        decimalPlaces={0}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph chartData={barGraphData}/>
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Task Completed</CardTitle>
                  <CardDescription>
                    Last 6 actions moved to Done table
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentChanges
                      recentActions={movedToDoneActions}
                      listsWithCards={listsWithCards || []}
                  />
                </CardContent>
              </Card>
              <div className="col-span-4">
                <AreaGraph chartData={areaGraphData}/>
              </div>
              <div className="col-span-4 md:col-span-3">
                <PieGraph chartData={pieChartData}/>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
