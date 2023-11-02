import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { AppSocketService } from 'src/app/pages/app/services/app-socket.service';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { ISumaryTemplate } from '../../../templates/interfaces/sumary-template';
import { ITemplateResponse } from '../../../templates/interfaces/i-template-response';
import { ITemplatesRequest } from '../../../templates/interfaces/templates-request';
import { PageEvent } from '@angular/material/paginator';
import { ShowFormFieldsComponent } from '../../../../modules/templates/modals/show-form-fields/show-form-fields.component';
import { Subscription } from 'rxjs';
import { TemplatesService } from '../../../templates/services/templates.service';
import { TypeNotificationWsEnum } from 'src/app/pages/app/enums/type-notification-ws.enum';

@Component({
    selector: 'job-select-template-list',
    templateUrl: './select-template-list.component.html',
    styleUrls: ['./select-template-list.component.css'],
})
export class SelectTemplateListComponent implements OnInit {
    constructor(
        private _templatesService: TemplatesService,
        private _authService: AuthService,
        private _dialog: MatDialog,
        private _dialogRef: MatDialogRef<any>,
        private _appSocketService: AppSocketService
    ) {
        this.templates = [];
        this.templatesResponse = [];
        this.isPaginating = true;

        this.templatesPaginator = new PageEvent();
        this.templatesPaginator.pageSize = 3;
        this.templatesPaginator.length = 0;

        this.sumaryTemplate = {
            completeds: 0,
            pending: 0,
            errored: 0,
        };
    }

    templates: ITemplateResponse[];
    templatesResponse: ITemplateResponse[];

    templatesPaginator: PageEvent;
    sumaryTemplate: ISumaryTemplate;
    isPaginating: boolean;

    listenNotificationWs!: Subscription;

    async ngOnInit(): Promise<void> {
        const token: string = await this._authService.getToken();
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
                this.templatesResponse = response.templates;

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
        const token: string = await this._authService.getToken();
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
    }

    showFormFields(template: ITemplateResponse): void {
        this._dialog.open(ShowFormFieldsComponent, {
            width: '550px',
            hasBackdrop: true,
            data: {
                template,
            },
        });
    }

    selectTemplate(template?: ITemplateResponse): void {
        if (template) {
            this._dialogRef.close(template);
        } else {
            this._dialogRef.close(null);
        }
    }
}
