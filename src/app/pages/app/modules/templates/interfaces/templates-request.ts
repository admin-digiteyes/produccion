export interface ITemplatesRequest {
    paginator: IPaginatorRequest;
    token: string;
}

interface IPaginatorRequest{
    pageIndex: number;
}
