"use client"

import React from 'react';
import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { PieGraph } from './pie-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import RecentChanges from "./recent-changes";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NumberTicker from '@/components/ui/number-ticker';
import BlurFade from '@/components/ui/blur-fade';
import { useBoardLists, useBoardUpdateCardActions } from "@/hooks/metrics/useMetrics";
import {UserBoardsDialog} from "@/app/dashboard/overview/_components/UserBoardsDialog";
import {BoardUsersDialog} from "@/app/dashboard/overview/_components/BoardUsersDialog";
import {BoardMetricsDialog} from "@/app/dashboard/overview/_components/BoardMetricsDialog";
import {
  prepareAllMetrics, prepareAreaGraphData,
  prepareBarGraphData,
  preparePieChartData
} from '@/app/dashboard/overview/_components/metrics/utils';
import TotalCardsIcon from '@/components/svg/TotalCardsIcon';
import AvarageProgressIcon from '@/components/svg/AvarageProgressIcon';
import UrgentTaskIcon from '@/components/svg/UrgentTaskIcon';
import TotalCompletedTasksIcon from '@/components/svg/TotalCompletedTasksIcon';
import { Metrics } from '@/app/types';

export default function OverViewPage() {
  const boardId = '670d662b57cc7ed56ea20c22';

  const {
    getLists,
    listsWithCards,
    isPending: isListsPending,
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
    getLists(boardId);
    getCreateActions(boardId);
    getUpdateActions(boardId);
  }, [boardId, getLists, getUpdateActions]);

  const defaultMetrics: Metrics = {
    totalActiveCards: 0,
    averageTaskCompletionTime: '',
    pendingTasks: 0,
    totalCompletedCards: 0,
    recentTasksDone: [],
  };

  const metrics = listsWithCards && updateActions && createActions
    ? prepareAllMetrics(listsWithCards, updateActions, createActions)
    : defaultMetrics;

  const recentActions = updateActions
    ? [...updateActions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const barGraphData = createActions && updateActions
    ? prepareBarGraphData(createActions, updateActions)
    : [];

  const pieChartData = listsWithCards ? preparePieChartData(listsWithCards) : [];

  const areaGraphData = listsWithCards ? prepareAreaGraphData(listsWithCards) : [];

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
            <CalendarDateRangePicker />
            <Button >Download</Button>
          </div>
        </div>
        <UserBoardsDialog />
        <br />
        <BoardUsersDialog />
        <br />
        <BoardMetricsDialog />
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
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
                  <div className="text-2xl font-bold"><NumberTicker value={metrics.totalActiveCards} decimalPlaces={0} /></div>
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
                  <div className="text-2xl font-bold">{metrics.averageTaskCompletionTime}</div>
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
                  <div className="text-2xl font-bold">{metrics.pendingTasks}</div>
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
                  <div className="text-2xl font-bold"><NumberTicker value={metrics.totalCompletedCards} decimalPlaces={0} /></div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph chartData={barGraphData}/>
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Changes Made</CardTitle>
                  <CardDescription>
                    Last 6 actions made
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentChanges recentActions={recentActions} />
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