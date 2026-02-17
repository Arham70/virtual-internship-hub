import { client } from './client';

export const studentApi = {
  getProfile: () => client.get('/students/profile/'),
  updateProfile: (data) => client.put('/students/profile/', data),
  getList: () => client.get('/students/'),
};
