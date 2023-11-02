import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './components/main/main.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
    },
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomeRoutingModule {}
