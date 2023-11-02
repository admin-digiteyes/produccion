import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { AfterViewInit, Component, OnInit } from '@angular/core';

import { AuthService } from '../../../services/auth.service';
import { ILoginRequest } from '../../../interfaces/login-request';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { init } from 'aos';

@Component({
    selector: 'app-login-main',
    templateUrl: './login-main.component.html',
    styleUrls: ['./login-main.component.css'],
})
export class LoginMainComponent implements OnInit, AfterViewInit {
    constructor(
        private _fb: FormBuilder,
        private _authService: AuthService,
        private _notificationService: NotifierService,
        private _router: Router
    ) {
        this.formLogin = this._fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(30),
                ],
            ],
        });

        this.isLogin = true;
    }

    get email(): AbstractControl<any, any> | null {
        return this.formLogin.get('email');
    }

    get password(): AbstractControl<any, any> | null {
        return this.formLogin.get('password');
    }

    formLogin: FormGroup;
    isLogin: boolean;

    ngOnInit(): void {}

    async ngAfterViewInit(): Promise<void> {
        const loadAOS = new Promise<void>((resolve) => {
            setTimeout(() => {
                init();
                resolve();
            }, 500);
        });

        await loadAOS;

        this._authService
            .getToken()
            .then(async () => {
                await this._router.navigate(['/app']);
            })
            .finally(() => {
                this.isLogin = false;
            });
    }

    login(): void {
        if (this.formLogin.invalid) {
            this.formLogin.markAllAsTouched();
            return;
        }

        if (this.isLogin) {
            return;
        }

        this.isLogin = true;

        const request: ILoginRequest = {
            ...this.formLogin.value,
        };

        this._authService.login(request).subscribe({
            next: (response) => {
                this.isLogin = false;

                this._authService.updateUserInfo(response.user);
                this._authService.updatePlanInfo(response.plan);
                this._authService.updateDataInfo(response.info);
                this._authService.setToken(response.token);

                this._router.navigate(['/app']);
            },
            error: (error: any) => {
                this.isLogin = false;

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
}
