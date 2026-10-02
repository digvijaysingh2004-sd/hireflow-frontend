import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../api/jobsApi';
import { JobFilterParams } from '../types';

export const useJobsQuery = (params?: JobFilterParams) => {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobsApi.getJobs(params),
  });
};

export const useJobDetailQuery = (jobId?: string) => {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsApi.getJobById(jobId!),
    enabled: !!jobId,
  });
};
