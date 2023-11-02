import { IJobResponse } from './i-job-response';

export interface IUpdateJobsRequest {
    job: IJobResponse;
    token: string;
}
