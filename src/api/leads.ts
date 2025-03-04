import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import axios, { endpoints, fetcher } from '../utils/axios';
import { ILead } from '../types/types';

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export const useGetLeads = () => {
  const URL = [endpoints.leads];

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(
    () => ({
      leads: (data as ILead[]) || [],
      leadsLoading: isLoading,
      leadsError: error,
      leadsValidating: isValidating,
      mutateLeads: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );
  console.log('memoizedValue: ', memoizedValue);
  return memoizedValue;
};

export const postLead = async (formData: Omit<ILead, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
  const URL = endpoints.leads;

  const response = await axios.post(URL, formData);

  mutate(URL, (currentData: ILead[] | undefined) => {
    if (!currentData) return [response.data];
    return [...currentData, response.data];
  });

  return response.data;
};

export const deleteLead = async (id: string) => {
  const URL = endpoints.leads;
  const response = await axios.delete(URL, { data: { id } });
  return response.data;
};
