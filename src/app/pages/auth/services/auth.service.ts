import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { ILoginRequest } from '../interfaces/login-request';
import { ILoginResponse } from '../interfaces/login-response';
import { IRefreshTokenRequest } from '../interfaces/refresh-token-request';
import { IRefreshTokenResponse } from '../interfaces/refresh-token-response';
import { IUser } from 'src/app/shared/interfaces/user';
import { InfoLoginResponse } from '../interfaces/info-login-response';
import { Injectable } from '@angular/core';
import { PlanLoginResponse } from '../interfaces/plan-login-response';
import { UserRole } from 'src/app/shared/enums/user-role';
import { environment } from 'src/environments/environment';
import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly base_url: string;
    private dispatchLoginStatus: BehaviorSubject<boolean>;

    constructor(private _http: HttpClient) {
        this.base_url = environment.url_gateway;
        this.dispatchLoginStatus = new BehaviorSubject<boolean>(true);
        this.listenLoginStatus = this.dispatchLoginStatus.asObservable();

        this.userInfo = {
            id: -1,
            role: UserRole.User,
            name: 'Unauthorized',
            email: '',
        };
        this.userPlanInfo = {
            plan: -1,
            usedPages: -1,
            usedStorage: -1,
            users: -1
        };
        this.userDataInfo = {
            planActivated: false,
            templates: -1,
        };

        this.dispatchUserInfo = new BehaviorSubject<IUser>(this.userInfo);
        this.dispatchPlanInfo = new BehaviorSubject<PlanLoginResponse>(
            this.userPlanInfo
        );
        this.dispatchDataInfo = new BehaviorSubject<InfoLoginResponse>(
            this.userDataInfo
        );

        this.listenUserInfo = this.dispatchUserInfo.asObservable();
        this.listenPlanInfo = this.dispatchPlanInfo.asObservable();
        this.listenDataInfo = this.dispatchDataInfo.asObservable();

        this.getToken();
    }

    private userInfo: IUser;
    private userPlanInfo: PlanLoginResponse;
    private userDataInfo: InfoLoginResponse;

    private dispatchUserInfo: BehaviorSubject<IUser>;
    private dispatchPlanInfo: BehaviorSubject<PlanLoginResponse>;
    private dispatchDataInfo: BehaviorSubject<InfoLoginResponse>;

    private updateLoginStatus(status: boolean): void {
        this.dispatchLoginStatus.next(status);
    }

    listenUserInfo: Observable<IUser>;
    listenPlanInfo: Observable<PlanLoginResponse>;
    listenDataInfo: Observable<InfoLoginResponse>;
    listenLoginStatus: Observable<boolean>;

    updateUserInfo(userInfo: IUser): void {
        this.userInfo = userInfo;
        this.dispatchUserInfo.next(userInfo);
    }

    updatePlanInfo(planInfo: PlanLoginResponse): void {
        this.userPlanInfo = planInfo;
        this.dispatchPlanInfo.next(planInfo);
    }

    updateDataInfo(dataInfo: InfoLoginResponse): void {
        this.userDataInfo = dataInfo;
        this.dispatchDataInfo.next(dataInfo);
    }

    login(data: ILoginRequest): Observable<ILoginResponse> {
        return this._http.post<ILoginResponse>(
            `${this.base_url}/auth/login`,
            data
        );
    }

    getToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const token = localStorage.getItem('token');

            if (token) {
                const request: IRefreshTokenRequest = {
                    token,
                };

                this.refreshToken(request).subscribe({
                    next: (response) => {
                        const { refreshedToken } = response;

                        this.updateUserInfo(response.user);
                        this.updatePlanInfo(response.plan);
                        this.updateDataInfo(response.info);

                        this.setToken(refreshedToken);
                        resolve(refreshedToken);
                    },
                    error: (error) => {
                        this.logout();
                        reject('Error during authentication');
                    },
                });
            } else {
                this.updateLoginStatus(false);
                reject('User is not logged, skipping authentication');
            }
        });
    }

    refreshToken(
        data: IRefreshTokenRequest
    ): Observable<IRefreshTokenResponse> {
        return this._http.post<IRefreshTokenResponse>(
            `${this.base_url}/auth/refresh-token`,
            data
        );
    }

    setToken(token: string): void {
        localStorage.setItem('token', token);
        this.updateLoginStatus(true);
    }

    logout(): void {
        localStorage.removeItem('token');

        this.updateUserInfo({
            id: -1,
            role: UserRole.User,
            name: 'Unauthorized',
            email: '',
        });

        this.updatePlanInfo({
            plan: -1,
            usedPages: -1,
            usedStorage: -1,
            users: -1
        });

        this.updateDataInfo({
            planActivated: false,
            templates: -1,
        });

        this.updateLoginStatus(false);
    }
}
