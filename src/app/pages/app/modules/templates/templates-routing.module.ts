import { RouterModule, Routes } from '@angular/router';

import { CreateTemplateComponent } from './components/create-template/create-template.component';
import { ListTemplatesComponent } from './components/list-templates/list-templates.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: 'create',
        component: CreateTemplateComponent,
    },
    {
        path: 'list',
        component: ListTemplatesComponent,
    },
    {
        path: '**',
        redirectTo: 'list',
        pathMatch: 'full',
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplatesRoutingModule { }
