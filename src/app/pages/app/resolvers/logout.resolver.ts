import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from '../../auth/services/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LogoutResolver implements Resolve<any> {
    constructor(private _router: Router, private _authService: AuthService) {}

    async resolve() {
        this._authService.logout();
        await this._router.navigateByUrl('/auth/login');
    }
}
