import {
    ActivatedRouteSnapshot,
    CanActivate,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { InfoLoginResponse } from 'src/app/pages/auth/interfaces/info-login-response';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ValidationPlanGuard implements CanActivate {
    constructor(private _authService: AuthService) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return new Promise<boolean>(async (resolve, reject) => {
            const dataInfo: InfoLoginResponse = await new Promise<InfoLoginResponse>(async (resolveG) => {
                let getdataInfo: Subscription;

                const dataInfoP: InfoLoginResponse = await new Promise<InfoLoginResponse>((resolve) => {
                    setTimeout(() => {
                        getdataInfo = this._authService.listenDataInfo.subscribe(
                            (dataInfoS) => resolve(dataInfoS)
                        );
                    }, 100);
                });

                getdataInfo!.unsubscribe();

                resolveG(dataInfoP);
            });

            resolve(dataInfo.planActivated);
        });
    }
}
