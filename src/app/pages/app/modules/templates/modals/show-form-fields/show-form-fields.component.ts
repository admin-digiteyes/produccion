import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { ITemplateFormsControl } from '../../interfaces/i-template-forms-control';
import { ITemplateResponse } from '../../interfaces/i-template-response';
import { IUpdateTemplatesRequest } from '../../interfaces/update-templates-request';
import { TemplatesService } from '../../services/templates.service';

@Component({
    selector: 'app-show-form-fields',
    templateUrl: './show-form-fields.component.html',
    styleUrls: ['./show-form-fields.component.css'],
})
export class ShowFormFieldsComponent implements OnInit, AfterViewInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { template: ITemplateResponse[] },
        private _breakpointObserver: BreakpointObserver,
        private _dialogRef: MatDialogRef<any>,
        private _templatesService: TemplatesService,
        private _authService: AuthService
    ) {
        this.destroyedBreakPoint = new Subject<void>();
        this.formsControl = this.data.template[0].forms_control;
        this.formsControlJoined = [];

        if (this.data.template.length != 1) {
            this.formsControlJoined = this.data.template[1].forms_control;
        }

        this.isCheckedAll = this.checkAllForms();
        this.isCheckedAllJoined = this.checkAllForms(true);
        this.formsInUse = 0;
        this.formsDisabled = 0;
        this.isUpdating = false;
        this.reloadFormsStatus();
    }

    private checkAllForms(joined: boolean = false): boolean {
        if (joined) {
            return (
                this.formsControlJoined.filter((form) => form.enabled).length ==
                this.formsControlJoined.length
            );
        }

        return (
            this.formsControl.filter((form) => form.enabled).length ==
            this.formsControl.length
        );
    }

    private reloadFormsStatus(): void {
        this.formsInUse = this.formsControl
            .concat(this.formsControlJoined)
            .filter((form) => form.enabled).length;
        this.formsDisabled = this.formsControl
            .concat(this.formsControlJoined)
            .filter((form) => !form.enabled).length;
    }

    destroyedBreakPoint: Subject<void>;
    formsControl: ITemplateFormsControl[];
    formsControlJoined: ITemplateFormsControl[];
    isCheckedAll: boolean;
    isCheckedAllJoined: boolean;
    isUpdating: boolean;
    formsInUse: number;
    formsDisabled: number;

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        const displayNameMap = new Map([
            [Breakpoints.XSmall, 'XSmall'],
            [Breakpoints.Small, 'Small'],
            [Breakpoints.Medium, 'Medium'],
            [Breakpoints.Large, 'Large'],
            [Breakpoints.XLarge, 'XLarge'],
        ]);

        this._breakpointObserver
            .observe([
                Breakpoints.XSmall,
                Breakpoints.Small,
                Breakpoints.Medium,
                Breakpoints.Large,
                Breakpoints.XLarge,
            ])
            .pipe(takeUntil(this.destroyedBreakPoint))
            .subscribe((result) => {
                for (const query of Object.keys(result.breakpoints)) {
                    if (result.breakpoints[query]) {
                        const res = displayNameMap.get(query);

                        if (res == 'XSmall') {
                            this._dialogRef.updateSize('400px');
                        }

                        if (res == 'Small') {
                            this._dialogRef.updateSize('600px');
                        }

                        if (res == 'Medium') {
                            this._dialogRef.updateSize('800px');
                        }

                        if (res == 'Large') {
                            this._dialogRef.updateSize('900px');
                        }

                        if (res == 'XLarge') {
                            this._dialogRef.updateSize('80%');
                        }
                    }
                }
            });
    }

    onDrop(
        event: CdkDragDrop<ITemplateFormsControl[]>,
        joined: boolean = false
    ): void {
        if (joined) {
            moveItemInArray(
                this.formsControlJoined,
                event.previousIndex,
                event.currentIndex
            );

            this.updateTemplate(true);
            return;
        }

        moveItemInArray(
            this.formsControl,
            event.previousIndex,
            event.currentIndex
        );

        this.updateTemplate();
    }

    selectAll(joined: boolean = false): void {
        const ifCheckedAll = this.checkAllForms(joined);

        if (!ifCheckedAll) {
            if(joined){
                this.formsControlJoined = this.formsControlJoined.map((form) => {
                    form.enabled = true;
                    return form;
                });

                this.reloadFormsStatus();
                this.isCheckedAllJoined = true;

                this.updateTemplate(true);
                return;
            }

            this.formsControl = this.formsControl.map((form) => {
                form.enabled = true;
                return form;
            });

            this.reloadFormsStatus();
            this.isCheckedAll = true;

            this.updateTemplate();
            return;
        }

        if(joined){
            this.formsControlJoined = this.formsControlJoined.map((form) => {
                form.enabled = false;
                return form;
            });

            this.reloadFormsStatus();
            this.isCheckedAllJoined = false;

            this.updateTemplate(true);
            return;
        }

        this.formsControl = this.formsControl.map((form) => {
            form.enabled = false;
            return form;
        });

        this.reloadFormsStatus();
        this.isCheckedAll = false;

        this.updateTemplate();
        return;
    }

    toggleForm(form: ITemplateFormsControl, joined: boolean = false): void {
        if (joined) {
            form.enabled = !form.enabled;
            this.isCheckedAllJoined = this.checkAllForms(true);
            this.reloadFormsStatus();

            this.updateTemplate(true);
            return;
        }

        form.enabled = !form.enabled;
        this.isCheckedAll = this.checkAllForms();
        this.reloadFormsStatus();

        this.updateTemplate();
    }

    async updateTemplate(joined: boolean = false): Promise<void> {
        if (this.isUpdating) {
            return;
        }

        this.isUpdating = true;

        const token = await this._authService.getToken();

        const request: IUpdateTemplatesRequest = {
            id: joined ? this.data.template[1].id : this.data.template[0].id,
            name: joined
                ? this.data.template[1].name
                : this.data.template[0].name,
            forms_control: joined
                ? this.data.template[1].forms_control
                : this.data.template[0].forms_control,
            token,
        };

        this._templatesService.updateTemplates(request).subscribe({
            next: (result) => {
                this.isUpdating = false;
            },
            error: (error) => {
                this.isUpdating = false;
            },
        });
    }
}
