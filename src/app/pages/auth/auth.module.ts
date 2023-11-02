import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { LoginMainComponent } from './components/login/login-main/login-main.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgModule } from '@angular/core';
import { NotifierModule } from 'angular-notifier';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [LoginMainComponent],
    imports: [
        CommonModule,
        AuthRoutingModule,
        MatButtonModule,
        ReactiveFormsModule,
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
    ],
})
export class AuthModule {}
