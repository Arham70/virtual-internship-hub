import { client } from './client';

export async function getDomains() {
  const { data } = await client.get('/domains/');
  return Array.isArray(data) ? data : (data?.results ?? []);
}

export const domainsApi = { getDomains };
