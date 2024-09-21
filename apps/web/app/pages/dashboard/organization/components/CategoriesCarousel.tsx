import React from 'react';
import startCase from 'lodash.startcase';

import { GetStatisticsByCategory } from '~/api/Statistics/statisticsApi.types';
import { PercentageChangeBadge } from '~/badges/PercentageChangeBadge';
import { Carousel, CarouselContent, CarouselItem } from '~/ui/carousel';
import { hashString } from '~/utils/stringHash';

import { CostPercentageChart } from './CostPercentageChart';

interface CategoriesCarouselProps {
  data: GetStatisticsByCategory[];
}

export const CategoriesCarousel = ({ data }: CategoriesCarouselProps) => {
  const totalCost = data.reduce((acc, item) => acc + item.total.value, 0);

  const getPercentage = (total: number) => {
    return totalCost > 0 ? (total / totalCost) * 100 : 0;
  };

  return (
    <Carousel>
      <CarouselContent className="-ml-4">
        {data.map((item) => (
          <CarouselItem key={item.id} className="pl-4 basis-[170px]">
            <CategoriesCarouselItem
              data={item}
              costPercentage={getPercentage(item.total.value)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

interface CategoriesCarouselItemProps {
  data: GetStatisticsByCategory;
  costPercentage: number;
}
function CategoriesCarouselItem({
  data,
  costPercentage,
}: CategoriesCarouselItemProps) {
  return (
    <article className="relative px-2 py-3 snap-center w-[160px] border border-input rounded-xl">
      <div className="text-base w-8 h-8 bg-muted rounded-lg flex justify-center items-center mb-3 shrink-0">
        {data.icon}
      </div>

      <div className="absolute top-1 right-1">
        <CostPercentageChart
          percentage={costPercentage}
          color={getColorForCategory(data.name, data.id)}
        />
      </div>
      <h4
        className="text-xs text-muted-foreground line-clamp-1"
        title={data.name}
      >
        {startCase(data.name)}
      </h4>

      <div className="flex gap-2 items-center">
        <p className="text-sm line-clamp-1">{data.total.formatted}</p>

        <PercentageChangeBadge value={data.percentageDifference} />
      </div>
    </article>
  );
}

function getColorForCategory(name: string, id: string) {
  const value = hashString(name + id);

  const hue = value % 360;
  return `hsl(${hue}, 80%, 50%)`;
}
