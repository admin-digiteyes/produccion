import { ChartData, ChartOptions } from 'chart.js';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { AppService } from 'src/app/pages/app/services/app.service';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { IGetPlansResponse } from 'src/app/pages/app/interfaces/get-plans-response';
import { IUser } from 'src/app/shared/interfaces/user';
import { InfoLoginResponse } from 'src/app/pages/auth/interfaces/info-login-response';
import { PlanLoginResponse } from 'src/app/pages/auth/interfaces/plan-login-response';
import { UserRole } from 'src/app/shared/enums/user-role';

@Component({
    selector: 'tablero-entrar',
    templateUrl: './tablero-entrar.component.html',
    styleUrls: ['./tablero-entrar.component.css'],
})
export class TableroEntrarComponent implements OnInit {
    constructor(
        private _authService: AuthService,
        private _appService: AppService
    ) {}

    get dataInfo(): Observable<InfoLoginResponse> {
        return this._authService.listenDataInfo;
    }

    get planInfo(): Observable<PlanLoginResponse> {
        return this._authService.listenPlanInfo;
    }

    get userInfo(): Observable<IUser> {
        return this._authService.listenUserInfo;
    }

    get plans(): Observable<IGetPlansResponse[]> {
        return this._appService.listenPlans;
    }

    get userRole(): typeof UserRole {
        return UserRole;
    }

    dataChartDocuments: ChartData = {
        labels: ['Analizados', 'Disponibles'],
        datasets: [],
    };

    optionsChartDocuments: ChartOptions = {
        aspectRatio: 2,
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Páginas',
            },
        },
    };

    dataChartTemplates: ChartData = {
        labels: ['Usado', 'Disponible'],
        datasets: [],
    };

    optionsChartTemplates: ChartOptions = {
        aspectRatio: 2,
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Almacenamiento',
            },
        },
    };

    ngOnInit(): void {
        let listenPlans$: Subscription;

        listenPlans$ = this.plans.subscribe((plans) => {
            if (plans.length) {
                setTimeout(() => {
                    let listenPlanInfo$: Subscription;

                    listenPlanInfo$ = this.planInfo.subscribe((planInfo) => {
                        setTimeout(() => {
                            for (const plan of plans) {
                                if (plan.id == planInfo.plan) {
                                    this.dataChartDocuments.datasets = [];
                                    this.dataChartDocuments.datasets.push({
                                        label: 'Páginas',
                                        data: [
                                            planInfo.usedPages,
                                            plan.pages - planInfo.usedPages,
                                        ],
                                        backgroundColor: ['#63B3ED', '#3181CD'],
                                    });

                                    this.dataChartTemplates.datasets = [];
                                    this.dataChartTemplates.datasets.push({
                                        label: 'Almacenamiento',
                                        data: [
                                            planInfo.usedStorage,
                                            plan.storage - planInfo.usedStorage,
                                        ],
                                        backgroundColor: ['#4FD1C5', '#319795'],
                                    });

                                    listenPlanInfo$?.unsubscribe();
                                    break;
                                }
                            }
                        }, 100);
                    });

                    listenPlans$.unsubscribe();
                }, 100);
            }
        });
    }
}
