import { RouterModule, Routes } from '@angular/router';

import { LoginMainComponent } from './components/login/login-main/login-main.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: 'login',
        component: LoginMainComponent,
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
