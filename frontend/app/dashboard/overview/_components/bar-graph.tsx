'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'An interactive bar chart';

const chartData = [
  { date: '2024-04-01', defects: 3, stories: 1 },
  { date: '2024-04-02', defects: 4, stories: 0 },
  { date: '2024-04-03', defects: 1, stories: 1 },
  { date: '2024-04-04', defects: 6, stories: 1 },
  { date: '2024-04-05', defects: 5, stories: 0 },
  { date: '2024-04-06', defects: 3, stories: 1 },
  { date: '2024-04-07', defects: 2, stories: 2 },
  { date: '2024-04-08', defects: 2, stories: 2 },
  { date: '2024-04-09', defects: 1, stories: 1 },
  { date: '2024-04-10', defects: 0, stories: 0 },
  { date: '2024-04-11', defects: 0, stories: 0 },
  { date: '2024-04-12', defects: 4, stories: 4 },
  { date: '2024-04-13', defects: 2, stories: 2 },
  { date: '2024-04-14', defects: 3, stories: 1 },
  { date: '2024-04-15', defects: 2, stories: 1 },
  { date: '2024-04-16', defects: 3, stories: 2 },
  { date: '2024-04-17', defects: 6, stories: 2 },
  { date: '2024-04-18', defects: 3, stories: 0 },
  { date: '2024-04-19', defects: 4, stories: 1 },
  { date: '2024-04-20', defects: 2, stories: 0 },
  { date: '2024-04-21', defects: 3, stories: 2 },
  { date: '2024-04-22', defects: 5, stories: 1 },
  { date: '2024-04-23', defects: 3, stories: 0 },
  { date: '2024-04-24', defects: 2, stories: 0 },
  { date: '2024-04-25', defects: 4, stories: 3 },
  { date: '2024-04-26', defects: 1, stories: 2 },
  { date: '2024-04-27', defects: 3, stories: 1 },
  { date: '2024-04-28', defects: 2, stories: 2 },
  { date: '2024-04-29', defects: 5, stories: 0 },
  { date: '2024-04-30', defects: 3, stories: 0 }
];

const chartConfig = {
  views: {
    label: 'Page Views'
  },
  stories: {
    label: 'Stories',
    color: 'hsl(var(--chart-1))'
  },
  defects: {
    label: 'Defects',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('stories');

  const total = React.useMemo(
    () => ({
      stories: chartData.reduce((acc, curr) => acc + curr.stories, 0),
      defects: chartData.reduce((acc, curr) => acc + curr.defects, 0)
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Completed Tasks</CardTitle>
          <CardDescription>
            Showing total task done in the last 30 days
          </CardDescription>
        </div>
        <div className="flex">
          {['stories', 'defects'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
