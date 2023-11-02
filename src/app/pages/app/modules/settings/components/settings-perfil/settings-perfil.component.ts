import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { IUpdateUserPersonalInformationRequest } from '../../interfaces/update-user-personal-information-request';
import { IUpdateUserSecurityRequest } from '../../interfaces/update-user-security-request';
import { IUser } from 'src/app/shared/interfaces/user';
import { NotifierService } from 'angular-notifier';
import { SettingsService } from '../../services/settings.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'settings-perfil',
    templateUrl: './settings-perfil.component.html',
    styleUrls: ['./settings-perfil.component.css'],
})
export class SettingsPerfilComponent implements OnInit {
    constructor(
        private _authService: AuthService,
        private _settingsService: SettingsService,
        private _fb: FormBuilder,
        private _notifierService: NotifierService
    ) {
        this.formPersonalInformation = this._fb.group({
            name: [
                '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(30),
                ],
            ],
            email: [
                '',
                [Validators.required, Validators.email],
            ],
            current_password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(30),
                ],
            ],
        });

        this.formSecurity = this._fb.group({
            new_password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(30),
                ],
            ],
            confirm_password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(30),
                ],
            ],
            current_password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(30),
                ],
            ],
        });

        this.isUpdatingPersonalInformation = false;
        this.isUpdatingSecurity = false;
    }

    get newPassword(): AbstractControl<any, any> | null {
        return this.formSecurity.get('new_password');
    }

    get confirmPassword(): AbstractControl<any, any> | null {
        return this.formSecurity.get('confirm_password');
    }

    isUpdatingPersonalInformation: boolean;
    formPersonalInformation: FormGroup;
    isUpdatingSecurity: boolean;
    formSecurity: FormGroup;

    async ngOnInit(): Promise<void> {
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

        this.formPersonalInformation.patchValue({
            email: userInfo.email,
            name: userInfo.name
        });
    }

    async updatePersonalInformation(): Promise<void> {
        if (this.isUpdatingPersonalInformation) {
            return;
        }

        if (this.formPersonalInformation.invalid) {
            this.formPersonalInformation.markAllAsTouched();
            return;
        }

        this.isUpdatingPersonalInformation = true;

        const token = await this._authService.getToken();

        const request: IUpdateUserPersonalInformationRequest = {
            name: this.formPersonalInformation.value.name,
            email: this.formPersonalInformation.value.email,
            current_password:
                this.formPersonalInformation.value.current_password,
            token,
        };

        this._settingsService.updateUserPersonalInformation(request).subscribe({
            next: async () => {
                this.isUpdatingPersonalInformation = false;

                this._notifierService.notify(
                    'info',
                    'Información actualizada correctamente'
                );

                this.formPersonalInformation.patchValue({
                    current_password: '',
                });
                this.formPersonalInformation.markAsUntouched();

                await this._authService.getToken()
            },
            error: (error) => {
                this.isUpdatingPersonalInformation = false;

                if (error.error?.message instanceof Array) {
                    error.error.message.forEach((message: string) => {
                        this._notifierService.notify('error', message);
                    });
                } else {
                    if (error.error?.message) {
                        this._notifierService.notify(
                            'error',
                            error.error.message
                        );
                    } else {
                        this._notifierService.notify(
                            'error',
                            'Verifique su conexión a internet'
                        );
                    }
                }
            },
        });
    }

    async updateSecurity(): Promise<void> {
        if (this.isUpdatingSecurity) {
            return;
        }

        if (this.formSecurity.invalid) {
            this.formSecurity.markAllAsTouched();
            return;
        }

        if (this.newPassword?.value != this.confirmPassword?.value) {
            return;
        }

        this.isUpdatingSecurity = true;

        const token = await this._authService.getToken();

        const request: IUpdateUserSecurityRequest = {
            current_password: this.formSecurity.value.current_password,
            new_password: this.formSecurity.value.new_password,
            token,
        };

        this._settingsService.updateUserSecurity(request).subscribe({
            next: () => {
                this.isUpdatingSecurity = false;

                this._notifierService.notify(
                    'info',
                    'Contraseña actualizada correctamente'
                );

                this.formSecurity.reset();
            },
            error: (error) => {
                this.isUpdatingSecurity = false;

                if (error.error?.message instanceof Array) {
                    error.error.message.forEach((message: string) => {
                        this._notifierService.notify('error', message);
                    });
                } else {
                    if (error.error?.message) {
                        this._notifierService.notify(
                            'error',
                            error.error.message
                        );
                    } else {
                        this._notifierService.notify(
                            'error',
                            'Verifique su conexión a internet'
                        );
                    }
                }
            },
        });
    }
}
