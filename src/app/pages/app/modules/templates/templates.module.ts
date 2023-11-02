import {
    MAT_DIALOG_DEFAULT_OPTIONS,
    MatDialogModule,
} from '@angular/material/dialog';
import {
    MatPaginatorIntl,
    MatPaginatorModule,
} from '@angular/material/paginator';

import { AskDeleteTemplateComponent } from './modals/ask-delete-template/ask-delete-template.component';
import { CommonModule } from '@angular/common';
import { CreateTemplateComponent } from './components/create-template/create-template.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ListTemplatesComponent } from './components/list-templates/list-templates.component';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { PaginationLanguageService } from '../../services/pagination-language.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowFormFieldsComponent } from './modals/show-form-fields/show-form-fields.component';
import { SortFormControlsPipe } from '../../pipes/sort-form-controls.pipe';
import { TemplatesRoutingModule } from './templates-routing.module';

@NgModule({
    declarations: [
        CreateTemplateComponent,
        ListTemplatesComponent,
        AskDeleteTemplateComponent,
        ShowFormFieldsComponent,
        SortFormControlsPipe,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DragDropModule,
        MatSlideToggleModule,
        TemplatesRoutingModule,
        MatIconModule,
        MatTooltipModule,
        MatProgressBarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatChipsModule,
        MatPaginatorModule,
        MatSelectModule,
        MatInputModule,
        MatDialogModule,
        MatSnackBarModule,
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: PaginationLanguageService },
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: { hasBackdrop: false },
        },
    ],
})
export class TemplatesModule {}
