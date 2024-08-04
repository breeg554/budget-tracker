import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { GetTransactionDto } from '~/api/Transaction/transactionApi.types';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart';
import { CustomDate } from '~/utils/CustomDate';
import { MonetaryValue } from '~/utils/MonetaryValue';

const days = {
  Monday: 0,
  Tuesday: 0,
  Wednesday: 0,
  Thursday: 0,
  Friday: 0,
  Saturday: 0,
  Sunday: 0,
};

const chartConfig = {
  day: {
    label: 'day',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

interface WeeklyTransactionChartProps {
  data: GetTransactionDto[];
}

export function WeeklyTransactionChart({ data }: WeeklyTransactionChartProps) {
  const transactionsByDay = useMemo(
    () =>
      data.reduce(
        (acc, transaction) => {
          const day = new CustomDate(transaction.date).format('EEEE');
          if (acc[day] === undefined) return acc;

          return { ...acc, [day]: acc[day] + transaction.price };
        },
        {
          Monday: 0,
          Tuesday: 0,
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0,
          Sunday: 0,
        } as Record<string, number>,
      ),
    [data],
  );

  const chartData = useMemo(
    () =>
      Object.entries(transactionsByDay).map(([day, total]) => ({
        day,
        total: new MonetaryValue(total).format(),
      })),
    [transactionsByDay],
  );

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar barSize={10} dataKey="total" fill="var(--color-day)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
