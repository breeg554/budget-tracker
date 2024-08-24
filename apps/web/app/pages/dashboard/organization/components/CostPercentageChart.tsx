'use client';

import { useMemo } from 'react';
import { Pie, PieChart, PolarGrid } from 'recharts';

import { ChartContainer } from '~/components/ui/chart';

interface CostPercentageChartProps {
  percentage: number;
  color?: string;
}

export function CostPercentageChart({
  percentage,
  color,
}: CostPercentageChartProps) {
  const chartData = useMemo(() => {
    return [
      {
        name: 'percentage',
        value: percentage,
        fill: color ?? 'var(--color-primary)',
      },

      {
        name: 'rest',
        value: 100 - percentage,
        fill: 'transparent',
      },
    ];
  }, [percentage]);
  return (
    <ChartContainer config={{}} className="aspect-square w-8 h-8">
      <PieChart>
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[9, 6]}
        />
        <Pie
          data={chartData}
          dataKey="value"
          innerRadius={6}
          startAngle={0}
          endAngle={360}
          minAngle={15}
        />
      </PieChart>
    </ChartContainer>
  );
}
