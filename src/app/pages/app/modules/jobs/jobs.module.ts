import {
    MAT_DIALOG_DEFAULT_OPTIONS,
    MatDialogModule,
} from '@angular/material/dialog';
import {
    MatPaginatorIntl,
    MatPaginatorModule,
} from '@angular/material/paginator';

import { AskDeleteJobComponent } from './modals/ask-delete-job/ask-delete-job.component';
import { CommonModule } from '@angular/common';
import { CreateJobComponent } from './components/create-job/create-job.component';
import { JobAskDeleteFileComponent } from './modals/ask-delete-file/job-ask-delete-file.component';
import { JobsRoutingModule } from './jobs-routing.module';
import { ListJobsComponent } from './components/list-jobs/list-jobs.component';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { PaginationLanguageService } from '../../services/pagination-language.service';
import { SelectTemplateListComponent } from './modals/select-template-list/select-template-list.component';

@NgModule({
    declarations: [
        CreateJobComponent,
        ListJobsComponent,
        SelectTemplateListComponent,
        AskDeleteJobComponent,
        JobAskDeleteFileComponent,
    ],
    imports: [
        CommonModule,
        JobsRoutingModule,
        MatProgressBarModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatChipsModule,
        MatPaginatorModule,
        MatDialogModule,
        MatSnackBarModule,
        MatInputModule,
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: PaginationLanguageService },
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: { hasBackdrop: false },
        },
    ],
})
export class JobsModule {}
