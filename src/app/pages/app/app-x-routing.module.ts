import { RouterModule, Routes } from '@angular/router';

import { AppLoggedGuard } from './guards/app-logged.guard';
import { AppMainComponent } from './components/app-main/app-main.component';
import { LogoutResolver } from './resolvers/logout.resolver';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: AppMainComponent,
        canActivate: [AppLoggedGuard],
        children: [
            {
                path: 'board',
                loadChildren: () =>
                    import('./modules/tablero/tablero.module').then(
                        (m) => m.TableroModule
                    ),
            },
            {
                path: 'template',
                loadChildren: () =>
                    import('./modules/templates/templates.module').then(
                        (m) => m.TemplatesModule
                    ),
            },
            {
                path: 'job',
                loadChildren: () =>
                    import('./modules/jobs/jobs.module').then(
                        (m) => m.JobsModule
                    ),
            },
            {
                path: 'settings',
                loadChildren: () =>
                    import('./modules/settings/settings.module').then(
                        (m) => m.SettingsModule
                    ),
            },
            {
                path: 'logout',
                resolve: [LogoutResolver],
                loadChildren: () =>
                    import('./modules/settings/settings.module').then(
                        (m) => m.SettingsModule
                    ),
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'board/main',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppxRoutingModule {}
