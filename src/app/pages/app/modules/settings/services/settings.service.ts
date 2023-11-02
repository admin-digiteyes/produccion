import { HttpClient } from '@angular/common/http';
import { ICreateUserTeamsRequest } from '../interfaces/create-user-teams-request';
import { IGetUserTeamsRequest } from '../interfaces/get-user-teams-request';
import { IGetUserTeamsResponse } from '../interfaces/get-user-teams-response';
import { IRemoveUserTeamRequest } from '../interfaces/remove-user-team.model';
import { IUpdateUserPersonalInformationRequest } from '../interfaces/update-user-personal-information-request';
import { IUpdateUserPersonalInformationResponse } from '../interfaces/update-user-personal-information-response';
import { IUpdateUserSecurityRequest } from '../interfaces/update-user-security-request';
import { IUpdateUserSecurityResponse } from '../interfaces/update-user-security-response';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    constructor(private _http: HttpClient) {}

    private readonly base_url: string = environment.url_gateway;

    getUsers(request: IGetUserTeamsRequest): Observable<IGetUserTeamsResponse> {
        return this._http.post<IGetUserTeamsResponse>(
            `${this.base_url}/user-teams/get`,
            request
        );
    }

    createUser(
        request: ICreateUserTeamsRequest
    ): Observable<ICreateUserTeamsRequest> {
        return this._http.post<ICreateUserTeamsRequest>(
            `${this.base_url}/user-teams`,
            request
        );
    }

    removeUser(
        request: IRemoveUserTeamRequest
    ): Observable<IRemoveUserTeamRequest> {
        return this._http.post<IRemoveUserTeamRequest>(
            `${this.base_url}/user-teams/delete`,
            request
        );
    }

    updateUserPersonalInformation(
        data: IUpdateUserPersonalInformationRequest
    ): Observable<IUpdateUserPersonalInformationResponse> {
        return this._http.post<IUpdateUserPersonalInformationResponse>(
            `${this.base_url}/users/update-personal-information`,
            data
        );
    }

    updateUserSecurity(
        data: IUpdateUserSecurityRequest
    ): Observable<IUpdateUserSecurityResponse> {
        return this._http.post<IUpdateUserSecurityResponse>(
            `${this.base_url}/users/update-security`,
            data
        );
    }
}
