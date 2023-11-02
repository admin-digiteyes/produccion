import { Component, OnInit } from '@angular/core';

import { AppService } from 'src/app/pages/app/services/app.service';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { HttpEventType } from '@angular/common/http';
import { ICreateJobsRequest } from '../../interfaces/create-jobs-request';
import { ITemplateResponse } from '../../../templates/interfaces/i-template-response';
import { IUser } from 'src/app/shared/interfaces/user';
import { JobAskDeleteFileComponent } from 'src/app/pages/app/modules/jobs/modals/ask-delete-file/job-ask-delete-file.component';
import { JobsService } from '../../services/jobs.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanLoginResponse } from 'src/app/pages/auth/interfaces/plan-login-response';
import { Router } from '@angular/router';
import { SelectTemplateListComponent } from '../../modals/select-template-list/select-template-list.component';
import { Subscription } from 'rxjs';
import { UserRole } from 'src/app/shared/enums/user-role';

@Component({
    selector: 'app-create-job',
    templateUrl: './create-job.component.html',
    styleUrls: ['./create-job.component.css'],
})
export class CreateJobComponent implements OnInit {
    constructor(
        private _jobsService: JobsService,
        private _snackBar: MatSnackBar,
        private _dialog: MatDialog,
        private _authService: AuthService,
        private _router: Router
    ) {
        this.progressCreatingTemplate = 0;
        this.isCreating = false;
        this.selectedFiles = [];
    }

    progressCreatingTemplate: number;
    isCreating: boolean;
    selectedFiles: File[];
    selectedTemplate!: ITemplateResponse;

    ngOnInit(): void {}

    selectTemplate(): void {
        const dialog = this._dialog.open(SelectTemplateListComponent, {
            width: 'auto',
            hasBackdrop: true,
            disableClose: true,
        });

        dialog.afterClosed().subscribe((template: ITemplateResponse | null) => {
            if (template) {
                this.selectedTemplate = template;
            }
        });
    }

    selectFile(event: any): void {
        const files: File[] = event.target.files;

        for (const file of files) {
            if (
                file.type == 'image/jpeg' ||
                file.type == 'image/png' ||
                file.type == 'image/jpg' ||
                file.type == 'application/pdf'
            ) {
                if (
                    !this.selectedFiles.filter((fileF) => fileF == file).length
                ) {
                    this.selectedFiles.push(file);
                }
            }
        }
    }

    async runAnalysis(): Promise<void> {
        if (this.isCreating) {
            return;
        }

        if (!this.selectedTemplate) {
            this._snackBar.open('Debe seleccionar una plantilla', undefined, {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: ['snackbar'],
            });
            return;
        }

        if (!this.selectedFiles.length) {
            this._snackBar.open(
                'Debe seleccionar al menos 1 archivo',
                undefined,
                {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 3000,
                    panelClass: ['snackbar'],
                }
            );
            return;
        }

        this.isCreating = true;
        this.progressCreatingTemplate = 0;

        const userInfo: IUser = await new Promise<IUser>(async (resolve) => {
            let getUserInfo: Subscription;

            const userInfoP: IUser =
                await new Promise<IUser>((resolve) => {
                    setTimeout(() => {
                        getUserInfo = this._authService.listenUserInfo.subscribe(
                            (userInfoS) => resolve(userInfoS)
                        );
                    }, 100);
                });

            getUserInfo!.unsubscribe();

            resolve(userInfoP);
        });

        const planInfo: PlanLoginResponse = await new Promise<PlanLoginResponse>(async (resolve) => {
            let getplanInfo: Subscription;

            const planInfoP: PlanLoginResponse =
                await new Promise<PlanLoginResponse>((resolve) => {
                    setTimeout(() => {
                        getplanInfo = this._authService.listenPlanInfo.subscribe(
                            (planInfoS) => resolve(planInfoS)
                        );
                    }, 100);
                });

                getplanInfo!.unsubscribe();

            resolve(planInfoP);
        });

        let userId = userInfo.id;

        if(userInfo.role == UserRole.User){
            userId = planInfo.admin!;
        }

        const request: ICreateJobsRequest = {
            file: this.selectedFiles,
            templateId: this.selectedTemplate.id,
            userId,
        };

        this._jobsService.createJobs(request).subscribe({
            next: (event) => {
                if (event.type === HttpEventType.UploadProgress) {
                    this.progressCreatingTemplate = Math.round(
                        (100 * event.loaded) / event.total
                    );
                }

                if (event.type === HttpEventType.Response) {
                    const snack = this._snackBar.open(
                        'Análisis iniciado correctamente',
                        undefined,
                        {
                            horizontalPosition: 'end',
                            verticalPosition: 'top',
                            duration: 300,
                            panelClass: ['snackbar'],
                        }
                    );

                    snack.afterDismissed().subscribe(() => {
                        this.isCreating = false;
                        this._router.navigateByUrl('/app/job/list');
                    });
                }
            },
            error: (error) => {
                console.log(error);
                this.isCreating = false;

                setTimeout(() => {
                    this.isCreating = false;
                }, 1000);

                this._snackBar.open(
                    'Hubo un problema durante el proceso del análisis',
                    'Cerrar',
                    {
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                        duration: 3000,
                        panelClass: ['snackbar'],
                    }
                );
            },
        });
    }

    removeFIle(file: File): void {
        const dialog = this._dialog.open(JobAskDeleteFileComponent, {
            width: '400px',
            hasBackdrop: true,
            disableClose: true,
        });

        dialog.afterClosed().subscribe((deleted) => {
            deleted
                ? (this.selectedFiles = this.selectedFiles.filter(
                      (fileF) => fileF != file
                  ))
                : false;
        });
    }
}
