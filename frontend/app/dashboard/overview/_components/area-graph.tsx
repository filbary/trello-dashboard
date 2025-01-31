'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import * as React from 'react';

const chartConfig = {
  frontend: {
    label: 'Frontend',
    color: 'hsl(var(--chart-1))'
  },
  backend: {
    label: 'Backend',
    color: 'hsl(var(--chart-2))'
  },
  devops: {
    label: 'DevOps',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig;

type AreaGraphProps = {
  chartData: {
    date: string;
    frontend: number;
    backend: number;
    devops: number;
  }[];
};

export function AreaGraph({ chartData }: AreaGraphProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Distribution Over Time</CardTitle>
        <CardDescription>Tracking tasks started by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 20,
              right: 20
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="frontend"
              type="monotone"
              fill="var(--color-frontend)"
              fillOpacity={0.4}
              stroke="var(--color-frontend)"
              stackId="a"
            />
            <Area
              dataKey="backend"
              type="monotone"
              fill="var(--color-backend)"
              fillOpacity={0.4}
              stroke="var(--color-backend)"
              stackId="a"
            />
            <Area
              dataKey="devops"
              type="monotone"
              fill="var(--color-devops)"
              fillOpacity={0.4}
              stroke="var(--color-devops)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
        <div className="text-sm leading-none text-muted-foreground">
          Showing the distribution of task types
        </div>
      </CardContent>
    </Card>
  );
}
