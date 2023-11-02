import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { IGetPlansRequest } from '../interfaces/get-plans-request';
import { IGetPlansResponse } from '../interfaces/get-plans-response';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AppService {
    constructor(private _http: HttpClient) {
        this.base_url = environment.url_gateway;

        this.plans = [];

        this.dispatchPlans = new BehaviorSubject<IGetPlansResponse[]>(
            this.plans
        );
        this.listenPlans = this.dispatchPlans.asObservable();
    }

    private plans: IGetPlansResponse[];
    private dispatchPlans: BehaviorSubject<IGetPlansResponse[]>;

    listenPlans: Observable<IGetPlansResponse[]>;

    updatePlans(plans: IGetPlansResponse[]): void {
        this.plans = plans;
        this.dispatchPlans.next(this.plans);
    }

    base_url: string;

    getPlans(request: IGetPlansRequest): Observable<IGetPlansResponse[]> {
        return this._http.post<IGetPlansResponse[]>(
            `${this.base_url}/plan`,
            request
        );
    }
}
