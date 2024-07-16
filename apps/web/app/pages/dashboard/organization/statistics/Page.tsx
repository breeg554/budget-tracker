import type { MetaFunction } from '@remix-run/node';

export const StatisticsPage = () => {
  return <p>Statistics</p>;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Statistics' }];
};
