import React from 'react';
import kebabCase from 'lodash.kebabcase';
import startCase from 'lodash.startcase';
import { Pie, PieChart, Sector } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

import { GetStatisticsByCategory } from '~/api/Statistics/statisticsApi.types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart';

interface CategoriesPieChartProps {
  data: GetStatisticsByCategory[];
}

export const CategoriesPieChart = ({ data }: CategoriesPieChartProps) => {
  const sortedData = data
    .slice()
    .sort((a, b) => b.total - a.total)
    .splice(0, 5)
    .map((item, index) => ({
      ...item,
      category: kebabCase(item.name),
      label: startCase(item.name),
      fill: `var(--color-${kebabCase(item.name)})`,
    }));

  const chartConfig: Record<string, { label: string; color: string }> =
    sortedData.reduce((acc, item, currentIndex) => {
      return {
        ...acc,
        [item.category]: {
          label: item.label,
          color: `hsl(var(--chart-${currentIndex + 1}))`,
        },
      };
    }, {});

  return (
    <ChartContainer config={chartConfig} className="mx-auto w-full h-[250px]">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          label={({ payload, ...props }) => {
            return (
              <text
                cx={props.cx}
                cy={props.cy}
                x={props.x}
                y={props.y}
                textAnchor={props.textAnchor}
                dominantBaseline={props.dominantBaseline}
                fill="hsla(var(--primary-foreground))"
              >
                {
                  chartConfig[payload.category as keyof typeof chartConfig]
                    ?.label
                }
              </text>
            );
          }}
          data={sortedData}
          dataKey="total"
          nameKey="category"
          innerRadius={60}
          labelLine={false}
          activeIndex={0}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} />
          )}
        />
      </PieChart>
    </ChartContainer>
  );
};
