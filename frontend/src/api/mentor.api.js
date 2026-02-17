import { client } from './client';

export const mentorApi = {
  getProfile: () => client.get('/mentors/profile/'),
  updateProfile: (data) => client.put('/mentors/profile/', data),
  getList: () => client.get('/mentors/'),
};
