import { useReducer } from 'react';
import isEqual from 'lodash.isequal';

import { DateRange } from '~/inputs/DateInput';
import { CustomDate } from '~/utils/CustomDate';

export type FiltersDrawerActions =
  | {
      type: 'TOGGLE_CATEGORY';
      payload: {
        id: string;
      };
    }
  | {
      type: 'TOGGLE_AUTHOR';
      payload: {
        id: string;
      };
    }
  | {
      type: 'SET_DATE';
      payload: {
        date: DateRange | undefined;
      };
    }
  | {
      type: 'CLEAR';
    };

export interface FiltersDrawerState {
  category: string[];
  author: string[];
  date: DateRange | undefined;
}

const DEFAULT_STATE: FiltersDrawerState = {
  category: [],
  author: [],
  date: undefined,
};

export function filtersDrawerReducer(
  state: FiltersDrawerState,
  action: FiltersDrawerActions,
) {
  const { type } = action;

  switch (type) {
    case 'TOGGLE_CATEGORY':
      return {
        ...state,
        category: state.category.includes(action.payload.id)
          ? state.category.filter((category) => category !== action.payload.id)
          : [...state.category, action.payload.id],
      };
    case 'TOGGLE_AUTHOR':
      return {
        ...state,
        author: state.author.includes(action.payload.id)
          ? state.author.filter((author) => author !== action.payload.id)
          : [...state.author, action.payload.id],
      };
    case 'SET_DATE':
      return {
        ...state,
        date: action.payload.date,
      };
    case 'CLEAR':
      return DEFAULT_STATE;
    default:
      return state;
  }
}

interface UseFiltersDrawerProps {
  category?: string[];
  author?: string[];
  startDate?: string;
  endDate?: string;
}

export const useFiltersDrawer = ({
  category,
  author,
  startDate,
  endDate,
}: UseFiltersDrawerProps) => {
  const paramsState = {
    category: category ?? [],
    author: author ?? [],
    date:
      startDate && endDate
        ? { from: new Date(startDate), to: new Date(endDate) }
        : undefined,
  };

  const [state, dispatch] = useReducer(filtersDrawerReducer, paramsState);

  const isAuthorChecked = (id: string) => state.author.includes(id);

  const isCategoryChecked = (id: string) => state.category.includes(id);

  const getFiltersCount = () => {
    return Object.entries(paramsState).reduce((acc, [key, value]) => {
      if (isEqual(value, DEFAULT_STATE[key as keyof FiltersDrawerState]))
        return acc;
      return acc + 1;
    }, 0);
  };

  return {
    dispatch,
    ...state,
    isAuthorChecked,
    isCategoryChecked,
    filtersCount: getFiltersCount(),
    startDate: state.date?.from
      ? new CustomDate(state.date.from).formatISO()
      : undefined,
    endDate: state.date?.to
      ? new CustomDate(state.date.to).formatISO()
      : undefined,
  };
};
