import React from 'react';

import { GetTransactionItemDto } from '~/api/Transaction/transactionApi.types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/ui/tooltip';
import { Category } from '~/utils/Category';

interface CategoryCircleProps {
  data: GetTransactionItemDto['category'];
}
export function CategoryCircle({ data }: CategoryCircleProps) {
  const categoryItem = new Category(data);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <p
            className="w-6 h-6 rounded-full border border-input text-xs flex justify-center items-center bg-white"
            aria-label={categoryItem.name}
          >
            {categoryItem.icon}
          </p>
        </TooltipTrigger>
        <TooltipContent>{categoryItem.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
