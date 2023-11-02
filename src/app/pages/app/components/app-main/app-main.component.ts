import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { AppService } from '../../services/app.service';
import { AppSocketService } from '../../services/app-socket.service';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { IAuthenticationWsRequest } from '../../interfaces/authentication-ws-request';
import { IDrawerMenu } from '../../../../shared/interfaces/drawer-menu';
import { IGetPlansRequest } from '../../interfaces/get-plans-request';
import { IUser } from 'src/app/shared/interfaces/user';
import { InfoLoginResponse } from 'src/app/pages/auth/interfaces/info-login-response';
import { MatDrawer } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/shared/enums/user-role';

@Component({
    selector: 'app-app-main',
    templateUrl: './app-main.component.html',
    styleUrls: ['./app-main.component.css'],
})
export class AppMainComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(
        private _router: Router,
        private _breakpointObserver: BreakpointObserver,
        private _authService: AuthService,
        private _appSocketService: AppSocketService,
        private _appService: AppService,
        private _notificationService: NotifierService
    ) {
        this.drawerMenus = [];
        this.menuActive = 2;
        this.destroyedBreakPoint = new Subject<void>();
        this.addMenus();
    }

    private addMenus(): void {
        this.drawerMenus.push({
            id: 1,
            title: 'Tablero',
            subtitle: 'Estadísticas de uso',
            options: [
                {
                    id: 1,
                    icon: 'table_chart',
                    title: 'Seguimiento',
                    route: 'board/main',
                },
            ],
        });

        this.drawerMenus.push({
            id: 2,
            title: 'Mis plantillas',
            subtitle: 'Administración',
            options: [
                {
                    id: 2,
                    icon: 'add',
                    title: 'Crear',
                    route: 'template/create',
                },
                {
                    id: 3,
                    icon: 'toc',
                    title: 'Listar',
                    route: 'template/list',
                },
            ],
        });

        this.drawerMenus.push({
            id: 3,
            title: 'Archivos',
            subtitle: 'Administración',
            options: [
                {
                    id: 4,
                    icon: 'ojo_logo_fosforescente.ico',
                    img: true,
                    title: 'Analizar',
                    route: 'job/analyze',
                },
                {
                    id: 5,
                    icon: 'toc',
                    title: 'Listar',
                    route: 'job/list',
                },
                {
                    id: 6,
                    icon: 'ojo_logo_fosforescente.ico',
                    img: true,
                    title: 'ChatPDF',
                    route: 'job/analyze',
                },
            ],
        });

        this.drawerMenus.push({
            id: 4,
            title: 'Configuración',
            subtitle: 'Administración',
            options: [
                {
                    id: 7,
                    icon: 'account_box',
                    title: 'Perfil',
                    route: 'settings/profile',
                },
                {
                    id: 8,
                    icon: 'diversity_3',
                    title: 'Mi equipo',
                    route: 'settings/mi-equipo',
                },

                {
                    id: 9,
                    icon: 'notifications',
                    title: 'Notificaciones',
                    route: 'settings/notifications',
                },
                {
                    id: 10,
                    icon: 'price',
                    title: 'Planes y precios',
                    route: 'settings/notifications',
                },
                {
                    id: 11,
                    icon: 'logout',
                    title: 'Cerrar sesión',
                    route: 'logout',
                },
                
            ],
        });
    }

    get userInfo(): Observable<IUser> {
        return this._authService.listenUserInfo;
    }

    get dataInfo(): Observable<InfoLoginResponse> {
        return this._authService.listenDataInfo;
    }

    get userRole(): typeof UserRole {
        return UserRole;
    }

    @ViewChild('drawerMenu') drawerMenu!: MatDrawer;

    menuActive: number;
    drawerMenus: IDrawerMenu[];
    destroyedBreakPoint: Subject<void>;

    listenConnectionWs!: Subscription;

    async ngOnInit(): Promise<void> {
        this.listenConnectionWs =
            this._appSocketService.listenConnectionWs.subscribe(async () => {
                const token = await this._authService.getToken();
                const request: IAuthenticationWsRequest = {
                    token,
                };

                this._appSocketService.authenticate(request);
            });

        await this._appSocketService.connect().catch((error) => {});

        // Prevent innecesary redirection when is load first time
        if (this._router.url == '/app') {
            await this._router.navigateByUrl('/app/board/main');
        }

        const token = await this._authService.getToken();

        const request: IGetPlansRequest = {
            token,
        };

        this._appService.getPlans(request).subscribe({
            next: (response) => {
                this._appService.updatePlans(response);
            },
            error: (error) => {
                if (error.error?.message instanceof Array) {
                    error.error.message.forEach((message: string) => {
                        this._notificationService.notify('error', message);
                    });
                } else {
                    if (error.error?.message) {
                        this._notificationService.notify(
                            'error',
                            error.error.message
                        );
                    } else {
                        this._notificationService.notify(
                            'error',
                            'Verifique su conexión a internet'
                        );
                    }
                }
            },
        });
    }

    ngAfterViewInit(): void {
        const displayNameMap = new Map([
            [Breakpoints.XSmall, 'XSmall'],
            [Breakpoints.Small, 'Small'],
            [Breakpoints.Medium, 'Medium'],
            [Breakpoints.Large, 'Large'],
        ]);

        this._breakpointObserver
            .observe([
                Breakpoints.XSmall,
                Breakpoints.Small,
                Breakpoints.Medium,
                Breakpoints.Large,
                Breakpoints.XLarge,
            ])
            .pipe(takeUntil(this.destroyedBreakPoint))
            .pipe(debounceTime(400))
            .subscribe((result) => {
                for (const query of Object.keys(result.breakpoints)) {
                    if (result.breakpoints[query]) {
                        const res = displayNameMap.get(query);

                        if (res == 'XSmall') {
                            this.drawerMenu.mode = 'over';
                            this.drawerMenu.toggle(false);
                        }

                        if (res == 'Small') {
                            this.drawerMenu.mode = 'over';
                            this.drawerMenu.toggle(false);
                        }

                        if (res == 'Medium') {
                            // over / false
                            this.drawerMenu.mode = 'side';
                            this.drawerMenu.toggle(true);
                        }

                        if (res == 'Large') {
                            this.drawerMenu.mode = 'side';
                            this.drawerMenu.toggle(true);
                        }

                        if (res == 'XLarge') {
                            this.drawerMenu.mode = 'side';
                            this.drawerMenu.toggle(true);
                        }
                    }
                }
            });
    }

    async ngOnDestroy(): Promise<void> {
        if (this.listenConnectionWs) {
            this.listenConnectionWs.unsubscribe();
        }

        await this._appSocketService.disconnect();
    }
}
