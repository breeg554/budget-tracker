import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { PageBackground } from '~/layout/PageBackground';
import { SectionWrapper } from '~/layout/SectionWrapper';

import { CategoriesPieChart } from './components/CategoriesPieChart';
import { loader } from './loader.server';

export const StatisticsPage = () => {
  const { statsByCategories } = useLoaderData<typeof loader>();

  return (
    <>
      <PageBackground />

      <SectionWrapper>
        <h1 className="text-primary-foreground text-sm text-center mt-4 mb-8">
          Statistics
        </h1>
      </SectionWrapper>

      <SectionWrapper>
        <CategoriesPieChart data={statsByCategories} />
      </SectionWrapper>
    </>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'Statistics' }];
};
