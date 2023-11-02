import { AppMainComponent } from './components/app-main/app-main.component';
import { AppxRoutingModule } from './app-x-routing.module';
import { ArrayIncludesPipe } from './pipes/array-includes.pipe';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { NotifierModule } from 'angular-notifier';
import { ReactiveFormsModule } from '@angular/forms';
import { ToggleMenuOptionPipe } from './pipes/toggle-menu-option.pipe';

@NgModule({
    declarations: [AppMainComponent, ArrayIncludesPipe, ToggleMenuOptionPipe],
    imports: [
        CommonModule,
        AppxRoutingModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
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
    ]
})
export class AppXModule {}
