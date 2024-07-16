import type { MetaFunction } from '@remix-run/node';

export const ProfilePage = () => {
  return <p>Profile</p>;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Profile' }];
};
