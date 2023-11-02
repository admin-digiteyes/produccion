import { CommonModule } from '@angular/common';
import { CreateUserTeamComponent } from './modals/create-user-team/create-user-team.component';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { NotifierModule } from 'angular-notifier';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsAskDeleteUserTeamComponent } from './modals/ask-delete-user-team/settings-ask-delete-user-team.component';
import { SettingsMiEquipoComponent } from './components/settings-mi-equipo/settings-mi-equipo.component';
import { SettingsPerfilComponent } from './components/settings-perfil/settings-perfil.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
    declarations: [
        SettingsPerfilComponent,
        SettingsMiEquipoComponent,
        CreateUserTeamComponent,
        SettingsAskDeleteUserTeamComponent,
    ],
    imports: [
        CommonModule,
        SettingsRoutingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatInputModule,
        MatButtonModule,
        NotifierModule.withConfig({
            position: {
                horizontal: {
                    position: 'right',
                },
                vertical: {
                    position: 'top',
                },
            },
            behaviour: {
                autoHide: 4000,
                showDismissButton: false,
            },
            animations: {
                enabled: true,
                show: {
                    preset: 'slide',
                    speed: 300,
                    easing: 'ease-in-out',
                },
                hide: {
                    preset: 'slide',
                    speed: 300,
                    easing: 'ease-in-out',
                    offset: 50,
                },
            },
        }),
        MatProgressBarModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatChipsModule,
        MatPaginatorModule,
        MatDialogModule,
        MatSnackBarModule,
    ],
})
export class SettingsModule {}
