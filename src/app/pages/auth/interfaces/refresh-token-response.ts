import { IUser } from 'src/app/shared/interfaces/user';
import { InfoLoginResponse } from './info-login-response';
import { PlanLoginResponse } from './plan-login-response';

export interface IRefreshTokenResponse {
    refreshedToken: string;
    user: IUser;
    plan:  PlanLoginResponse;
    info: InfoLoginResponse;
}
