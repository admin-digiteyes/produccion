import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { TableroEntrarComponent } from './components/tablero-entrar/tablero-entrar.component';

const routes: Routes = [
    {
        path: 'main',
        component: TableroEntrarComponent,
    },
    {
        path: '**',
        redirectTo: 'main',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TableroRoutingModule {}
