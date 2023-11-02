import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { ICreateUserTeamsRequest } from '../../interfaces/create-user-teams-request';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from '../../services/settings.service';

@Component({
    selector: 'app-create-user-team',
    templateUrl: './create-user-team.component.html',
    styleUrls: ['./create-user-team.component.css'],
})
export class CreateUserTeamComponent implements OnInit {
    constructor(
        private _formBuilder: FormBuilder,
        private _dialogRef: MatDialogRef<any>,
        private _authService: AuthService,
        private _settingsService: SettingsService,
        private _snackBar: MatSnackBar
    ) {
        this.isCreating = false;
        this.formCreate = this._formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    isCreating: boolean;
    formCreate: FormGroup;

    ngOnInit(): void {}

    async create(): Promise<void> {
        if (this.isCreating) {
            return;
        }

        if (this.formCreate.invalid) {
            return;
        }

        this.isCreating = true;

        const token: string = await this._authService.getToken();

        const request: ICreateUserTeamsRequest = {
            ...this.formCreate.value,
            token,
        };

        this._settingsService.createUser(request).subscribe({
            next: (response) => {
                this.isCreating = false;

                this._snackBar.open(
                    'Usuario creado correctamente',
                    'Cerrar',
                    {
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                        duration: 3000,
                        panelClass: ['snackbar'],
                    }
                );

                this._dialogRef.close(true);
            },
            error: (error) => {
                this.isCreating = false;

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

    close(): void {
        this._dialogRef.close(false);
    }
}
