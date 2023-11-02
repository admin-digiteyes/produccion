import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

const routes: Routes = [
    // {
    //     path: '',
    //     loadChildren: () =>
    //         import('./pages/home/home.module').then((m) => m.HomeModule),
    // },
    {
        path: '',
        loadChildren: () =>
            import('./pages/auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'app',
        loadChildren: () =>
            import('./pages/app/app-x.module').then((m) => m.AppXModule),
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
