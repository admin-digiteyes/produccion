import { IPaginator } from "src/app/shared/interfaces/paginator";
import { IUserResponse } from "./user-response";

export interface IGetUserTeamsResponse {
    users: IUserResponse[];
    paginator: IPaginator;
}
