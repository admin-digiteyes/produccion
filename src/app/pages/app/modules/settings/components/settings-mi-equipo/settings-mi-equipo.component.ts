import { Component, OnInit } from '@angular/core';

import { AppSocketService } from 'src/app/pages/app/services/app-socket.service';
import { AskDeleteJobComponent } from '../../../jobs/modals/ask-delete-job/ask-delete-job.component';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { CreateUserTeamComponent } from '../../modals/create-user-team/create-user-team.component';
import { IGetUserTeamsRequest } from '../../interfaces/get-user-teams-request';
import { IRemoveUserTeamRequest } from '../../interfaces/remove-user-team.model';
import { IUserResponse } from '../../interfaces/user-response';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { SettingsAskDeleteUserTeamComponent } from '../../modals/ask-delete-user-team/settings-ask-delete-user-team.component';
import { SettingsService } from '../../services/settings.service';

@Component({
    selector: 'app-settings-mi-equipo',
    templateUrl: './settings-mi-equipo.component.html',
    styleUrls: ['./settings-mi-equipo.component.css'],
})
export class SettingsMiEquipoComponent implements OnInit {
    constructor(
        private _settingsService: SettingsService,
        private _authService: AuthService,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _appSocketService: AppSocketService
    ) {
        this.users = [];
        this.isPaginating = true;

        this.usersPaginator = new PageEvent();
        this.usersPaginator.pageSize = 3;
        this.usersPaginator.length = 0;
    }

    users: IUserResponse[];
    usersPaginator: PageEvent;
    isPaginating: boolean;

    async ngOnInit(): Promise<void> {
        const token: string = await this._authService.getToken();
        const pageIndex = this.usersPaginator.pageIndex - 1;

        const request: IGetUserTeamsRequest = {
            paginator: {
                pageIndex: pageIndex | 0,
                length: 0,
            },
            token,
        };

        this._settingsService.getUsers(request).subscribe({
            next: (response) => {
                this.isPaginating = false;
                this.users = response.users;
                this.usersPaginator.length = response.paginator.length;
            },
            error: (error) => {
                this.isPaginating = false;
                console.log(error);
            },
        });
    }

    ngOnDestroy(): void {}

    async paginate(event?: PageEvent): Promise<void> {
        if (this.isPaginating) {
            return;
        }

        this.isPaginating = true;

        const { pageIndex } = event || this.usersPaginator;
        const token: string = await this._authService.getToken();
        const request: IGetUserTeamsRequest = {
            paginator: {
                pageIndex: pageIndex | 0,
                length: 0,
            },
            token,
        };

        this._settingsService.getUsers(request).subscribe({
            next: (response) => {
                this.isPaginating = false;
                this.users = response.users;
                this.usersPaginator.length = response.paginator.length;
            },
            error: (error) => {
                this.isPaginating = false;
                console.log(error);
            },
        });
    }

    addUserTeam(): void {
        const dialog = this.dialog.open(CreateUserTeamComponent, {
            hasBackdrop: true,
            disableClose: true,
        });

        dialog.afterClosed().subscribe((result) => {
            if (result) {
                this.paginate();
                this._snackBar.open('Usuario creado correctamente', undefined, {
                    horizontalPosition: 'end',
                    verticalPosition: 'top',
                    duration: 3000,
                    panelClass: ['snackbar'],
                });
            }
        });
    }

    async removeUserTeam(user: IUserResponse): Promise<void> {
        if (this.isPaginating) {
            return;
        }

        const dialog = this.dialog.open(SettingsAskDeleteUserTeamComponent, {
            hasBackdrop: true,
            disableClose: true,
        });

        dialog.afterClosed().subscribe(async (result) => {
            if (result) {
                this.isPaginating = true;
                
                const token: string = await this._authService.getToken();

                const request: IRemoveUserTeamRequest = {
                    id: user.id,
                    token,
                };

                this._settingsService.removeUser(request).subscribe({
                    next: (response) => {
                        this.isPaginating = false;

                        this._snackBar.open(
                            'Usuario borrado correctamente',
                            undefined,
                            {
                                horizontalPosition: 'end',
                                verticalPosition: 'top',
                                duration: 3000,
                                panelClass: ['snackbar'],
                            }
                        );

                        this.paginate();
                    },
                    error: (error) => {
                        this.isPaginating = false;

                        if (error.error?.message instanceof Array) {
                            error.error.message.forEach((message: string) => {
                                this._snackBar.open(
                                    message,
                                    'Cerrar',
                                    {
                                        horizontalPosition: 'end',
                                        verticalPosition: 'top',
                                        duration: 3000,
                                        panelClass: ['snackbar'],
                                    }
                                );
                            });
                        } else {
                            if (error.error?.message) {
                                this._snackBar.open(
                                    error.error.message,
                                    'Cerrar',
                                    {
                                        horizontalPosition: 'end',
                                        verticalPosition: 'top',
                                        duration: 3000,
                                        panelClass: ['snackbar'],
                                    }
                                );
                            } else {
                                this._snackBar.open(
                                    'Verifique su conexión a internet',
                                    'Cerrar',
                                    {
                                        horizontalPosition: 'end',
                                        verticalPosition: 'top',
                                        duration: 3000,
                                        panelClass: ['snackbar'],
                                    }
                                );
                            }
                        }
                    },
                });
            }
        });
    }

    // deleteJob(job: IJobResponse): void {
    //     const dialog = this.dialog.open(AskDeleteJobComponent, {
    //         width: '400px',
    //         hasBackdrop: true,
    //         disableClose: true,
    //         data: { job },
    //     });

    //     dialog.afterClosed().subscribe((result) => {
    //         if (result) {
    //             this.paginate();
    //             this._snackBar.open(
    //                 'Análisis eliminado correctamente',
    //                 undefined,
    //                 {
    //                     horizontalPosition: 'end',
    //                     verticalPosition: 'top',
    //                     duration: 3000,
    //                     panelClass: ['snackbar'],
    //                 }
    //             );
    //         }
    //     });
    // }
}
