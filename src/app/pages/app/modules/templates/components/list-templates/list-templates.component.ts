import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppSocketService } from 'src/app/pages/app/services/app-socket.service';
import { AskDeleteTemplateComponent } from 'src/app/pages/app/modules/templates/modals/ask-delete-template/ask-delete-template.component';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { ISumaryTemplate } from '../../interfaces/sumary-template';
import { ITemplateResponse } from '../../interfaces/i-template-response';
import { ITemplatesRequest } from '../../interfaces/templates-request';
import { IUpdateTemplatesRequest } from '../../interfaces/update-templates-request';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { ShowFormFieldsComponent } from '../../modals/show-form-fields/show-form-fields.component';
import { Subscription } from 'rxjs';
import { TemplatesService } from '../../services/templates.service';
import { TypeNotificationWsEnum } from 'src/app/pages/app/enums/type-notification-ws.enum';

@Component({
    selector: 'app-app-plantillas-listar',
    templateUrl: './list-templates.component.html',
    styleUrls: ['./list-templates.component.css'],
})
export class ListTemplatesComponent implements OnInit, OnDestroy {
    constructor(
        private _templatesService: TemplatesService,
        private _authService: AuthService,
        private _dialog: MatDialog,
        private _fb: FormBuilder,
        private _snackBar: MatSnackBar,
        private _appSocketService: AppSocketService
    ) {
        this.templates = [];
        this.templatesResponse = [];
        this.isPaginating = true;
        this.editTemplateIndex = -1;

        this.templatesPaginator = new PageEvent();
        this.templatesPaginator.pageSize = 3;
        this.templatesPaginator.length = 0;

        this.sumaryTemplate = {
            completeds: 0,
            pending: 0,
            errored: 0,
        };

        this.formEditTemplate = this._fb.group({
            name: [
                '',
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(255),
                ],
            ],
        });
    }

    templates: ITemplateResponse[];
    templatesResponse: ITemplateResponse[];
    templatesPaginator: PageEvent;
    sumaryTemplate: ISumaryTemplate;
    isPaginating: boolean;
    editTemplateIndex: number;
    formEditTemplate: FormGroup;

    listenNotificationWs!: Subscription;

    async ngOnInit(): Promise<void> {
        const token: string = await this._authService.getToken()!;
        const pageIndex = this.templatesPaginator.pageIndex - 1;

        const request: ITemplatesRequest = {
            paginator: {
                pageIndex: pageIndex | 0,
            },
            token,
        };

        this._templatesService.getTemplates(request).subscribe({
            next: (response) => {
                this.isPaginating = false;
                this.templatesResponse = JSON.parse(JSON.stringify(response.templates));

                for (const template of response.templates) {
                    if(!this.templates.find(templateF => templateF.joined == template.joined)){
                        if(template.joined){
                            template.type = 'INVOICES';
                            this.templates.push(template);
                        }else{
                            this.templates.push(template);
                        }
                    }
                }

                this.templatesPaginator.length = response.paginator.length;

                this.sumaryTemplate = { ...response.sumary };
            },
            error: (error) => {
                this.isPaginating = false;
                console.log(error);
            },
        });

        this.listenNotificationWs =
            this._appSocketService.listenNotificationWs.subscribe(
                (response) => {
                    if (
                        response.type == TypeNotificationWsEnum.STATE_TEMPLATE
                    ) {
                        this.paginate();
                    }
                }
            );
    }

    ngOnDestroy(): void {
        if (this.listenNotificationWs) {
            this.listenNotificationWs.unsubscribe();
        }
    }

    async paginate(event?: PageEvent): Promise<void> {
        if (this.isPaginating) {
            return;
        }

        this.isPaginating = true;

        const { pageIndex } = event || this.templatesPaginator;
        const token: string = await this._authService.getToken()!;
        const request: ITemplatesRequest = {
            paginator: {
                pageIndex: pageIndex | 0,
            },
            token,
        };

        this.templates = [];

        this._templatesService.getTemplates(request).subscribe({
            next: (response) => {
                this.isPaginating = false;
                this.templatesResponse = JSON.parse(JSON.stringify(response.templates));

                for (const template of response.templates) {
                    if(!this.templates.find(templateF => templateF.joined == template.joined)){
                        if(template.joined){
                            template.type = 'INVOICES';
                            this.templates.push(template);
                        }else{
                            this.templates.push(template);
                        }
                    }
                }

                this.templatesPaginator.length = response.paginator.length;
                this.sumaryTemplate = { ...response.sumary };
            },
            error: (error) => {
                this.isPaginating = false;
                console.log(error);
            },
        });
    }

    showFormFields(template: ITemplateResponse): void {
        let templates: ITemplateResponse[] = [];

        if(template.joined){
            templates = this.templatesResponse.filter(
                (templateF) => templateF.joined == template.joined
            );
        }else{
            templates = [template]
        }

        // First position template type form and second position template type table
        templates = templates.sort((a, b) => {
            if (a.type == 'FORMS') {
                return -1;
            } else {
                return 1;
            }
        });

        this._dialog.open(ShowFormFieldsComponent, {
            width: '400px',
            hasBackdrop: true,
            data: {
                template: templates,
            },
        });
    }

    async deleteTemplate(template: ITemplateResponse): Promise<void> {
        if (this.editTemplateIndex != -1) {
            template.name = this.formEditTemplate.value.name;

            const token = await this._authService.getToken();

            const request: IUpdateTemplatesRequest = {
                ...template,
                token,
            };

            this.isPaginating = true;

            this._templatesService.updateTemplates(request).subscribe({
                next: (response) => {
                    this.isPaginating = false;

                    this.paginate();

                    this._snackBar.open(
                        'Plantilla editada correctamente',
                        undefined,
                        {
                            horizontalPosition: 'end',
                            verticalPosition: 'top',
                            duration: 3000,
                            panelClass: ['snackbar'],
                        }
                    );

                    this.editTemplateIndex = -1;
                    this.formEditTemplate.reset();
                },
                error: (error) => {
                    this.isPaginating = false;

                    this._snackBar.open(
                        'Hubo un problema al editar la plantilla',
                        undefined,
                        {
                            horizontalPosition: 'end',
                            verticalPosition: 'top',
                            duration: 3000,
                            panelClass: ['snackbar'],
                        }
                    );
                },
            });

            return;
        }

        const dialog = this._dialog.open(AskDeleteTemplateComponent, {
            width: '400px',
            hasBackdrop: true,
            disableClose: true,
            data: { template },
        });

        dialog.afterClosed().subscribe((result) => {
            if (result === false) {
                this.paginate(this.templatesPaginator);
            }
        });
    }

    showEditTemplate(template: ITemplateResponse): void {
        if (this.editTemplateIndex == -1) {
            this.editTemplateIndex = template.id;
            this.formEditTemplate.patchValue({
                name: template.name,
            });

            return;
        }

        this.editTemplateIndex = -1;
        this.formEditTemplate.reset();
    }
}
