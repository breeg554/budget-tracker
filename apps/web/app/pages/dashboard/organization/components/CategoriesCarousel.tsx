import React from 'react';
import startCase from 'lodash.startcase';

import { GetStatisticsByCategory } from '~/api/Statistics/statisticsApi.types';
import { ItemList } from '~/list/ItemList';
import { MonetaryValue } from '~/utils/MonetaryValue';
import { TransactionItemCategory } from '~/utils/TransactionItemCategory';

interface CategoriesCarouselProps {
  data: GetStatisticsByCategory[];
}

export const CategoriesCarousel = ({ data }: CategoriesCarouselProps) => {
  return (
    <ItemList
      itemClassName="pr-4"
      className="flex items-center overflow-x-auto snap-x"
      items={data}
      renderItem={(item) => <CategoriesCarouselItem data={item} />}
    />
  );
};

interface CategoriesCarouselItemProps {
  data: GetStatisticsByCategory;
}
function CategoriesCarouselItem({ data }: CategoriesCarouselItemProps) {
  const itemCategory = new TransactionItemCategory(data);
  return (
    <article className="px-2 py-3 snap-center w-full min-w-[100px] max-w-[150px] border border-input rounded-xl">
      <div className="text-lg w-8 h-8 bg-muted rounded-lg flex justify-center items-center mb-4">
        {itemCategory.icon}
      </div>

      <h4
        className="text-xs text-muted-foreground line-clamp-1"
        title={itemCategory.name}
      >
        {startCase(itemCategory.name)}
      </h4>

      <p className="text-sm line-clamp-1">
        {new MonetaryValue(data.total).format()}
        <span className="text-[8px]">PLN</span>
      </p>
    </article>
  );
}
