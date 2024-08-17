import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { GetTransactionDto } from '~/api/Transaction/transactionApi.types';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart';
import { CustomDate } from '~/utils/CustomDate';
import { MonetaryValue } from '~/utils/MonetaryValue';

const chartConfig = {
  day: {
    label: 'day',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

interface TransactionChartProps {
  data: GetTransactionDto[];
  startDate: string;
  endDate: string;
}

export function TransactionChart({
  data,
  startDate,
  endDate,
}: TransactionChartProps) {
  const dayDifference = useMemo(() => {
    return Math.abs(new CustomDate(startDate).differenceInDays(endDate));
  }, [startDate, endDate]);

  const transactionsByDay = useMemo(
    () =>
      data.reduce(
        (acc, transaction) => {
          const day = new CustomDate(transaction.date).format(
            getFormatForDifference(dayDifference),
          );
          if (acc[day] === undefined) {
            return { ...acc, [day]: transaction.price };
          }

          return { ...acc, [day]: acc[day] + transaction.price };
        },
        getDefaultsForFormat(startDate, endDate),
      ),
    [data, dayDifference, startDate, endDate],
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
    <ChartContainer config={chartConfig} className="h-[150px] w-full">
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
            if (typeof window === 'undefined') return '';
            return value;
          }}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillDay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-day)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-day)" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <Area
          dataKey="total"
          type="natural"
          fill="url(#fillDay)"
          fillOpacity={0.4}
          stroke="var(--color-day)"
        />
      </AreaChart>
    </ChartContainer>
  );
}

function getDefaultsForFormat(startDate: string, endDate: string) {
  const difference = Math.abs(
    new CustomDate(startDate).differenceInDays(endDate),
  );
  const format = getFormatForDifference(difference);

  const interval =
    difference <= 1
      ? new CustomDate(startDate).eachHourOfInterval(endDate)
      : new CustomDate(startDate).eachDayOfInterval(endDate);

  return interval.reduce(
    (acc, date) => {
      const day = new CustomDate(date).format(format);
      if (acc[day] === undefined) {
        return { ...acc, [day]: 0 };
      }

      return acc;
    },
    {} as Record<string, number>,
  );
}

function getFormatForDifference(dayDifference: number) {
  if (dayDifference <= 1) return 'HH:mm';
  if (dayDifference <= 7) return 'EEEE';
  return 'dd MMM';
}
