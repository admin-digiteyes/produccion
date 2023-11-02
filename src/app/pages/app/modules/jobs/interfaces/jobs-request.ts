export interface IJobsRequest {
    paginator: IPaginatorRequest;
    token: string;
}

interface IPaginatorRequest{
    pageIndex: number;
}
