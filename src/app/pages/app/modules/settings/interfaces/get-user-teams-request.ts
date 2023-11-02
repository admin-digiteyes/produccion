import { IPaginator } from "src/app/shared/interfaces/paginator";

export interface IGetUserTeamsRequest {
    token: string;
    paginator: IPaginator;
}
