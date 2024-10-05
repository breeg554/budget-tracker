import React, { ReactNode, useMemo } from 'react';
import kebabCase from 'lodash.kebabcase';
import startCase from 'lodash.startcase';
import { Pie, PieChart } from 'recharts';

import { GetStatisticsByCategory } from '~/api/Statistics/statisticsApi.types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart';
import { cn } from '~/utils/cn';

interface CategoriesPieChartProps {
  data: GetStatisticsByCategory[];
}

export const CategoriesPieChart = ({ data }: CategoriesPieChartProps) => {
  const sortedData = useMemo(() => {
    return data
      .slice()
      .sort((a, b) => b.total.value - a.total.value)
      .splice(0, 4)
      .map((item, index) => ({
        ...item,
        value: item.total.value,
        category: kebabCase(item.name),
        label: startCase(item.name),
        fill: `var(--color-${kebabCase(item.name)})`,
      }));
  }, [data]);

  const chartConfig: Record<string, { label: string; color: string }> =
    useMemo(() => {
      return sortedData.reduce((acc, item, currentIndex) => {
        return {
          ...acc,
          [item.category]: {
            label: item.label,
            color: `hsl(var(--chart-${currentIndex + 1}))`,
          },
        };
      }, {});
    }, [sortedData]);

  return (
    <div className="grid gap-2 grid-cols-[min-content_1fr] items-center">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-[240px] h-[240px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={sortedData}
            dataKey="value"
            nameKey="label"
            innerRadius={50}
          />
        </PieChart>
      </ChartContainer>

      <div className="flex flex-col gap-2">
        {sortedData.map((item, index) => (
          <PieChartLabel
            key={item.name}
            label={item.label}
            total={item.total.formatted}
            color={`hsl(var(--chart-${index + 1}))`}
          />
        ))}
      </div>
    </div>
  );
};

interface PieChartLabelProps {
  total: string;
  label: ReactNode;
  color: string;
}

function PieChartLabel({ total, label, color }: PieChartLabelProps) {
  return (
    <div className="flex gap-1">
      <div
        className={cn('w-2 h-4 rounded-full mt-0.5')}
        style={{
          backgroundColor: color,
        }}
      />
      <div className="flex flex-col">
        <p className="text-sm line-clamp-1">{label}</p>

        <p className="text-xs text-muted-foreground line-clamp-1">{total}</p>
      </div>
    </div>
  );
}
