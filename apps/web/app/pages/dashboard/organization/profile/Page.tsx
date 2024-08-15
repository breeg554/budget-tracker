import type { MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';

import { SecretForm } from '~/dashboard/organization/profile/components/SecretForm';
import { routes } from '~/routes';

import { OrganizationSelect } from './components/OrganizationSelect';
import { loader } from './loader.server';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { organization, organizations } = useLoaderData<typeof loader>();

  const onChange = (id: string) => {
    const org = organizations.find((org) => org.id === id);

    if (!org) return;

    navigate(routes.profile.getPath(org.name));
  };

  return (
    <div className="p-4">
      <p>Organization</p>
      <OrganizationSelect
        value={organization.id}
        onValueChange={onChange}
        options={organizations.map((org) => ({
          value: org.id,
          label: org.name,
        }))}
      />

      <p>Openai secret</p>

      <SecretForm />
    </div>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'Profile' }];
};
