import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { HttpEventType } from '@angular/common/http';
import { ICreateTemplateRequest } from '../../interfaces/create-templates-request';
import { IUser } from 'src/app/shared/interfaces/user';
import { IVerifyTemplateRequest } from '../../interfaces/verify-template.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanLoginResponse } from 'src/app/pages/auth/interfaces/plan-login-response';
import { Subscription } from 'rxjs';
import { TemplatesService } from '../../services/templates.service';
import { UserRole } from 'src/app/shared/enums/user-role';

@Component({
    selector: 'app-create-template',
    templateUrl: './create-template.component.html',
    styleUrls: ['./create-template.component.css'],
})
export class CreateTemplateComponent implements OnInit {
    constructor(
        private _fb: FormBuilder,
        private _authService: AuthService,
        private _templatesService: TemplatesService,
        private _snackBar: MatSnackBar
    ) {
        this.formCreateTemplate = this._fb.group({
            name: ['', Validators.required],
            type: ['', Validators.required],
            file: [null, Validators.required],
        });

        this.progressCreatingTemplate = 0;
        this.selectedFilename = '';
        this.isCreating = false;
    }

    progressCreatingTemplate: number;
    formCreateTemplate: FormGroup;
    selectedFilename: string;
    isCreating: boolean;
    selectedFile!: File;

    ngOnInit(): void {}

    selectFile(event: any): void {
        const filesSize = event.target.files.length;

        if (!filesSize) {
            this.selectedFilename = 'Debe seleccionar un archivo';
            return;
        }

        const typeFile =
            event.target.files.length == 1 ? event.target.files[0].type : null;
        const fileName = event.target.files[0].name;

        this.selectedFilename = fileName;

        if (
            typeFile == 'image/jpeg' ||
            typeFile == 'image/png' ||
            typeFile == 'image/jpg' ||
            typeFile == 'application/pdf'
        ) {
            this.selectedFile = event.target.files[0];
            return;
        }

        this.selectedFilename = 'Debe seleccionar un archivo';
    }

    async createTemplate(): Promise<void> {
        if (this.formCreateTemplate.invalid) {
            this.formCreateTemplate.markAllAsTouched();

            if (this.selectedFilename == '') {
                this.selectedFilename = 'Debe seleccionar un archivo';
            }
            return;
        }

        if (this.isCreating) {
            return;
        }

        if (
            this.selectedFilename == 'Debe seleccionar un archivo' ||
            this.selectedFilename == ''
        ) {
            return;
        }

        this.isCreating = true;
        this.progressCreatingTemplate = 0;

        const token = await this._authService.getToken();

        const requestVerify: IVerifyTemplateRequest = {
            template: this.formCreateTemplate.value.name,
            token
        }

        this._templatesService
            .verifyTemplate(requestVerify)
            .subscribe({
                next: async (response) => {
                    const userInfo: IUser = await new Promise<IUser>(
                        async (resolve) => {
                            let getUserInfo: Subscription;

                            const userInfoP: IUser = await new Promise<IUser>(
                                (resolve) => {
                                    setTimeout(() => {
                                        getUserInfo =
                                            this._authService.listenUserInfo.subscribe(
                                                (userInfoS) =>
                                                    resolve(userInfoS)
                                            );
                                    }, 100);
                                }
                            );

                            getUserInfo!.unsubscribe();

                            resolve(userInfoP);
                        }
                    );

                    const planInfo: PlanLoginResponse =
                        await new Promise<PlanLoginResponse>(
                            async (resolve) => {
                                let getplanInfo: Subscription;

                                const planInfoP: PlanLoginResponse =
                                    await new Promise<PlanLoginResponse>(
                                        (resolve) => {
                                            setTimeout(() => {
                                                getplanInfo =
                                                    this._authService.listenPlanInfo.subscribe(
                                                        (planInfoS) =>
                                                            resolve(planInfoS)
                                                    );
                                            }, 100);
                                        }
                                    );

                                getplanInfo!.unsubscribe();

                                resolve(planInfoP);
                            }
                        );

                    let userId = userInfo.id;

                    if (userInfo.role == UserRole.User) {
                        userId = planInfo.admin!;
                    }

                    const request: ICreateTemplateRequest = {
                        ...this.formCreateTemplate.value,
                        file: this.selectedFile,
                        userId,
                    };

                    this._templatesService.createTemplate(request).subscribe({
                        next: (event) => {
                            if (event.type === HttpEventType.UploadProgress) {
                                this.progressCreatingTemplate = Math.round(
                                    (100 * event.loaded) / event.total
                                );
                            }

                            if (event.type === HttpEventType.Response) {
                                this.isCreating = false;

                                this._snackBar.open(
                                    'Plantilla creada correctamente',
                                    undefined,
                                    {
                                        horizontalPosition: 'end',
                                        verticalPosition: 'top',
                                        duration: 1000,
                                        panelClass: ['snackbar'],
                                    }
                                );

                                this.formCreateTemplate.reset();
                                this.selectedFilename = '';
                            }
                        },
                        error: (error) => {
                            console.log(error);
                            this.isCreating = false;

                            setTimeout(() => {
                                this.isCreating = false;
                            }, 1000);

                            this._snackBar.open(
                                'Hubo un problema al crear la plantilla',
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
                },
                error: (error) => {
                    console.log(error);
                    this.isCreating = false;

                    setTimeout(() => {
                        this.isCreating = false;
                    }, 1000);

                    if (error.error?.message instanceof Array) {
                        error.error.message.forEach((message: string) => {
                            this._snackBar.open(message, 'Cerrar', {
                                horizontalPosition: 'end',
                                verticalPosition: 'top',
                                duration: 3000,
                                panelClass: ['snackbar'],
                            });
                        });
                    } else {
                        if (error.error?.message) {
                            this._snackBar.open(error.error.message, 'Cerrar', {
                                horizontalPosition: 'end',
                                verticalPosition: 'top',
                                duration: 3000,
                                panelClass: ['snackbar'],
                            });
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
}
