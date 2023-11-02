import { RouterModule, Routes } from '@angular/router';

import { CreateJobComponent } from './components/create-job/create-job.component';
import { ListJobsComponent } from './components/list-jobs/list-jobs.component';
import { NgModule } from '@angular/core';
import { ValidationPlanGuard } from './guards/validation-plan.guard';

const routes: Routes = [
    {
        path: 'analyze',
        component: CreateJobComponent,
        canActivate: [ValidationPlanGuard]
    },
    {
        path: 'list',
        component: ListJobsComponent,
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
export class JobsRoutingModule { }
