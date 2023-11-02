import { IJobResponse } from "./i-job-response";
import { ISumaryJob } from "./sumary-job";

export interface IJobsResponse {
    jobs: IJobResponse[];
    paginator: IPaginatorResponse;
    sumary: ISumaryJob;
}

interface IPaginatorResponse {
    /**
     * Totol number of items
     */
    length: number;

    pageIndex: 0;
}
